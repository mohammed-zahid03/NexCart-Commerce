package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.*;
import com.ecommerce.project.payload.OrderDTO;
import com.ecommerce.project.payload.OrderItemDTO;
import com.ecommerce.project.payload.OrderResponse;
import com.ecommerce.project.payload.OrderStatusHistoryDTO;
import com.ecommerce.project.repositories.*;
import com.ecommerce.project.util.AuthUtil;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.ecommerce.project.payload.ReturnRequestDTO;
import com.ecommerce.project.payload.ProductDTO;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    CartRepository cartRepository;

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    ReturnRequestRepository returnRequestRepository;

    @Autowired
    CartService cartService;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    AuthUtil authUtil;

    @Autowired
    AuditLogService auditLogService;

    @Autowired
    StripeService stripeService;

    @Autowired
    NotificationService notificationService;


    // =========================================================
    // PLACE ORDER
    // =========================================================

    @Override
    @Transactional
    public OrderDTO placeOrder(
            String emailId,
            Long addressId,
            String paymentMethod,
            String pgName,
            String pgPaymentId,
            String pgStatus,
            String pgResponseMessage
    ) {

        Cart cart = cartRepository.findCartByEmail(emailId);

        if (cart == null) {
            throw new ResourceNotFoundException("Cart", "email", emailId);
        }

        User loggedInUser = authUtil.loggedInUser();

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Address",
                                "addressId",
                                addressId
                        )
                );

        if (address.getUser() == null
                || !address.getUser().getUserId()
                .equals(loggedInUser.getUserId())) {

            throw new APIException(
                    "You are not authorized to use this address."
            );
        }

// Verify that the address belongs to the logged-in user
        if (!address.getUser().getEmail().equalsIgnoreCase(emailId)) {
            throw new APIException(
                    "You are not authorized to use this address."
            );
        }

        if (cart.getCartItems().isEmpty()) {
            throw new APIException("Cart is empty");
        }


// ---------------------------------------------------------
// Verify stock before creating the order
// ---------------------------------------------------------
        List<CartItem> cartItems = cart.getCartItems();

        // ---------------------------------------------------------
// Verify stock before creating the order
// ---------------------------------------------------------

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            if (product == null) {
                throw new APIException("Product not found in cart.");
            }

            Integer availableStock = product.getQuantity();

            if (availableStock == null || availableStock < cartItem.getQuantity()) {
                throw new APIException(
                        "Insufficient stock for product: "
                                + product.getProductName()
                );
            }
        }

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            if (product == null) {
                throw new APIException("Product not found in cart.");
            }

            Integer requestedQuantity = cartItem.getQuantity();
            Integer availableQuantity = product.getQuantity();

            if (requestedQuantity == null || requestedQuantity <= 0) {
                throw new APIException(
                        "Invalid quantity for product: " + product.getProductName()
                );
            }

            if (availableQuantity == null || availableQuantity < requestedQuantity) {
                throw new APIException(
                        "Insufficient stock for product: "
                                + product.getProductName()
                                + ". Available: "
                                + (availableQuantity == null ? 0 : availableQuantity)
                                + ", Requested: "
                                + requestedQuantity
                );
            }
        }


