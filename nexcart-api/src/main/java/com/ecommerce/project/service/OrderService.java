package com.ecommerce.project.service;

import com.ecommerce.project.payload.OrderDTO;
import com.ecommerce.project.payload.OrderResponse;
import com.ecommerce.project.payload.ProductDTO;
import jakarta.transaction.Transactional;

import java.util.List;

public interface OrderService {

    @Transactional
    OrderDTO placeOrder(
            String emailId,
            Long addressId,
            String paymentMethod,
            String pgName,
            String pgPaymentId,
            String pgStatus,
            String pgResponseMessage
    );

    List<OrderDTO> getUserOrders(String emailId);

    OrderResponse getAllOrders(
            Integer pageNumber,
            Integer pageSize,
            String sortBy,
            String sortOrder
    );

    OrderDTO updateOrder(Long orderId, String status);

    OrderDTO updateOrderForSeller(Long orderId, String status);

    OrderResponse getAllSellerOrders(
            Integer pageNumber,
            Integer pageSize,
            String sortBy,
            String sortOrder
    );

    OrderDTO cancelOrder(Long orderId, String emailId);

    List<com.ecommerce.project.payload.ProductDTO> getTrendingProducts();

    List<ProductDTO> getBestSellingProducts();
}