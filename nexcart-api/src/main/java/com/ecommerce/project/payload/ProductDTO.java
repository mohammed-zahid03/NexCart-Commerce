package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.ecommerce.project.model.ProductStatus;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private Long productId;

    private String productName;

    private String brand;

    /*
     * Main product image
     */
    private String image;

    /*
     * Additional product gallery images
     */
    private List<String> galleryImages = new ArrayList<>();

    /*
     * Product description
     */
    private String description;

    /*
     * Product highlights / key features
     */
    private List<String> highlights = new ArrayList<>();

    /*
     * Technical specifications
     *
     * Example:
     * "Display" -> "1.9\" AMOLED"
     * "Battery" -> "Up to 10 days"
     */
    private Map<String, String> specifications = new LinkedHashMap<>();

    private Integer quantity;

    private double price;

    private double discount;

    private double specialPrice;

    private boolean featured;

    private ProductStatus status;

    private CategoryDTO category;
}