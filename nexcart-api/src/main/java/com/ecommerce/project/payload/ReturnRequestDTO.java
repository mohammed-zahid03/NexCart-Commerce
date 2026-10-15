package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReturnRequestDTO {

    private Long returnId;

    private Long orderId;

    private String reason;

    private String status;

    private LocalDateTime requestedAt;

    private LocalDateTime processedAt;
}