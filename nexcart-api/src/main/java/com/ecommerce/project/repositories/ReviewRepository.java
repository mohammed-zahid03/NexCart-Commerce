package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductProductIdOrderByCreatedAtDesc(Long productId);

    Optional<Review> findByUserUserIdAndProductProductId(
            Long userId,
            Long productId
    );

    boolean existsByUserUserIdAndProductProductId(
            Long userId,
            Long productId
    );

    @Query("""
        SELECT r.product.productId
        FROM Review r
        GROUP BY r.product.productId
        HAVING AVG(r.rating) >= :minRating
        """)
    List<Long> findProductIdsByMinimumRating(
            @Param("minRating") Double minRating
    );
}