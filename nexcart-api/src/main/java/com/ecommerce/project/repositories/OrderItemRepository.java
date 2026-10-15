package com.ecommerce.project.repositories;

import com.ecommerce.project.model.OrderItem;
import com.ecommerce.project.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("""
        SELECT oi.product
        FROM OrderItem oi
        WHERE oi.order.orderStatus NOT IN ('Cancelled', 'Returned')
          AND oi.order.orderDate >= :sinceDate
        GROUP BY oi.product
        ORDER BY SUM(oi.quantity) DESC
    """)
    List<Product> findTrendingProducts(
            @Param("sinceDate") LocalDate sinceDate
    );

    @Query("""
        SELECT oi.product
        FROM OrderItem oi
        WHERE oi.order.orderStatus NOT IN ('Cancelled', 'Returned')
        GROUP BY oi.product
        ORDER BY SUM(oi.quantity) DESC
    """)
    List<Product> findBestSellingProducts();

    @Query("""
        SELECT CASE WHEN COUNT(oi) > 0 THEN true ELSE false END
        FROM OrderItem oi
        WHERE oi.order.email = :email
          AND oi.product.productId = :productId
          AND oi.order.orderStatus NOT IN ('Cancelled', 'Returned')
    """)
    boolean existsPurchasedProduct(
            @Param("email") String email,
            @Param("productId") Long productId
    );
}