// ---------------------------------------------------------
// Verify Stripe payment server-side
// ---------------------------------------------------------
        if ("Stripe".equalsIgnoreCase(paymentMethod)) {

            if (pgPaymentId == null || pgPaymentId.trim().isEmpty()) {
                throw new APIException("Stripe payment ID is required.");
            }

            try {
                PaymentIntent paymentIntent =
                        stripeService.verifyPayment(pgPaymentId);

                // Verify that Stripe says the payment actually succeeded
                if (!"succeeded".equalsIgnoreCase(paymentIntent.getStatus())) {
                    throw new APIException(
                            "Stripe payment has not succeeded."
                    );
                }

                // Verify that the amount paid matches the server-side cart total
                long expectedAmount =
                        Math.round(cart.getTotalPrice() * 100);

                if (paymentIntent.getAmount() == null
                        || paymentIntent.getAmount() != expectedAmount) {
                    throw new APIException(
                            "Stripe payment amount does not match the order total."
                    );
                }

                // Verify currency
                if (paymentIntent.getCurrency() == null
                        || !"inr".equalsIgnoreCase(paymentIntent.getCurrency())) {
                    throw new APIException(
                            "Invalid Stripe payment currency."
                    );
                }

                // Do NOT trust these values from the client.
                // Use values verified from Stripe instead.
                pgStatus = paymentIntent.getStatus();
                pgPaymentId = paymentIntent.getId();
                pgResponseMessage = "Stripe payment verified successfully";
                pgName = "Stripe";

            } catch (StripeException e) {
                throw new APIException(
                        "Unable to verify Stripe payment."
                );
            }
        }

        // ---------------------------------------------------------
        // Create order
        // ---------------------------------------------------------

        Order order = new Order();

        order.setEmail(emailId);
        order.setOrderDate(LocalDate.now());
        order.setTotalAmount(cart.getTotalPrice());

        // Current order status
        order.setOrderStatus("Accepted");

        // Delivery address
        order.setAddress(address);


        // ---------------------------------------------------------
        // Create payment
        // ---------------------------------------------------------

        Payment payment = new Payment(
                paymentMethod,
                pgPaymentId,
                pgStatus,
                pgResponseMessage,
                pgName
        );

        payment.setOrder(order);

        payment = paymentRepository.save(payment);

        order.setPayment(payment);


        // ---------------------------------------------------------
        // Save order
        // ---------------------------------------------------------

        Order savedOrder = orderRepository.save(order);


        // ---------------------------------------------------------
        // Create order items
        // ---------------------------------------------------------


        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {

            OrderItem orderItem = new OrderItem();

            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setDiscount(cartItem.getDiscount());
            orderItem.setOrderedProductPrice(
                    cartItem.getProductPrice()
            );
            orderItem.setOrder(savedOrder);

            orderItems.add(orderItem);
        }

        orderItems = orderItemRepository.saveAll(orderItems);


        // ---------------------------------------------------------
        // Create initial order-status history
        // ---------------------------------------------------------

        LocalDateTime orderCreatedAt = LocalDateTime.now();

        List<OrderStatusHistory> statusHistory = new ArrayList<>();

        // 1. Order placed
        OrderStatusHistory orderPlaced = new OrderStatusHistory();

        orderPlaced.setOrder(savedOrder);
        orderPlaced.setStatus("Order Placed");
        orderPlaced.setChangedAt(orderCreatedAt);

        statusHistory.add(orderPlaced);


        // 2. Payment confirmed
        OrderStatusHistory paymentConfirmed = new OrderStatusHistory();

        paymentConfirmed.setOrder(savedOrder);
        paymentConfirmed.setStatus("Payment Confirmed");
        paymentConfirmed.setChangedAt(orderCreatedAt);

        statusHistory.add(paymentConfirmed);


        // 3. Order accepted
        OrderStatusHistory orderAccepted = new OrderStatusHistory();

        orderAccepted.setOrder(savedOrder);
        orderAccepted.setStatus("Accepted");
        orderAccepted.setChangedAt(orderCreatedAt);

        statusHistory.add(orderAccepted);

        orderStatusHistoryRepository.saveAll(statusHistory);


        // ---------------------------------------------------------
        // Reduce product stock and clear cart
        // ---------------------------------------------------------

        cart.getCartItems().forEach(item -> {

            int quantity = item.getQuantity();

            Product product = item.getProduct();

            // Atomically reduce stock
            int updatedRows = productRepository.decreaseStock(
                    product.getProductId(),
                    quantity
            );

            if (updatedRows == 0) {
                throw new APIException(
                        "Insufficient stock for product: "
                                + product.getProductName()
                );
            }

            // Remove product from cart
            cartService.deleteProductFromCart(
                    cart.getCartId(),
                    product.getProductId()
            );
        });


        // ---------------------------------------------------------
        // Create response
        // ---------------------------------------------------------

        OrderDTO orderDTO =
                modelMapper.map(
                        savedOrder,
                        OrderDTO.class
                );

        orderDTO.setOrderItems(new ArrayList<>());

        orderItems.forEach(item ->
                orderDTO.getOrderItems().add(
                        modelMapper.map(
                                item,
                                OrderItemDTO.class
                        )
                )
        );

        orderDTO.setAddressId(addressId);

        orderDTO.setStatusHistory(
                statusHistory.stream()
                        .map(history ->
                                new OrderStatusHistoryDTO(
                                        history.getStatus(),
                                        history.getChangedAt()
                                )
                        )
                        .toList()
        );

        return orderDTO;
    }


    // =========================================================
    // GET USER ORDERS
    // =========================================================

    @Override
    @Transactional
    public List<OrderDTO> getUserOrders(String emailId) {

        List<Order> orders =
                orderRepository.findByEmailOrderByOrderDateDesc(emailId);

        return orders.stream()
                .map(this::mapOrderToDTO)
                .toList();
    }


    // =========================================================
    // GET ALL ORDERS
    // =========================================================

    @Override
    public OrderResponse getAllOrders(
            Integer pageNumber,
            Integer pageSize,
            String sortBy,
            String sortOrder
    ) {

        Sort sortByAndOrder =
                sortOrder.equalsIgnoreCase("asc")
                        ? Sort.by(sortBy).ascending()
                        : Sort.by(sortBy).descending();

        Pageable pageDetails =
                PageRequest.of(
                        pageNumber,
                        pageSize,
                        sortByAndOrder
                );

        Page<Order> pageOrders =
                orderRepository.findAll(pageDetails);

        List<Order> orders =
                pageOrders.getContent();

        List<OrderDTO> orderDTOs =
                orders.stream()
                        .map(this::mapOrderToDTO)
                        .toList();

        OrderResponse orderResponse =
                new OrderResponse();

        orderResponse.setContent(orderDTOs);
        orderResponse.setPageNumber(
                pageOrders.getNumber()
        );
        orderResponse.setPageSize(
                pageOrders.getSize()
        );
        orderResponse.setTotalElements(
                pageOrders.getTotalElements()
        );
        orderResponse.setTotalPages(
                pageOrders.getTotalPages()
        );
        orderResponse.setLastPage(
                pageOrders.isLast()
        );

        return orderResponse;
    }


    // =========================================================
    // UPDATE ORDER STATUS
    // =========================================================

    @Override
    @Transactional
    public OrderDTO updateOrder(
            Long orderId,
            String status
    ) {

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order",
                                        "orderId",
                                        orderId
                                )
                        );





        // ---------------------------------------------------------
        // Prevent duplicate status-history entries
        // ---------------------------------------------------------

        String currentStatus =
                order.getOrderStatus();

        if (currentStatus != null
                && currentStatus.equalsIgnoreCase(status)) {

            return mapOrderToDTO(order);
        }


        // ---------------------------------------------------------
