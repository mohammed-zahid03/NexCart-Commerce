package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerApplicationResponse {

    private Long applicationId;
    private String storeName;
    private String businessDescription;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
    private String adminNote;
    private String username;
    private String email;
}