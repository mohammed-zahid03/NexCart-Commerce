package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import com.ecommerce.project.model.ProductStatus;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Page<Product> findByCategoryAndStatusOrderByPriceAsc(
            Category category,
            ProductStatus status,
            Pageable pageDetails
    );


    Page<Product> findByProductNameLikeIgnoreCaseAndStatus(
            String keyword,
            ProductStatus status,
            Pageable pageDetails
    );

    Page<Product> findByBrandIgnoreCaseAndStatus(
            String brand,
            ProductStatus status,
            Pageable pageDetails
    );

    Page<Product> findByUser(User user, Pageable pageDetails);

    boolean existsByUser(User user);

    Page<Product> findByFeaturedTrueAndStatus(
            ProductStatus status,
            Pageable pageable
    );

    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.brand IS NOT NULL AND p.brand <> '' ORDER BY p.brand ASC")
    List<String> findDistinctBrands();

    List<Product> findTop5ByStatusOrderByCreatedAtDesc(
            ProductStatus status
    );

    Page<Product> findByDiscountGreaterThanAndStatusOrderByDiscountDesc(
            double discount,
            ProductStatus status,
            Pageable pageable
    );

    @Modifying
    @Query("UPDATE Product p SET p.quantity = p.quantity - :quantity " +
            "WHERE p.productId = :productId AND p.quantity >= :quantity")
    int decreaseStock(Long productId, Integer quantity);

    long countByUser(User user);

    long countByUserAndQuantityLessThanEqual(User user, Integer quantity);

    List<Product> findByUserAndQuantityLessThanEqual(
            User user,
            Integer quantity
    );
}
