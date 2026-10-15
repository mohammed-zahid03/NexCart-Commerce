package com.ecommerce.project.controller;

import com.ecommerce.project.payload.SellerApplicationRequest;
import com.ecommerce.project.payload.SellerApplicationResponse;
import com.ecommerce.project.service.SellerApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seller-applications")
public class SellerApplicationController {

    @Autowired
    private SellerApplicationService sellerApplicationService;

    // USER: Submit seller application
    @PostMapping
    public ResponseEntity<SellerApplicationResponse> submitApplication(
            @Valid @RequestBody SellerApplicationRequest request,
            Authentication authentication
    ) {

        SellerApplicationResponse response =
                sellerApplicationService.submitApplication(
                        request,
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }

    // USER: Check own application
    @GetMapping("/me")
    public ResponseEntity<SellerApplicationResponse> getMyApplication(
            Authentication authentication
    ) {

        SellerApplicationResponse response =
                sellerApplicationService.getMyApplication(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }
}