// Validate order status transition
// ---------------------------------------------------------

        if (status == null || status.isBlank()) {
            throw new APIException("Order status is required.");
        }

        String newStatus = status.trim();

        if (!newStatus.equalsIgnoreCase("Pending")
                && !newStatus.equalsIgnoreCase("Accepted")
                && !newStatus.equalsIgnoreCase("Processing")
                && !newStatus.equalsIgnoreCase("Shipped")
                && !newStatus.equalsIgnoreCase("Delivered")
                && !newStatus.equalsIgnoreCase("Cancelled")
                && !newStatus.equalsIgnoreCase("Returned")) {

            throw new APIException(
                    "Invalid order status: " + newStatus
            );
        }

        if (currentStatus == null || currentStatus.isBlank()) {
            throw new APIException("Current order status is not available.");
        }

        boolean validTransition = switch (currentStatus.toLowerCase()) {

            case "pending" ->
                    newStatus.equalsIgnoreCase("accepted")
                            || newStatus.equalsIgnoreCase("cancelled");

            case "accepted" ->
                    newStatus.equalsIgnoreCase("processing")
                            || newStatus.equalsIgnoreCase("cancelled");

            case "processing" ->
                    newStatus.equalsIgnoreCase("shipped")
                            || newStatus.equalsIgnoreCase("cancelled");

            case "shipped" ->
                    newStatus.equalsIgnoreCase("delivered");

            case "delivered" ->
                    newStatus.equalsIgnoreCase("returned");

            case "cancelled", "returned" ->
                    false;

            default -> false;
        };

        if (!validTransition) {
            throw new APIException(
                    "Invalid status transition: "
                            + currentStatus
                            + " → "
                            + newStatus
            );
        }

        // ---------------------------------------------------------
