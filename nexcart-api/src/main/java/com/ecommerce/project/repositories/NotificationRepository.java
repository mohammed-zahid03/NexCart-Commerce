package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUserUserIdOrderByCreatedAtDesc(
            Long userId
    );

    long countByUserUserIdAndReadFalse(
            Long userId
    );
}