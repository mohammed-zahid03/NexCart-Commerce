package com.ecommerce.project.controller;

import com.ecommerce.project.model.Notification;
import com.ecommerce.project.payload.NotificationDTO;
import com.ecommerce.project.service.NotificationService;
import com.ecommerce.project.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuthUtil authUtil;

    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getUserNotifications() {

        Long userId =
                authUtil.loggedInUser().getUserId();

        return ResponseEntity.ok(
                notificationService.getUserNotifications(userId)
        );
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadNotificationCount() {

        Long userId =
                authUtil.loggedInUser().getUserId();

        return ResponseEntity.ok(
                notificationService
                        .getUnreadNotificationCount(userId)
        );
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationDTO> markAsRead(
            @PathVariable Long notificationId
    ) {

        Long userId =
                authUtil.loggedInUser().getUserId();

        return ResponseEntity.ok(
                notificationService.markAsRead(
                        notificationId,
                        userId
                )
        );
    }
}