// Restore product stock when order is cancelled
// ---------------------------------------------------------

        if (newStatus.equalsIgnoreCase("Cancelled")) {

            for (OrderItem orderItem : order.getOrderItems()) {

                Product product = orderItem.getProduct();

                if (product == null) {
                    continue;
                }

                int orderedQuantity = orderItem.getQuantity();

                Integer currentQuantity = product.getQuantity();

                if (currentQuantity == null) {
                    currentQuantity = 0;
                }

                product.setQuantity(
                        currentQuantity + orderedQuantity
                );

                productRepository.save(product);
            }
        }

// ---------------------------------------------------------
// Update current order status
// ---------------------------------------------------------

        order.setOrderStatus(newStatus);

        Order savedOrder =
                orderRepository.save(order);

        // ---------------------------------------------------------
        // Add new history entry
        // ---------------------------------------------------------

        OrderStatusHistory history =
                new OrderStatusHistory();

        history.setOrder(savedOrder);
        history.setStatus(status);
        history.setChangedAt(
                LocalDateTime.now()
        );

        orderStatusHistoryRepository.save(history);

// ---------------------------------------------------------
// AUDIT LOG
// ---------------------------------------------------------

        auditLogService.log(
                "ORDER_STATUS_UPDATED",
                "Order",
                savedOrder.getOrderId(),
                "Order #" + savedOrder.getOrderId()
                        + " status changed from "
                        + currentStatus
                        + " to "
                        + savedOrder.getOrderStatus(),
                authUtil.loggedInEmail()
        );

        notificationService.notifyUserByEmail(
                savedOrder.getEmail(),
                "Order Status Updated",
                "Your order #" + savedOrder.getOrderId()
                        + " is now " + savedOrder.getOrderStatus() + ".",
                "ORDER_STATUS"
        );

        return mapOrderToDTO(savedOrder);
    }




    // =========================================================
    // UPDATE ORDER STATUS FOR SELLER
    // =========================================================

    @Override
    @Transactional
    public OrderDTO updateOrderForSeller(Long orderId, String status) {

        // Get the currently logged-in seller
        User seller = authUtil.loggedInUser();

        // Find the order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order",
                                "orderId",
                                orderId
                        )
                );

        // Make sure the order contains items
        if (order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
            throw new APIException("Order does not contain any products");
        }

        // Verify that every product in this order belongs to the logged-in seller
        boolean sellerOwnsAllProducts = order.getOrderItems()
                .stream()
                .allMatch(orderItem ->
                        orderItem.getProduct() != null
                                && orderItem.getProduct().getUser() != null
                                && seller.getUserId().equals(
                                orderItem.getProduct().getUser().getUserId()
                        )
                );

        if (!sellerOwnsAllProducts) {
            throw new APIException(
                    "You are not authorized to update this order"
            );
        }
// Prevent duplicate status-history entries
        String currentStatus = order.getOrderStatus();

        if (currentStatus != null
                && currentStatus.equalsIgnoreCase(status)) {

            return mapOrderToDTO(order);
        }

