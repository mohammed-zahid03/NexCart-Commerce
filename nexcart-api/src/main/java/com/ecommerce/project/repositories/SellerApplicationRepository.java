package com.ecommerce.project.repositories;

import com.ecommerce.project.model.SellerApplication;
import com.ecommerce.project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SellerApplicationRepository extends JpaRepository<SellerApplication, Long> {

    List<SellerApplication> findByStatusOrderByCreatedAtAsc(String status);

    Optional<SellerApplication> findTopByUserOrderByCreatedAtDesc(User user);

    boolean existsByUserAndStatus(User user, String status);
}