package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Notification;
import com.ecommerce.project.payload.NotificationDTO;
import com.ecommerce.project.repositories.NotificationRepository;
import com.ecommerce.project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ecommerce.project.model.AppRole;
import com.ecommerce.project.model.User;

import java.util.List;


@Service
public class NotificationServiceImpl
        implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<NotificationDTO> getUserNotifications(Long userId) {

        return notificationRepository
                .findByUserUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public long getUnreadNotificationCount(Long userId) {

        return notificationRepository
                .countByUserUserIdAndReadFalse(userId);
    }

    @Override
    public NotificationDTO markAsRead(
            Long notificationId,
            Long userId
    ) {

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notification",
                                        "notificationId",
                                        notificationId
                                )
                        );

        if (notification.getUser() == null
                || !notification.getUser()
                .getUserId()
                .equals(userId)) {

            throw new RuntimeException(
                    "You are not authorized to access this notification."
            );
        }

        notification.setRead(true);

        Notification savedNotification =
                notificationRepository.save(notification);

        return mapToDTO(savedNotification);
    }

    private NotificationDTO mapToDTO(Notification notification) {

        return new NotificationDTO(
                notification.getNotificationId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }

    @Override
    public void notifyUsersByRole(
            AppRole role,
            String title,
            String message,
            String type
    ) {

        List<User> users =
                userRepository.findAllByRoles_RoleName(role);

        List<Notification> notifications =
                users.stream()
                        .map(user -> {
                            Notification notification =
                                    new Notification();

                            notification.setUser(user);
                            notification.setTitle(title);
                            notification.setMessage(message);
                            notification.setType(type);
                            notification.setRead(false);

                            return notification;
                        })
                        .toList();

        notificationRepository.saveAll(notifications);
    }

    @Override
    public void notifyUserByEmail(
            String email,
            String title,
            String message,
            String type
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User",
                                "email",
                                email
                        )
                );

        Notification notification = new Notification();

        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);

        notificationRepository.save(notification);
    }
}