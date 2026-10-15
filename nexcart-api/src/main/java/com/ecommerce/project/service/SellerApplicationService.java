package com.ecommerce.project.service;

import com.ecommerce.project.payload.SellerApplicationRequest;
import com.ecommerce.project.payload.SellerApplicationResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SellerApplicationService {

    SellerApplicationResponse submitApplication(
            SellerApplicationRequest request,
            String username
    );

    SellerApplicationResponse getMyApplication(String username);

    List<SellerApplicationResponse> getPendingApplications(Pageable pageable);

    SellerApplicationResponse approveApplication(
            Long applicationId,
            String adminNote
    );

    SellerApplicationResponse rejectApplication(
            Long applicationId,
            String adminNote
    );
}