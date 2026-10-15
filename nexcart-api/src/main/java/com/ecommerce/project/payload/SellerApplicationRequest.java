package com.ecommerce.project.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SellerApplicationRequest {

    @NotBlank(message = "Store name is required")
    @Size(min = 2, max = 100, message = "Store name must be between 2 and 100 characters")
    private String storeName;

    @NotBlank(message = "Business description is required")
    @Size(min = 10, max = 1000, message = "Business description must be between 10 and 1000 characters")
    private String businessDescription;
}