package com.ecommerce.project.controller;

import com.ecommerce.project.security.response.MessageResponse;
import com.ecommerce.project.security.request.CreateSellerRequest;
import com.ecommerce.project.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminSellerController {

    @Autowired
    private AuthService authService;

    @PostMapping("/sellers")
    public ResponseEntity<MessageResponse> createSeller(
            @Valid @RequestBody CreateSellerRequest createSellerRequest
    ) {
        return authService.register(createSellerRequest);
    }
}