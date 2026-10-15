package com.ecommerce.project.controller;

import com.ecommerce.project.config.AppConstants;
import com.ecommerce.project.payload.*;
import com.ecommerce.project.security.services.UserDetailsImpl;
import com.ecommerce.project.service.OrderService;
import com.ecommerce.project.service.StripeService;
import com.ecommerce.project.util.AuthUtil;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.ecommerce.project.model.Product;

import java.util.List;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Cart;
import com.ecommerce.project.repositories.CartRepository;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private AuthUtil authUtil;

    @Autowired
    private StripeService stripeService;

    @Autowired
    private CartRepository cartRepository;

    @PostMapping("/order/users/payments/{paymentMethod}")
    public ResponseEntity<OrderDTO> orderProducts(
            @PathVariable String paymentMethod,
            @RequestBody OrderRequestDTO orderRequestDTO
    ) throws StripeException {

        String emailId = authUtil.loggedInEmail();

        Long addressId = orderRequestDTO.getAddressId();

        // For Stripe payments, retrieve the addressId from
        // Stripe PaymentIntent metadata instead of trusting
        // the addressId sent by the browser.
        if ("online".equalsIgnoreCase(paymentMethod)
                && orderRequestDTO.getPgPaymentId() != null
                && !orderRequestDTO.getPgPaymentId().isBlank()) {

            PaymentIntent paymentIntent =
                    stripeService.verifyPayment(
                            orderRequestDTO.getPgPaymentId()
                    );

            String stripeAddressId =
                    paymentIntent.getMetadata().get("addressId");

            if (stripeAddressId == null || stripeAddressId.isBlank()) {
                throw new IllegalArgumentException(
                        "Address information is missing from payment."
                );
            }

            try {
                addressId = Long.valueOf(stripeAddressId);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException(
                        "Invalid address information in payment."
                );
            }
        }

        System.out.println("orderRequestDTO DATA: " + orderRequestDTO);
        System.out.println("Final addressId: " + addressId);

        OrderDTO order = orderService.placeOrder(
                emailId,
                addressId,
                paymentMethod,
                orderRequestDTO.getPgName(),
                orderRequestDTO.getPgPaymentId(),
                orderRequestDTO.getPgStatus(),
                orderRequestDTO.getPgResponseMessage()
        );

        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @PostMapping("/order/stripe-client-secret")
    public ResponseEntity<String> createStripeClientSecret(
            @RequestBody StripePaymentDto stripePaymentDto
    ) throws StripeException {

        String emailId = authUtil.loggedInEmail();

        Cart cart = cartRepository.findCartByEmail(emailId);

        if (cart == null) {
            throw new ResourceNotFoundException("Cart", "email", emailId);
        }

        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate the amount ONLY from the server-side cart
        long serverAmount = Math.round(cart.getTotalPrice() * 100);

        // Never trust amount/currency/email from the browser
        stripePaymentDto.setAmount(serverAmount);
        stripePaymentDto.setCurrency("inr");
        stripePaymentDto.setEmail(emailId);

        PaymentIntent paymentIntent =
                stripeService.paymentIntent(stripePaymentDto);

        return new ResponseEntity<>(
                paymentIntent.getClientSecret(),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/order/users/orders")
    public ResponseEntity<List<OrderDTO>> getUserOrders() {

        String emailId = authUtil.loggedInEmail();

        List<OrderDTO> orders =
                orderService.getUserOrders(emailId);

        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/public/products/trending")
    public ResponseEntity<List<ProductDTO>> getTrendingProducts() {
        List<ProductDTO> products = orderService.getTrendingProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/public/products/best-sellers")
    public ResponseEntity<List<ProductDTO>> getBestSellingProducts() {

        List<ProductDTO> products =
                orderService.getBestSellingProducts();

        return new ResponseEntity<>(
                products,
                HttpStatus.OK
        );
    }

    @PutMapping("/order/users/orders/{orderId}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(
            @PathVariable Long orderId
    ) {

        String emailId = authUtil.loggedInEmail();

        OrderDTO order =
                orderService.cancelOrder(
                        orderId,
                        emailId
                );

        return new ResponseEntity<>(
                order,
                HttpStatus.OK
        );
    }


    @GetMapping("/admin/orders")
    public ResponseEntity<OrderResponse> getAllOrders(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ORDERS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = "desc", required = false) String sortOrder
    ) {
        OrderResponse orderResponse = orderService.getAllOrders(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<OrderResponse>(orderResponse, HttpStatus.OK);
    }

    @GetMapping("/seller/orders")
    public ResponseEntity<OrderResponse> getAllSellerOrders(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ORDERS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder
    ) {
        OrderResponse orderResponse = orderService.getAllSellerOrders(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<OrderResponse>(orderResponse, HttpStatus.OK);
    }

    @PutMapping("/admin/orders/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long orderId,
                                                      @RequestBody OrderStatusUpdateDto orderStatusUpdateDto) {
        OrderDTO order = orderService.updateOrder(orderId, orderStatusUpdateDto.getStatus());
        return new ResponseEntity<OrderDTO>(order, HttpStatus.OK);
    }

    @PutMapping("/seller/orders/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatusSeller(@PathVariable Long orderId,
                                                      @RequestBody OrderStatusUpdateDto orderStatusUpdateDto) {
        OrderDTO order = orderService.updateOrderForSeller(orderId, orderStatusUpdateDto.getStatus());
        return new ResponseEntity<OrderDTO>(order, HttpStatus.OK);
    }
}
