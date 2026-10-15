package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.User;
import com.ecommerce.project.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByUserOrderByCreatedAtDesc(User user);

    Optional<Wishlist> findByUserAndProduct(
            User user,
            Product product
    );

    Optional<Wishlist> findByWishlistIdAndUser(
            Long wishlistId,
            User user
    );

    boolean existsByUserAndProduct(
            User user,
            Product product
    );

    void deleteByUserAndProduct(
            User user,
            Product product
    );
}