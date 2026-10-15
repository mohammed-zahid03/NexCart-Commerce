package com.ecommerce.project.controller;

import com.ecommerce.project.payload.SellerApplicationResponse;
import com.ecommerce.project.service.SellerApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/seller-applications")
public class AdminSellerApplicationController {

    @Autowired
    private SellerApplicationService sellerApplicationService;

    // ADMIN: View pending seller applications
    @GetMapping
    public ResponseEntity<List<SellerApplicationResponse>> getPendingApplications(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "20") int pageSize
    ) {

        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        return ResponseEntity.ok(
                sellerApplicationService.getPendingApplications(pageable)
        );
    }

    // ADMIN: Approve seller application
    @PutMapping("/{applicationId}/approve")
    public ResponseEntity<SellerApplicationResponse> approveApplication(
            @PathVariable Long applicationId,
            @RequestParam(required = false) String adminNote
    ) {

        return ResponseEntity.ok(
                sellerApplicationService.approveApplication(
                        applicationId,
                        adminNote
                )
        );
    }

    // ADMIN: Reject seller application
    @PutMapping("/{applicationId}/reject")
    public ResponseEntity<SellerApplicationResponse> rejectApplication(
            @PathVariable Long applicationId,
            @RequestParam(required = false) String adminNote
    ) {

        return ResponseEntity.ok(
                sellerApplicationService.rejectApplication(
                        applicationId,
                        adminNote
                )
        );
    }
}