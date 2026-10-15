package com.ecommerce.project.controller;

import com.ecommerce.project.config.AppConstants;
import com.ecommerce.project.payload.UserResponse;
import com.ecommerce.project.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ecommerce.project.security.response.MessageResponse;

@RestController
@RequestMapping("/api/admin/customers")
public class AdminCustomerController {

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<UserResponse> getAllCustomers(
            @RequestParam(
                    name = "pageNumber",
                    defaultValue = AppConstants.PAGE_NUMBER,
                    required = false
            ) Integer pageNumber
    ) {

        Sort sortByAndOrder =
                Sort.by(AppConstants.SORT_USERS_BY).descending();

        Pageable pageDetails =
                PageRequest.of(
                        pageNumber,
                        Integer.parseInt(AppConstants.PAGE_SIZE),
                        sortByAndOrder
                );

        return ResponseEntity.ok(
                authService.getAllCustomers(pageDetails)
        );
    }

    @PutMapping("/{customerId}/status")
    public ResponseEntity<MessageResponse> updateCustomerStatus(
            @PathVariable Long customerId,
            @RequestParam boolean active
    ) {
        return authService.updateCustomerStatus(
                customerId,
                active
        );
    }
}