// ---------------------------------------------------------
// Restore product stock when order is cancelled
// ---------------------------------------------------------

        if ("Cancelled".equalsIgnoreCase(status)) {

            for (OrderItem orderItem : order.getOrderItems()) {

                Product product = orderItem.getProduct();

                if (product == null) {
                    continue;
                }

                int orderedQuantity = orderItem.getQuantity();

                Integer currentQuantity = product.getQuantity();

                if (currentQuantity == null) {
                    currentQuantity = 0;
                }

                product.setQuantity(
                        currentQuantity + orderedQuantity
                );

                productRepository.save(product);
            }
        }

        // ---------------------------------------------------------
// Validate order status transition
// ---------------------------------------------------------

        if (status == null || status.isBlank()) {
            throw new APIException("Order status is required.");
        }

        String newStatus = status.trim();

        if (!newStatus.equalsIgnoreCase("Pending")
                && !newStatus.equalsIgnoreCase("Accepted")
                && !newStatus.equalsIgnoreCase("Processing")
                && !newStatus.equalsIgnoreCase("Shipped")
                && !newStatus.equalsIgnoreCase("Delivered")
                && !newStatus.equalsIgnoreCase("Cancelled")
                && !newStatus.equalsIgnoreCase("Returned")) {

            throw new APIException(
                    "Invalid order status: " + newStatus
            );
        }

        if (currentStatus == null || currentStatus.isBlank()) {
            throw new APIException("Current order status is not available.");
        }

        boolean validTransition = switch (currentStatus.toLowerCase()) {

            case "pending" ->
                    newStatus.equalsIgnoreCase("accepted")
                            || newStatus.equalsIgnoreCase("cancelled");

            case "accepted" ->
                    newStatus.equalsIgnoreCase("processing")
                            || newStatus.equalsIgnoreCase("cancelled");

            case "processing" ->
                    newStatus.equalsIgnoreCase("shipped")
                            || newStatus.equalsIgnoreCase("cancelled");

            case "shipped" ->
                    newStatus.equalsIgnoreCase("delivered");

            case "delivered" ->
                    newStatus.equalsIgnoreCase("returned");

            case "cancelled", "returned" ->
                    false;

            default -> false;
        };

        if (!validTransition) {
            throw new APIException(
                    "Invalid status transition: "
                            + currentStatus
                            + " → "
                            + newStatus
            );
        }

// Update current order status
        order.setOrderStatus(status);

        Order savedOrder = orderRepository.save(order);

        // Add new history entry
        OrderStatusHistory history = new OrderStatusHistory();

        history.setOrder(savedOrder);
        history.setStatus(status);
        history.setChangedAt(LocalDateTime.now());

        orderStatusHistoryRepository.save(history);

// ---------------------------------------------------------
// AUDIT LOG
// ---------------------------------------------------------

        auditLogService.log(
                "ORDER_STATUS_UPDATED",
                "Order",
                savedOrder.getOrderId(),
                "Order #" + savedOrder.getOrderId()
                        + " status changed from "
                        + currentStatus
                        + " to "
                        + savedOrder.getOrderStatus(),
                authUtil.loggedInEmail()
        );

        return mapOrderToDTO(savedOrder);
    }

