package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WishlistDTO {

    private Long wishlistId;

    private Long productId;

    private String productName;

    private String image;

    private String description;

    private Integer quantity;

    private double price;

    private double discount;

    private double specialPrice;

    private LocalDateTime createdAt;
}