package com.ecommerce.project.service;

import com.ecommerce.project.model.Role;
import com.ecommerce.project.model.SellerApplication;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.SellerApplicationRequest;
import com.ecommerce.project.payload.SellerApplicationResponse;
import com.ecommerce.project.repositories.RoleRepository;
import com.ecommerce.project.repositories.SellerApplicationRepository;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.exceptions.APIException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ecommerce.project.util.AuthUtil;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SellerApplicationServiceImpl implements SellerApplicationService {

    @Autowired
    private SellerApplicationRepository sellerApplicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private AuthUtil authUtil;

    @Autowired
    private NotificationService notificationService;

    @Override
    @Transactional
    public SellerApplicationResponse submitApplication(
            SellerApplicationRequest request,
            String username
    ) {

        User user = userRepository.findByUserName(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found")
                );

        boolean isSeller = user.getRoles().stream()
                .anyMatch(role ->
                        role.getRoleName().name().equals("ROLE_SELLER")
                );

        if (isSeller) {
            throw new APIException("You are already a seller");
        }

        boolean pendingApplication =
                sellerApplicationRepository.existsByUserAndStatus(
                        user,
                        "PENDING"
                );

        if (pendingApplication) {
            throw new APIException(
                    "You already have a pending seller application"
            );
        }

        SellerApplication application = new SellerApplication();
        application.setUser(user);
        application.setStoreName(request.getStoreName().trim());
        application.setBusinessDescription(
                request.getBusinessDescription().trim()
        );
        application.setStatus("PENDING");
        application.setCreatedAt(LocalDateTime.now());

        SellerApplication saved =
                sellerApplicationRepository.save(application);

        notificationService.notifyUsersByRole(
                com.ecommerce.project.model.AppRole.ROLE_ADMIN,
                "New Seller Application",
                "A new seller application has been submitted for store: "
                        + saved.getStoreName(),
                "SELLER_APPLICATION"
        );

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public SellerApplicationResponse getMyApplication(String username) {

        User user = userRepository.findByUserName(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found")
                );

        SellerApplication application =
                sellerApplicationRepository
                        .findTopByUserOrderByCreatedAtDesc(user)
                        .orElseThrow(() ->
                                new APIException(
                                        "You have not submitted a seller application"
                                )
                        );

        return mapToResponse(application);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SellerApplicationResponse> getPendingApplications(
            Pageable pageable
    ) {

        return sellerApplicationRepository
                .findByStatusOrderByCreatedAtAsc("PENDING")
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public SellerApplicationResponse approveApplication(
            Long applicationId,
            String adminNote
    ) {

        SellerApplication application =
                sellerApplicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new APIException(
                                        "Seller application not found"
                                )
                        );

        if (!"PENDING".equals(application.getStatus())) {
            throw new APIException(
                    "Only pending applications can be approved"
            );
        }

        User user = application.getUser();

        Role sellerRole = roleRepository.findByRoleName(
                com.ecommerce.project.model.AppRole.ROLE_SELLER
        ).orElseThrow(() ->
                new APIException("Seller role not found")
        );

        user.getRoles().add(sellerRole);
        userRepository.save(user);

        application.setStatus("APPROVED");
        application.setReviewedAt(LocalDateTime.now());
        application.setAdminNote(
                adminNote == null ? null : adminNote.trim()
        );

        SellerApplication saved =
                sellerApplicationRepository.save(application);

// ---------------------------------------------------------
// AUDIT LOG
// ---------------------------------------------------------

        auditLogService.log(
                "SELLER_APPLICATION_APPROVED",
                "SellerApplication",
                saved.getApplicationId(),
                "Seller application for store \""
                        + saved.getStoreName()
                        + "\" was approved",
                authUtil.loggedInEmail()
        );

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public SellerApplicationResponse rejectApplication(
            Long applicationId,
            String adminNote
    ) {

        SellerApplication application =
                sellerApplicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new APIException(
                                        "Seller application not found"
                                )
                        );

        if (!"PENDING".equals(application.getStatus())) {
            throw new APIException(
                    "Only pending applications can be rejected"
            );
        }

        application.setStatus("REJECTED");
        application.setReviewedAt(LocalDateTime.now());
        application.setAdminNote(
                adminNote == null ? null : adminNote.trim()
        );

        SellerApplication saved =
                sellerApplicationRepository.save(application);

// ---------------------------------------------------------
// AUDIT LOG
// ---------------------------------------------------------

        auditLogService.log(
                "SELLER_APPLICATION_REJECTED",
                "SellerApplication",
                saved.getApplicationId(),
                "Seller application for store \""
                        + saved.getStoreName()
                        + "\" was rejected",
                authUtil.loggedInEmail()
        );

        return mapToResponse(saved);
    }

    private SellerApplicationResponse mapToResponse(
            SellerApplication application
    ) {

        return new SellerApplicationResponse(
                application.getApplicationId(),
                application.getStoreName(),
                application.getBusinessDescription(),
                application.getStatus(),
                application.getCreatedAt(),
                application.getReviewedAt(),
                application.getAdminNote(),
                application.getUser().getUserName(),
                application.getUser().getEmail()
        );
    }
}