package com.ecommerce.project.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
@ToString
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long productId;

    @NotBlank
    @Size(
            min = 3,
            message = "Product name must contain atleast 3 characters"
    )
    private String productName;

    private String brand;

    /*
     * Main product image.
     *
     * This remains unchanged so the existing product listing,
     * cart and other parts of the application continue to work.
     */
    private String image;

    @NotBlank
    @Size(
            min = 6,
            message = "Product description must contain atleast 6 characters"
    )
    private String description;

    private Integer quantity;

    private double price;

    private double discount;

    private double specialPrice;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    private boolean featured = false;

    @Enumerated(EnumType.STRING)
    private ProductStatus status = ProductStatus.PENDING;


    /* =========================================================
       PRODUCT GALLERY
       ========================================================= */

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "product_images",
            joinColumns = @JoinColumn(name = "product_id")
    )
    @Column(name = "image_url")
    @OrderColumn(name = "image_order")
    private List<String> galleryImages = new ArrayList<>();


    /* =========================================================
       PRODUCT HIGHLIGHTS
       ========================================================= */

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "product_highlights",
            joinColumns = @JoinColumn(name = "product_id")
    )
    @Column(name = "highlight")
    @OrderColumn(name = "highlight_order")
    private List<String> highlights = new ArrayList<>();


    /* =========================================================
       PRODUCT SPECIFICATIONS
       ========================================================= */

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "product_specifications",
            joinColumns = @JoinColumn(name = "product_id")
    )
    @MapKeyColumn(name = "specification_name")
    @Column(name = "specification_value")
    private Map<String, String> specifications = new LinkedHashMap<>();


    /* =========================================================
       CATEGORY
       ========================================================= */

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;


    /* =========================================================
       SELLER
       ========================================================= */

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User user;


    /* =========================================================
       CART RELATIONSHIP
       ========================================================= */

    @OneToMany(
            mappedBy = "product",
            cascade = {
                    CascadeType.PERSIST,
                    CascadeType.MERGE
            },
            fetch = FetchType.EAGER
    )
    @ToString.Exclude
    private List<CartItem> products = new ArrayList<>();
}