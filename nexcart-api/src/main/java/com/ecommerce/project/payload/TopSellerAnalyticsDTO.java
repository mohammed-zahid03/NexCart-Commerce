package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopSellerAnalyticsDTO {

    private Long sellerId;
    private String sellerName;
    private Double revenue;
}