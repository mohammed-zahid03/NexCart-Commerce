package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Order;
import com.ecommerce.project.payload.TopProductAnalyticsDTO;
import com.ecommerce.project.payload.TopSellerAnalyticsDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import com.ecommerce.project.payload.SalesOverTimeDTO;
import com.ecommerce.project.payload.OrderStatusAnalyticsDTO;


import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("""
    SELECT COALESCE(SUM(o.totalAmount), 0)
    FROM Order o
    WHERE o.orderStatus NOT IN ('Cancelled', 'Returned')
    """)
    Double getTotalRevenue();

    List<Order> findByEmailOrderByOrderDateDesc(String email);

    Optional<Order> findByOrderIdAndEmail(Long orderId, String email);

    long countByOrderDate(LocalDate orderDate);

    long countByOrderDateBetween(
            LocalDate startDate,
            LocalDate endDate
    );

    @Query("""
    SELECT COALESCE(AVG(o.totalAmount), 0)
    FROM Order o
    WHERE o.orderStatus NOT IN ('Cancelled', 'Returned')
    """)
    Double getAverageOrderValue();

    @Query("""
    SELECT COALESCE(SUM(o.totalAmount), 0)
    FROM Order o
    JOIN o.payment p
    WHERE p.paymentMethod = 'Stripe'
    AND o.orderStatus IN ('Cancelled', 'Returned')
    """)
    Double getTotalRefunds();

    @Query("""
        SELECT DISTINCT o
        FROM Order o
        JOIN o.orderItems oi
        JOIN oi.product p
        WHERE p.user.userId = :sellerId
        """)
    Page<Order> findOrdersBySeller(
            @Param("sellerId") Long sellerId,
            Pageable pageable
    );

    @Query("""
    SELECT COUNT(DISTINCT o.orderId)
    FROM Order o
    JOIN o.orderItems oi
    JOIN oi.product p
    WHERE p.user.userId = :sellerId
    """)
    long countOrdersBySeller(@Param("sellerId") Long sellerId);


    @Query("""
    SELECT COALESCE(SUM(oi.orderedProductPrice * oi.quantity), 0)
    FROM Order o
    JOIN o.orderItems oi
    JOIN oi.product p
    WHERE p.user.userId = :sellerId
    AND o.orderStatus NOT IN ('Cancelled', 'Returned')
    """)
    Double getSellerSales(@Param("sellerId") Long sellerId);


    @Query("""
    SELECT COUNT(DISTINCT o.orderId)
    FROM Order o
    JOIN o.orderItems oi
    JOIN oi.product p
    WHERE p.user.userId = :sellerId
    AND o.orderStatus = 'Pending'
    """)
    long countPendingOrdersBySeller(@Param("sellerId") Long sellerId);


    @Query("""
    SELECT COUNT(DISTINCT o.orderId)
    FROM Order o
    JOIN o.orderItems oi
    JOIN oi.product p
    WHERE p.user.userId = :sellerId
    AND o.orderStatus = 'Delivered'
    """)
    long countDeliveredOrdersBySeller(@Param("sellerId") Long sellerId);

    @Query("""
    SELECT o.email,
           COUNT(o),
           COALESCE(
               SUM(
                   CASE
                       WHEN o.orderStatus NOT IN ('Cancelled', 'Returned')
                       THEN o.totalAmount
                       ELSE 0
                   END
               ),
               0
           )
    FROM Order o
    WHERE LOWER(o.email) IN :emails
    GROUP BY o.email
    """)
    List<Object[]> getCustomerOrderStats(
            @Param("emails") List<String> emails
    );

    @Query("""
    SELECT new com.ecommerce.project.payload.SalesOverTimeDTO(
        o.orderDate,
        COALESCE(SUM(o.totalAmount), 0)
    )
    FROM Order o
    WHERE o.orderStatus NOT IN ('Cancelled', 'Returned')
    AND o.orderDate BETWEEN :startDate AND :endDate
    GROUP BY o.orderDate
    ORDER BY o.orderDate
    """)
    List<SalesOverTimeDTO> getSalesOverTime(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
    SELECT new com.ecommerce.project.payload.OrderStatusAnalyticsDTO(
        o.orderStatus,
        COUNT(o)
    )
    FROM Order o
    GROUP BY o.orderStatus
    ORDER BY COUNT(o) DESC
    """)
    List<OrderStatusAnalyticsDTO> getOrdersByStatus();

    @Query("""
    SELECT new com.ecommerce.project.payload.TopProductAnalyticsDTO(
        p.productId,
        p.productName,
        SUM(oi.quantity)
    )
    FROM Order o
    JOIN o.orderItems oi
    JOIN oi.product p
    WHERE o.orderStatus NOT IN ('Cancelled', 'Returned')
    GROUP BY p.productId, p.productName
    ORDER BY SUM(oi.quantity) DESC
    """)
    List<TopProductAnalyticsDTO> getTopProducts(Pageable pageable);

    @Query("""
    SELECT new com.ecommerce.project.payload.TopSellerAnalyticsDTO(
        u.userId,
        u.userName,
        COALESCE(SUM(oi.orderedProductPrice * oi.quantity), 0)
    )
    FROM Order o
    JOIN o.orderItems oi
    JOIN oi.product p
    JOIN p.user u
    WHERE o.orderStatus NOT IN ('Cancelled', 'Returned')
    GROUP BY u.userId, u.userName
    ORDER BY SUM(oi.orderedProductPrice * oi.quantity) DESC
    """)
    List<TopSellerAnalyticsDTO> getTopSellers(Pageable pageable);
}