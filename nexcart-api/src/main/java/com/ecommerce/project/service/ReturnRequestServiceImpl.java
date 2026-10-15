package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Order;
import com.ecommerce.project.model.ReturnRequest;
import com.ecommerce.project.payload.ReturnRequestDTO;
import com.ecommerce.project.repositories.OrderRepository;
import com.ecommerce.project.model.OrderStatusHistory;
import com.ecommerce.project.repositories.ReturnRequestRepository;
import com.ecommerce.project.repositories.OrderStatusHistoryRepository;
import com.ecommerce.project.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ecommerce.project.model.OrderItem;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.repositories.ProductRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReturnRequestServiceImpl implements ReturnRequestService {

    @Autowired
    private ReturnRequestRepository returnRequestRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    private StripeService stripeService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private AuthUtil authUtil;


    // =========================================================
    // CREATE RETURN REQUEST
    // =========================================================

    @Override
    @Transactional
    public ReturnRequestDTO createReturnRequest(
            Long orderId,
            String emailId,
            String reason
    ) {

        // Find order belonging to logged-in customer
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
        // Only Delivered orders can be returned
        // ---------------------------------------------------------

        if (order.getOrderStatus() == null
                || !order.getOrderStatus().equalsIgnoreCase("Delivered")) {

            throw new APIException(
                    "Only delivered orders can be returned"
            );
        }


        // ---------------------------------------------------------
        // Check if return request already exists
        // ---------------------------------------------------------

        if (returnRequestRepository
                .findByOrderOrderId(orderId)
                .isPresent()) {

            throw new APIException(
                    "A return request already exists for this order"
            );
        }


        // ---------------------------------------------------------
        // Validate reason
        // ---------------------------------------------------------

        if (reason == null || reason.trim().isEmpty()) {

            throw new APIException(
                    "Return reason is required"
            );
        }


        // ---------------------------------------------------------
        // Create return request
        // ---------------------------------------------------------

        ReturnRequest returnRequest =
                new ReturnRequest();

        returnRequest.setOrder(order);
        returnRequest.setReason(reason.trim());
        returnRequest.setStatus("Requested");
        returnRequest.setRequestedAt(LocalDateTime.now());
        returnRequest.setProcessedAt(null);

        ReturnRequest savedReturnRequest =
                returnRequestRepository.save(returnRequest);

        notificationService.notifyUsersByRole(
                com.ecommerce.project.model.AppRole.ROLE_ADMIN,
                "New Return Request",
                "A new return request has been submitted for Order #"
                        + order.getOrderId()
                        + ". Reason: "
                        + savedReturnRequest.getReason(),
                "RETURN_REQUEST"
        );

        return mapToDTO(savedReturnRequest);
    }



    // =========================================================
    // GET RETURN REQUEST BY ORDER
    // =========================================================

    @Override
    public ReturnRequestDTO getReturnRequest(Long orderId, String emailId) {

        Order order = orderRepository
                .findByOrderIdAndEmail(orderId, emailId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order",
                                "orderId",
                                orderId
                        )
                );

        ReturnRequest returnRequest =
                returnRequestRepository
                        .findByOrderOrderId(order.getOrderId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "ReturnRequest",
                                        "orderId",
                                        orderId
                                )
                        );

        return mapToDTO(returnRequest);
    }


    // =========================================================
    // GET USER RETURN REQUESTS
    // =========================================================

    @Override
    @Transactional
    public List<ReturnRequestDTO> getUserReturnRequests(
            String emailId
    ) {

        return returnRequestRepository
                .findAllByOrderByRequestedAtDesc()
                .stream()
                .filter(returnRequest ->
                        returnRequest.getOrder() != null
                                && emailId.equals(
                                returnRequest.getOrder().getEmail()
                        )
                )
                .map(this::mapToDTO)
                .toList();
    }


    // =========================================================
    // GET ALL RETURN REQUESTS
    // =========================================================

    @Override
    public List<ReturnRequestDTO> getAllReturnRequests() {

        return returnRequestRepository
                .findAllByOrderByRequestedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }


    // =========================================================
    // UPDATE RETURN REQUEST STATUS
    // =========================================================

    @Override
    @Transactional
    public ReturnRequestDTO updateReturnRequestStatus(
            Long returnId,
            String status
    ) {

        ReturnRequest returnRequest =
                returnRequestRepository
                        .findById(returnId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "ReturnRequest",
                                        "returnId",
                                        returnId
                                )
                        );

        if (status == null || status.trim().isEmpty()) {

            throw new APIException(
                    "Return status is required"
            );
        }

        String newStatus = status.trim();

        if (!newStatus.equalsIgnoreCase("Approved")
                && !newStatus.equalsIgnoreCase("Rejected")) {

            throw new APIException(
                    "Invalid return status"
            );
        }

        // Prevent processing the same request twice
        if (!returnRequest.getStatus().equalsIgnoreCase("Requested")) {

            throw new APIException(
                    "This return request has already been processed"
            );
        }

        // =========================================================
        // REJECT RETURN
        // =========================================================

        if (newStatus.equalsIgnoreCase("Rejected")) {

            returnRequest.setStatus("Rejected");
            returnRequest.setProcessedAt(LocalDateTime.now());

            ReturnRequest savedReturnRequest =
                    returnRequestRepository.save(returnRequest);

// ---------------------------------------------------------
// AUDIT LOG
// ---------------------------------------------------------

            auditLogService.log(
                    "RETURN_REQUEST_REJECTED",
                    "ReturnRequest",
                    savedReturnRequest.getReturnId(),
                    "Return request for Order #"
                            + savedReturnRequest.getOrder().getOrderId()
                            + " was rejected",
                    authUtil.loggedInEmail()
            );

            return mapToDTO(savedReturnRequest);
        }


        // =========================================================
        // APPROVE RETURN → REFUND THROUGH STRIPE
        // =========================================================

        Order order = returnRequest.getOrder();

        if (order == null) {

            throw new APIException(
                    "Order associated with return request was not found"
            );
        }

        if (order.getPayment() == null) {

            throw new APIException(
                    "Payment information was not found for this order"
            );
        }

        String paymentIntentId =
                order.getPayment().getPgPaymentId();

        if (paymentIntentId == null
                || paymentIntentId.trim().isEmpty()) {

            throw new APIException(
                    "Stripe payment information is missing for this order"
            );
        }

        try {

            // IMPORTANT:
            // Only continue if Stripe successfully creates the refund.
            stripeService.refundPayment(paymentIntentId);

        } catch (Exception e) {

            throw new APIException(
                    "Refund could not be processed: " + e.getMessage()
            );
        }

        // =========================================================