// =========================================================
// CANCEL ORDER
// =========================================================

    @Override
    @Transactional
    public OrderDTO cancelOrder(Long orderId, String emailId) {

        // ---------------------------------------------------------
        // Find order belonging to the logged-in customer
        // ---------------------------------------------------------

        Order order = orderRepository
                .findByOrderIdAndEmail(orderId, emailId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order",
                                "orderId",
                                orderId
                        )
                );


        // ---------------------------------------------------------
        // Check current order status
        // ---------------------------------------------------------

        String currentStatus = order.getOrderStatus();

        if (currentStatus == null) {
            throw new APIException("Order status is not available");
        }


        // ---------------------------------------------------------
        // Only Accepted orders can currently be cancelled
        // ---------------------------------------------------------

        if (!currentStatus.equalsIgnoreCase("Accepted")) {
            throw new APIException(
                    "Order cannot be cancelled because its current status is "
                            + currentStatus
            );
        }


        // ---------------------------------------------------------
        // Refund Stripe payment if this was a successful
        // online Stripe payment
        // ---------------------------------------------------------

        Payment payment = order.getPayment();

        if (payment != null
                && ("Stripe".equalsIgnoreCase(payment.getPaymentMethod())
                || "Stripe".equalsIgnoreCase(payment.getPgName()))) {

            String paymentIntentId = payment.getPgPaymentId();

            if (paymentIntentId == null
                    || paymentIntentId.trim().isEmpty()) {

                throw new APIException(
                        "Stripe payment information is missing for this order"
                );
            }

            try {

                // Verify the payment directly with Stripe
                PaymentIntent paymentIntent =
                        stripeService.verifyPayment(paymentIntentId);

                // Payment must actually be successful
                if (!"succeeded".equalsIgnoreCase(
                        paymentIntent.getStatus())) {

                    throw new APIException(
                            "Stripe payment has not succeeded."
                    );
                }

                // Verify the Stripe payment amount matches
                // the order total before refunding
                long expectedAmount =
                        Math.round(order.getTotalAmount() * 100);

                if (paymentIntent.getAmount() == null
                        || paymentIntent.getAmount() != expectedAmount) {

                    throw new APIException(
                            "Stripe payment amount does not match the order total."
                    );
                }

                // Refund the full Stripe payment
                stripeService.refundPayment(paymentIntentId);

            } catch (StripeException e) {

                throw new APIException(
                        "Refund could not be processed: "
                                + e.getMessage()
                );
            }
        }


        // ---------------------------------------------------------
        // Restore product stock
        // ---------------------------------------------------------

        for (OrderItem orderItem : order.getOrderItems()) {

            Product product = orderItem.getProduct();

            if (product == null) {
                continue;
            }

            int orderedQuantity = orderItem.getQuantity();

            Integer currentQuantity = product.getQuantity();

            if (currentQuantity == null) {
                currentQuantity = 0;
            }

            product.setQuantity(
                    currentQuantity + orderedQuantity
            );

            productRepository.save(product);
        }


        // ---------------------------------------------------------
        // Update order status
        // ---------------------------------------------------------

        order.setOrderStatus("Cancelled");

        Order savedOrder =
                orderRepository.save(order);


        // ---------------------------------------------------------
        // Add cancellation to status history
        // ---------------------------------------------------------

        OrderStatusHistory history =
                new OrderStatusHistory();

        history.setOrder(savedOrder);
        history.setStatus("Cancelled");
        history.setChangedAt(LocalDateTime.now());

        orderStatusHistoryRepository.save(history);


        // ---------------------------------------------------------
        // Return updated order
        // ---------------------------------------------------------

        return mapOrderToDTO(savedOrder);
    }

    // =========================================================
    // GET ALL SELLER ORDERS
    // =========================================================

    @Override
    public OrderResponse getAllSellerOrders(
            Integer pageNumber,
            Integer pageSize,
            String sortBy,
            String sortOrder
    ) {

        Sort sortByAndOrder =
                sortOrder.equalsIgnoreCase("asc")
                        ? Sort.by(sortBy).ascending()
                        : Sort.by(sortBy).descending();

        Pageable pageDetails =
                PageRequest.of(
                        pageNumber,
                        pageSize,
                        sortByAndOrder
                );

        User seller = authUtil.loggedInUser();

        Page<Order> pageOrders =
                orderRepository.findOrdersBySeller(
                        seller.getUserId(),
                        pageDetails
                );

        List<OrderDTO> orderDTOs =
                pageOrders.getContent()
                        .stream()
                        .map(order -> {

                            OrderDTO orderDTO =
                                    mapOrderToDTO(order);

                            orderDTO.setEmail(null);
                            orderDTO.setPayment(null);
                            orderDTO.setAddressId(null);

                            List<OrderItemDTO> sellerItems =
                                    order.getOrderItems()
                                            .stream()
                                            .filter(orderItem ->
                                                    orderItem.getProduct() != null
                                                            && orderItem.getProduct().getUser() != null
                                                            && seller.getUserId().equals(
                                                            orderItem.getProduct()
                                                                    .getUser()
                                                                    .getUserId()
                                                    )
                                            )
                                            .map(orderItem ->
                                                    modelMapper.map(
                                                            orderItem,
                                                            OrderItemDTO.class
                                                    )
                                            )
                                            .toList();

                            orderDTO.setOrderItems(sellerItems);

                            double sellerTotal =
                                    sellerItems.stream()
                                            .mapToDouble(item ->
                                                    item.getOrderedProductPrice()
                                                            * item.getQuantity()
                                            )
                                            .sum();

                            orderDTO.setTotalAmount(sellerTotal);

                            return orderDTO;
                        })
                        .toList();

        OrderResponse orderResponse =
                new OrderResponse();

        orderResponse.setContent(orderDTOs);

        orderResponse.setPageNumber(
                pageOrders.getNumber()
        );

        orderResponse.setPageSize(
                pageOrders.getSize()
        );

        orderResponse.setTotalElements(
                pageOrders.getTotalElements()
        );

        orderResponse.setTotalPages(
                pageOrders.getTotalPages()
        );

        orderResponse.setLastPage(
                pageOrders.isLast()
        );

        return orderResponse;
    }


    // =========================================================
    // MAP ORDER → DTO
    // =========================================================

    private OrderDTO mapOrderToDTO(Order order) {

        OrderDTO orderDTO =
                modelMapper.map(
                        order,
                        OrderDTO.class
                );


        // ---------------------------------------------------------
        // Address ID
        // ---------------------------------------------------------

        if (order.getAddress() != null) {

            orderDTO.setAddressId(
                    order.getAddress().getAddressId()
            );
        }


        // ---------------------------------------------------------
        // Status history
        // ---------------------------------------------------------

        List<OrderStatusHistoryDTO> historyDTOs =
                new ArrayList<>();

        if (order.getStatusHistory() != null) {

            order.getStatusHistory()
                    .forEach(history -> {

                        OrderStatusHistoryDTO historyDTO =
                                new OrderStatusHistoryDTO();

                        historyDTO.setStatus(
                                history.getStatus()
                        );

                        historyDTO.setChangedAt(
                                history.getChangedAt()
                        );

                        historyDTOs.add(historyDTO);
                    });
        }

        orderDTO.setStatusHistory(historyDTOs);


// ---------------------------------------------------------
// Return request
// ---------------------------------------------------------

        returnRequestRepository
                .findByOrderOrderId(order.getOrderId())
                .ifPresent(returnRequest -> {

                    ReturnRequestDTO returnRequestDTO =
                            new ReturnRequestDTO();

                    returnRequestDTO.setReturnId(
                            returnRequest.getReturnId()
                    );

                    returnRequestDTO.setOrderId(
                            returnRequest.getOrder().getOrderId()
                    );

                    returnRequestDTO.setReason(
                            returnRequest.getReason()
                    );

                    returnRequestDTO.setStatus(
                            returnRequest.getStatus()
                    );

                    returnRequestDTO.setRequestedAt(
                            returnRequest.getRequestedAt()
                    );

                    returnRequestDTO.setProcessedAt(
                            returnRequest.getProcessedAt()
                    );

                    orderDTO.setReturnRequest(
                            returnRequestDTO
                    );
                });


        return orderDTO;
    }

    @Override
    public List<ProductDTO> getTrendingProducts() {

        LocalDate sinceDate = LocalDate.now().minusDays(30);

        List<Product> products =
                orderItemRepository.findTrendingProducts(sinceDate);

        // If there are no recent orders, show approved products instead.
        if (products.isEmpty()) {
            products = productRepository.findAll()
                    .stream()
                    .filter(product ->
                            product.getStatus() != null
                                    && product.getStatus().name().equals("APPROVED"))
                    .limit(5)
                    .toList();
        }

        return products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .toList();
    }

    @Override
    public List<ProductDTO> getBestSellingProducts() {

        List<Product> products =
                orderItemRepository.findBestSellingProducts();

        return products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .toList();
    }
}