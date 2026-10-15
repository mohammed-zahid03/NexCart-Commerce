package com.ecommerce.project.controller;

import com.ecommerce.project.service.NewsletterService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
public class NewsletterController {

    private final NewsletterService newsletterService;

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(
            @Valid @RequestBody NewsletterRequest request
    ) {
        newsletterService.subscribe(request.getEmail());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Successfully subscribed to the newsletter.");
    }

    @Data
    public static class NewsletterRequest {

        @NotBlank(message = "Email is required")
        @Email(message = "Please provide a valid email address")
        private String email;
    }
}