// RESTORE INVENTORY AFTER SUCCESSFUL REFUND
// =========================================================

        for (OrderItem orderItem : order.getOrderItems()) {

            Product product = orderItem.getProduct();

            if (product == null) {
                continue;
            }

            int returnedQuantity = orderItem.getQuantity();

            Integer currentQuantity = product.getQuantity();

            if (currentQuantity == null) {
                currentQuantity = 0;
            }

            product.setQuantity(
                    currentQuantity + returnedQuantity
            );

            productRepository.save(product);
        }

// =========================================================
// REFUND SUCCESSFUL
// =========================================================

// Mark return request as approved
        returnRequest.setStatus("Approved");
        returnRequest.setProcessedAt(LocalDateTime.now());

        ReturnRequest savedReturnRequest =
                returnRequestRepository.save(returnRequest);


// =========================================================
// UPDATE ORDER STATUS → RETURNED
// =========================================================

        order.setOrderStatus("Returned");

        Order savedOrder =
                orderRepository.save(order);


// =========================================================
// ADD RETURNED TO ORDER STATUS HISTORY
// =========================================================

        OrderStatusHistory history =
                new OrderStatusHistory();

        history.setOrder(savedOrder);
        history.setStatus("Returned");
        history.setChangedAt(LocalDateTime.now());

        orderStatusHistoryRepository.save(history);

// ---------------------------------------------------------
// AUDIT LOG
// ---------------------------------------------------------

        auditLogService.log(
                "RETURN_REQUEST_APPROVED",
                "ReturnRequest",
                savedReturnRequest.getReturnId(),
                "Return request for Order #"
                        + savedReturnRequest.getOrder().getOrderId()
                        + " was approved",
                authUtil.loggedInEmail()
        );

        return mapToDTO(savedReturnRequest);



    }


        // =========================================================
        // MAP ENTITY → DTO
        // =========================================================

        private ReturnRequestDTO mapToDTO(
                ReturnRequest returnRequest
    ){

            ReturnRequestDTO dto =
                    new ReturnRequestDTO();

            dto.setReturnId(
                    returnRequest.getReturnId()
            );

            if (returnRequest.getOrder() != null) {

                dto.setOrderId(
                        returnRequest
                                .getOrder()
                                .getOrderId()
                );
            }

            dto.setReason(
                    returnRequest.getReason()
            );

            dto.setStatus(
                    returnRequest.getStatus()
            );

            dto.setRequestedAt(
                    returnRequest.getRequestedAt()
            );

            dto.setProcessedAt(
                    returnRequest.getProcessedAt()
            );

            return dto;
        }
    }