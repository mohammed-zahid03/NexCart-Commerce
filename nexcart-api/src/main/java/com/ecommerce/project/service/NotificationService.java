package com.ecommerce.project.service;

import com.ecommerce.project.model.Notification;
import com.ecommerce.project.payload.NotificationDTO;
import com.ecommerce.project.model.AppRole;

import java.util.List;

public interface NotificationService {

    List<NotificationDTO> getUserNotifications(Long userId);

    long getUnreadNotificationCount(Long userId);

    NotificationDTO markAsRead(Long notificationId, Long userId);

    void notifyUsersByRole(
            AppRole role,
            String title,
            String message,
            String type
    );

    void notifyUserByEmail(
            String email,
            String title,
            String message,
            String type
    );
}