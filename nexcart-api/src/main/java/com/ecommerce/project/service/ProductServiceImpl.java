package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.exceptions.ProductAccessDeniedException;
import com.ecommerce.project.model.Cart;
import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.ProductStatus;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.CartDTO;
import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.payload.ProductResponse;
import com.ecommerce.project.repositories.*;
import com.ecommerce.project.util.AuthUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.ecommerce.project.payload.SellerDashboardResponse;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private FileService fileService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    AuthUtil authUtil;

    @Value("${project.image}")
    private String path;

    @Value("${image.base.url}")
    private String imageBaseUrl;

    @Autowired
    private AuditLogService auditLogService;


    /* =========================================================
       ADD PRODUCT
       ========================================================= */

    @Override
    public ProductDTO addProduct(Long categoryId, ProductDTO productDTO) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category",
                                "categoryId",
                                categoryId
                        )
                );

        boolean isProductNotPresent = true;

        List<Product> products = category.getProducts();

        for (Product value : products) {
            if (value.getProductName().equals(productDTO.getProductName())) {
                isProductNotPresent = false;
                break;
            }
        }

        if (!isProductNotPresent) {
            throw new APIException("Product already exist!!");
        }

        Product product = modelMapper.map(productDTO, Product.class);

        product.setFeatured(false);
        product.setStatus(ProductStatus.PENDING);

        /*
         * Main image remains compatible with the existing system.
         */
        product.setImage("default.png");

        product.setCategory(category);
        product.setUser(authUtil.loggedInUser());

        /*
         * Calculate special price automatically.
         */
        double specialPrice =
                product.getPrice()
                        - ((product.getDiscount() * 0.01)
                        * product.getPrice());

        product.setSpecialPrice(specialPrice);

        /*
         * Make sure new collection fields are never null.
         */
        if (product.getGalleryImages() == null) {
            product.setGalleryImages(new ArrayList<>());
        }

        if (product.getHighlights() == null) {
            product.setHighlights(new ArrayList<>());
        }

        if (product.getSpecifications() == null) {
            product.setSpecifications(new java.util.LinkedHashMap<>());
        }

        Product savedProduct = productRepository.save(product);

        return mapProductToDTO(savedProduct);
    }


    @Override
    public ProductDTO getProductById(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product",
                                "productId",
                                productId
                        )
                );

        if (product.getStatus() != ProductStatus.APPROVED) {
            throw new ResourceNotFoundException(
                    "Product",
                    "productId",
                    productId
            );
        }

        return mapProductToDTO(product);
    }

    /* =========================================================
       GET ALL PRODUCTS
       ========================================================= */

    @Override
    public ProductResponse getAllProducts(
            Integer pageNumber,
            Integer pageSize,
            String sortBy,
            String sortOrder,
            String keyword,
            String category,
            String brand,
            Double minPrice,
            Double maxPrice,
            Double minRating,
            String availability,
            Double minDiscount
    ) {

        Sort sortByAndOrder =
                sortOrder.equalsIgnoreCase("asc")
                        ? Sort.by(sortBy).ascending()
                        : Sort.by(sortBy).descending();

        Pageable pageDetails =
                PageRequest.of(
                        pageNumber,
                        pageSize,
                        sortByAndOrder
                );

        Specification<Product> spec =
                Specification.where((Specification<Product>) null);

        spec = spec.and(
                (root, query, criteriaBuilder) ->
                        criteriaBuilder.equal(
                                root.get("status"),
                                ProductStatus.APPROVED
                        )
        );

        if (keyword != null && !keyword.trim().isEmpty()) {

            String normalizedKeyword = keyword.trim().toLowerCase();

            java.util.List<String> searchTerms = new java.util.ArrayList<>();
            searchTerms.add(normalizedKeyword);

            switch (normalizedKeyword) {

                case "earpod":
                case "earpods":
                case "earbud":
                case "earbuds":
                case "earphone":
                case "earphones":
                    searchTerms.add("earbuds");
                    searchTerms.add("earphones");
                    searchTerms.add("earpods");
                    break;

                case "headphone":
                case "headphones":
                    searchTerms.add("headphone");
                    searchTerms.add("headphones");
                    searchTerms.add("headset");
                    break;

                case "headset":
                    searchTerms.add("headset");
                    searchTerms.add("headphone");
                    searchTerms.add("headphones");
                    break;

                case "laptop":
                case "laptops":
                    searchTerms.add("laptop");
                    searchTerms.add("notebook");
                    searchTerms.add("computer");
                    break;

                case "notebook":
                case "notebooks":
                    searchTerms.add("notebook");
                    searchTerms.add("laptop");
                    searchTerms.add("computer");
                    break;

                case "mobile":
                case "mobiles":
                case "phone":
                case "phones":
                case "smartphone":
                case "smartphones":
                    searchTerms.add("mobile");
                    searchTerms.add("phone");
                    searchTerms.add("smartphone");
                    break;
            }

            spec = spec.and(
                    (root, query, criteriaBuilder) -> {

                        java.util.List<jakarta.persistence.criteria.Predicate> predicates =
                                new java.util.ArrayList<>();

                        for (String term : searchTerms) {

                            String searchPattern = "%" + term + "%";

                            predicates.add(
                                    criteriaBuilder.or(

                                            criteriaBuilder.like(
                                                    criteriaBuilder.lower(
                                                            root.get("productName")
                                                    ),
                                                    searchPattern
                                            ),

                                            criteriaBuilder.like(
                                                    criteriaBuilder.lower(
                                                            root.get("description")
                                                    ),
                                                    searchPattern
                                            ),

                                            criteriaBuilder.like(
                                                    criteriaBuilder.lower(
                                                            root.get("brand")
                                                    ),
                                                    searchPattern
                                            ),

                                            criteriaBuilder.like(
                                                    criteriaBuilder.lower(
                                                            root.get("category")
                                                                    .get("categoryName")
                                                    ),
                                                    searchPattern
                                            )
                                    )
                            );
                        }

                        return criteriaBuilder.or(
                                predicates.toArray(
                                        new jakarta.persistence.criteria.Predicate[0]
                                )
                        );
                    }
            );
        }

        if (category != null && !category.isEmpty()) {

            spec = spec.and(
                    (root, query, criteriaBuilder) ->
                            criteriaBuilder.equal(
                                    criteriaBuilder.lower(
                                            root.get("category").get("categoryName")
                                    ),
                                    category.trim().toLowerCase()
                            )
            );
        }

        if (minPrice != null) {
            spec = spec.and(
                    (root, query, criteriaBuilder) ->
                            criteriaBuilder.greaterThanOrEqualTo(
                                    root.get("specialPrice"),
                                    minPrice
                            )
            );
        }

        if (maxPrice != null) {
            spec = spec.and(
                    (root, query, criteriaBuilder) ->
                            criteriaBuilder.lessThanOrEqualTo(
                                    root.get("specialPrice"),
                                    maxPrice
                            )
            );
        }

        if (minRating != null) {

            List<Long> productIds =
                    reviewRepository.findProductIdsByMinimumRating(
                            minRating
                    );

            if (productIds.isEmpty()) {
                spec = spec.and(
                        (root, query, criteriaBuilder) ->
                                criteriaBuilder.disjunction()
                );
            } else {
                spec = spec.and(
                        (root, query, criteriaBuilder) ->
                                root.get("productId").in(productIds)
                );
            }
        }

        if (brand != null && !brand.isEmpty()) {
            spec = spec.and(
                    (root, query, criteriaBuilder) ->
                            criteriaBuilder.equal(
                                    criteriaBuilder.lower(root.get("brand")),
                                    brand.toLowerCase()
                            )
            );
        }

        if (availability != null && !availability.isEmpty()) {

            if (availability.equalsIgnoreCase("inStock")) {

                spec = spec.and(
                        (root, query, criteriaBuilder) ->
                                criteriaBuilder.greaterThan(
                                        root.get("quantity"),
                                        0
                                )
                );

            } else if (availability.equalsIgnoreCase("outOfStock")) {

                spec = spec.and(
                        (root, query, criteriaBuilder) ->
                                criteriaBuilder.equal(
                                        root.get("quantity"),
                                        0
                                )
                );
            }
        }

        if (minDiscount != null) {

            spec = spec.and(
                    (root, query, criteriaBuilder) ->
                            criteriaBuilder.greaterThanOrEqualTo(
                                    root.get("discount"),
                                    minDiscount
                            )
            );
        }

        Page<Product> pageProducts =
                productRepository.findAll(
                        spec,
                        pageDetails
                );

        List<ProductDTO> productDTOS =
                pageProducts.getContent()
                        .stream()
                        .map(this::mapProductToDTO)
                        .toList();

        return buildProductResponse(
                pageProducts,
                productDTOS
        );
    }


    /* =========================================================
       ADMIN PRODUCTS
       ========================================================= */

    @Override
    public ProductResponse getAllProductsForAdmin(
            Integer pageNumber,
            Integer pageSize,
            String sortBy,
            String sortOrder
    ) {

        Sort sortByAndOrder =
                sortOrder.equalsIgnoreCase("asc")
                        ? Sort.by(sortBy).ascending()
                        : Sort.by(sortBy).descending();

        Pageable pageDetails =
                PageRequest.of(
                        pageNumber,
                        pageSize,
                        sortByAndOrder
                );

        Page<Product> pageProducts =
                productRepository.findAll(pageDetails);

        List<ProductDTO> productDTOS =
                pageProducts.getContent()
                        .stream()
                        .map(this::mapProductToDTO)
                        .toList();

        return buildProductResponse(
                pageProducts,
                productDTOS
        );
    }

    @Override
    public ProductDTO updateProductStatus(Long productId, String status) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product",
                                "productId",
                                productId
                        )
                );

        ProductStatus productStatus;

        try {
            productStatus = ProductStatus.valueOf(
                    status.trim().toUpperCase()
            );
        } catch (IllegalArgumentException e) {
            throw new APIException(
                    "Invalid product status. Use PENDING, APPROVED or REJECTED."
            );
        }

        ProductStatus currentStatus = product.getStatus();

        product.setStatus(productStatus);

        Product savedProduct = productRepository.save(product);

        auditLogService.log(
                "PRODUCT_STATUS_UPDATED",
                "Product",
                savedProduct.getProductId(),
                "Product #" + savedProduct.getProductId()
                        + " status changed from "
                        + currentStatus
                        + " to "
                        + savedProduct.getStatus(),
                authUtil.loggedInEmail()
        );

        return mapProductToDTO(savedProduct);
    }


    /* =========================================================
       SELLER PRODUCTS
       ========================================================= */

    @Override
    public ProductResponse getAllProductsForSeller(
            Integer pageNumber,
            Integer pageSize,
            String sortBy,
            String sortOrder
    ) {

        Sort sortByAndOrder =
                sortOrder.equalsIgnoreCase("asc")
                        ? Sort.by(sortBy).ascending()
                        : Sort.by(sortBy).descending();

        Pageable pageDetails =
                PageRequest.of(
                        pageNumber,
                        pageSize,
                        sortByAndOrder
                );

        User user = authUtil.loggedInUser();

        Page<Product> pageProducts =
                productRepository.findByUser(
                        user,
                        pageDetails
                );

        List<ProductDTO> productDTOS =
                pageProducts.getContent()
                        .stream()
                        .map(this::mapProductToDTO)
                        .toList();

        return buildProductResponse(
                pageProducts,
                productDTOS
        );
    }


    /* =========================================================
       SEARCH BY CATEGORY
       ========================================================= */

    @Override
    public ProductResponse searchByCategory(
            Long categoryId,
            Integer pageNumber,
            Integer pageSize,
            String sortBy,
            String sortOrder
    ) {

        Category category =
                categoryRepository.findById(categoryId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category",
                                        "categoryId",
                                        categoryId
                                )
                        );

        Sort sortByAndOrder =
                sortOrder.equalsIgnoreCase("asc")
                        ? Sort.by(sortBy).ascending()
                        : Sort.by(sortBy).descending();

        Pageable pageDetails =
                PageRequest.of(
                        pageNumber,
                        pageSize,
                        sortByAndOrder
                );

        Page<Product> pageProducts =
                productRepository.findByCategoryAndStatusOrderByPriceAsc(
                        category,
                        ProductStatus.APPROVED,
                        pageDetails
                );

        if (pageProducts.getContent().isEmpty()) {

            throw new APIException(
                    category.getCategoryName()
                            + " category does not have any products"
            );
        }

        List<ProductDTO> productDTOS =
                pageProducts.getContent()
                        .stream()
                        .map(this::mapProductToDTO)
                        .toList();

        return buildProductResponse(
                pageProducts,
                productDTOS
        );
    }


    /* =========================================================
       SEARCH BY KEYWORD
       ========================================================= */

    @Override
    public ProductResponse searchProductByKeyword(
            String keyword,
            Integer pageNumber,
            Integer pageSize,
            String sortBy,
            String sortOrder
    ) {

        Sort sortByAndOrder =
                sortOrder.equalsIgnoreCase("asc")
                        ? Sort.by(sortBy).ascending()
                        : Sort.by(sortBy).descending();

        Pageable pageDetails =
                PageRequest.of(
                        pageNumber,
                        pageSize,
                        sortByAndOrder
                );

        Page<Product> pageProducts =
                productRepository.findByProductNameLikeIgnoreCaseAndStatus(
                        '%' + keyword + '%',
                        ProductStatus.APPROVED,
                        pageDetails
                );

        if (pageProducts.getContent().isEmpty()) {

            throw new APIException(
                    "Products not found with keyword: "
                            + keyword
            );
        }

        List<ProductDTO> productDTOS =
                pageProducts.getContent()
                        .stream()
                        .map(this::mapProductToDTO)
                        .toList();

        return buildProductResponse(
                pageProducts,
                productDTOS
        );
    }


    @Override
    public ProductResponse searchByBrand(
            String brand,
            Integer pageNumber,
            Integer pageSize,
            String sortBy,
            String sortOrder
    ) {

        Sort sortByAndOrder =
                sortOrder.equalsIgnoreCase("asc")
                        ? Sort.by(sortBy).ascending()
                        : Sort.by(sortBy).descending();

        Pageable pageDetails =
                PageRequest.of(
                        pageNumber,
                        pageSize,
                        sortByAndOrder
                );

        Page<Product> pageProducts =
                productRepository.findByBrandIgnoreCaseAndStatus(
                        brand,
                        ProductStatus.APPROVED,
                        pageDetails
                );;

        if (pageProducts.getContent().isEmpty()) {
            throw new APIException(
                    "Products not found with brand: " + brand
            );
        }

        List<ProductDTO> productDTOS =
                pageProducts.getContent()
                        .stream()
                        .map(this::mapProductToDTO)
                        .toList();

        return buildProductResponse(
                pageProducts,
                productDTOS
        );
    }


    /* =========================================================
       UPDATE PRODUCT
       ========================================================= */

    @Override
    public ProductDTO updateProduct(
            Long productId,
            ProductDTO productDTO
    ) {

        Product productFromDb =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product",
                                        "productId",
                                        productId
                                )
                        );

        Product product =
                modelMapper.map(
                        productDTO,
                        Product.class
                );

        productFromDb.setProductName(
                product.getProductName()
        );

        productFromDb.setDescription(
                product.getDescription()
        );

        productFromDb.setQuantity(
                product.getQuantity()
        );

        productFromDb.setDiscount(
                product.getDiscount()
        );

        productFromDb.setPrice(
                product.getPrice()
        );

        productFromDb.setSpecialPrice(
                product.getSpecialPrice()
        );


        /*
         * Update product-specific information only when
         * it is actually supplied by the request.
         */
        if (productDTO.getGalleryImages() != null) {

            productFromDb.setGalleryImages(
                    new ArrayList<>(
                            productDTO.getGalleryImages()
                    )
            );
        }

        if (productDTO.getHighlights() != null) {

            productFromDb.setHighlights(
                    new ArrayList<>(
                            productDTO.getHighlights()
                    )
            );
        }

        if (productDTO.getSpecifications() != null) {

            productFromDb.setSpecifications(
                    new java.util.LinkedHashMap<>(
                            productDTO.getSpecifications()
                    )
            );
        }

        Product savedProduct =
                productRepository.save(productFromDb);


        /*
         * Keep cart prices/details synchronized.
         */
        List<Cart> carts =
                cartRepository.findCartsByProductId(
                        productId
                );

        List<CartDTO> cartDTOs =
                carts.stream()
                        .map(cart -> {

                            CartDTO cartDTO =
                                    modelMapper.map(
                                            cart,
                                            CartDTO.class
                                    );

                            List<ProductDTO> products =
                                    cart.getCartItems()
                                            .stream()
                                            .map(p ->
                                                    modelMapper.map(
                                                            p.getProduct(),
                                                            ProductDTO.class
                                                    )
                                            )
                                            .collect(Collectors.toList());

                            cartDTO.setProducts(products);

                            return cartDTO;
                        })
                        .collect(Collectors.toList());

        cartDTOs.forEach(
                cart ->
                        cartService.updateProductInCarts(
                                cart.getCartId(),
                                productId
                        )
        );

        return mapProductToDTO(savedProduct);
    }


    /* =========================================================
       DELETE PRODUCT
       ========================================================= */

    @Override
    public ProductDTO deleteProduct(Long productId) {

        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product",
                                        "productId",
                                        productId
                                )
                        );

        List<Cart> carts =
                cartRepository.findCartsByProductId(
                        productId
                );

        carts.forEach(
                cart ->
                        cartService.deleteProductFromCart(
                                cart.getCartId(),
                                productId
                        )
        );

        auditLogService.log(
                "PRODUCT_DELETED",
                "Product",
                product.getProductId(),
                "Product #" + product.getProductId()
                        + " \"" + product.getProductName()
                        + "\" was deleted",
                authUtil.loggedInEmail()
        );

        productRepository.delete(product);

        return mapProductToDTO(product);
    }


    /* =========================================================
       UPDATE MAIN PRODUCT IMAGE
       ========================================================= */

    @Override
    public ProductDTO updateProductImage(
            Long productId,
            MultipartFile image
    ) throws IOException {

        Product productFromDb =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product",
                                        "productId",
                                        productId
                                )
                        );

        String fileName =
                fileService.uploadImage(
                        path,
                        image
                );

        productFromDb.setImage(fileName);

        Product updatedProduct =
                productRepository.save(
                        productFromDb
                );

        return mapProductToDTO(updatedProduct);
    }


    /* =========================================================
   SELLER PRODUCT OWNERSHIP
   ========================================================= */

    @Override
    public ProductDTO updateProductForSeller(
            Long productId,
            ProductDTO productDTO,
            User user
    ) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product",
                                "productId",
                                productId
                        )
                );

        if (product.getStatus() != ProductStatus.APPROVED) {
            throw new ResourceNotFoundException(
                    "Product",
                    "productId",
                    productId
            );
        }

        if (!product.getUser().getUserId().equals(user.getUserId())) {
            throw new ProductAccessDeniedException(
                    "You are not authorized to update this product."
            );
        }

        return updateProduct(productId, productDTO);
    }


    @Override
    public ProductDTO deleteProductForSeller(
            Long productId,
            User user
    ) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product",
                                "productId",
                                productId
                        )
                );

        if (!product.getUser().getUserId().equals(user.getUserId())) {
            throw new ProductAccessDeniedException(
                    "You are not authorized to delete this product."
            );
        }

        return deleteProduct(productId);
    }


    @Override
    public ProductDTO updateProductImageForSeller(
            Long productId,
            MultipartFile image,
            User user
    ) throws IOException {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product",
                                "productId",
                                productId
                        )
                );

        if (!product.getUser().getUserId().equals(user.getUserId())) {
            throw new ProductAccessDeniedException(
                    "You are not authorized to update this product image."
            );
        }

        return updateProductImage(productId, image);
    }


    /* =========================================================
       PRODUCT → DTO
       ========================================================= */

    private ProductDTO mapProductToDTO(
            Product product
    ) {

        ProductDTO productDTO =
                modelMapper.map(
                        product,
                        ProductDTO.class
                );

        /*
         * Main image URL.
         */
        productDTO.setImage(
                constructImageUrl(
                        product.getImage()
                )
        );


        /*
         * Gallery image URLs.
         *
         * Ignore null/blank gallery entries so the API
         * never returns invalid image URLs.
         */
        if (product.getGalleryImages() != null) {

            List<String> galleryUrls =
                    product.getGalleryImages()
                            .stream()
                            .filter(imageName ->
                                    imageName != null &&
                                            !imageName.isBlank()
                            )
                            .map(this::constructImageUrl)
                            .filter(url ->
                                    url != null &&
                                            !url.isBlank()
                            )
                            .toList();

            productDTO.setGalleryImages(galleryUrls);

        } else {

            productDTO.setGalleryImages(
                    new ArrayList<>()
            );
        }

        /*
         * Highlights.
         *
         * Ignore null/blank highlight entries so the API
         * never returns invalid highlight values.
         */
        if (product.getHighlights() != null) {

            List<String> highlights =
                    product.getHighlights()
                            .stream()
                            .filter(highlight ->
                                    highlight != null &&
                                            !highlight.isBlank()
                            )
                            .toList();

            productDTO.setHighlights(
                    new ArrayList<>(highlights)
            );

        } else {

            productDTO.setHighlights(
                    new ArrayList<>()
            );
        }


        /*
         * Specifications.
         */
        if (product.getSpecifications() != null) {

            productDTO.setSpecifications(
                    new java.util.LinkedHashMap<>(
                            product.getSpecifications()
                    )
            );

        } else {

            productDTO.setSpecifications(
                    new java.util.LinkedHashMap<>()
            );
        }

        return productDTO;
    }


    /* =========================================================
       IMAGE URL
       ========================================================= */

    private String constructImageUrl(
            String imageName
    ) {

        if (imageName == null || imageName.isBlank()) {
            return null;
        }

        /*
         * If the value is already a complete URL,
         * don't prepend the base URL again.
         */
        if (
                imageName.startsWith("http://")
                        || imageName.startsWith("https://")
                        || imageName.startsWith("data:")
        ) {
            return imageName;
        }

        return imageBaseUrl.endsWith("/")
                ? imageBaseUrl + imageName
                : imageBaseUrl + "/" + imageName;
    }


    /* =========================================================
       BUILD PRODUCT RESPONSE
       ========================================================= */

    private ProductResponse buildProductResponse(
            Page<Product> pageProducts,
            List<ProductDTO> productDTOS
    ) {

        ProductResponse productResponse =
                new ProductResponse();

        productResponse.setContent(productDTOS);

        productResponse.setPageNumber(
                pageProducts.getNumber()
        );

        productResponse.setPageSize(
                pageProducts.getSize()
        );

        productResponse.setTotalElements(
                pageProducts.getTotalElements()
        );

        productResponse.setTotalPages(
                pageProducts.getTotalPages()
        );

        productResponse.setLastPage(
                pageProducts.isLast()
        );

        return productResponse;
    }

    @Override
    public Page<ProductDTO> getFeaturedProducts(Integer pageNumber, Integer pageSize) {

        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        Page<Product> featuredProducts =
                productRepository.findByFeaturedTrueAndStatus(
                        ProductStatus.APPROVED,
                        pageable
                );

        return featuredProducts.map(product ->
                modelMapper.map(product, ProductDTO.class)
        );
    }

    @Override
    public Page<ProductDTO> getDeals(Integer pageNumber, Integer pageSize) {

        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        Page<Product> dealProducts =
                productRepository.findByDiscountGreaterThanAndStatusOrderByDiscountDesc(
                        0,
                        ProductStatus.APPROVED,
                        pageable
                );

        return dealProducts.map(product ->
                modelMapper.map(product, ProductDTO.class)
        );
    }

    @Override
    public ProductDTO updateFeaturedStatus(Long productId, boolean featured) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product",
                                "productId",
                                productId
                        )
                );

        product.setFeatured(featured);

        Product savedProduct = productRepository.save(product);

        return mapProductToDTO(savedProduct);
    }



    @Override
    public List<String> getAllBrands() {
        return productRepository.findDistinctBrands();
    }

    @Override
    public List<ProductDTO> getNewArrivals() {

        return productRepository.findTop5ByStatusOrderByCreatedAtDesc(
                        ProductStatus.APPROVED
                )
                .stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .toList();
    }

    @Override
    public long countSellerProducts(User user) {
        return productRepository.countByUser(user);
    }

    @Override
    public long countLowStockProducts(User user, Integer quantity) {
        return productRepository.countByUserAndQuantityLessThanEqual(
                user,
                quantity
        );
    }

    @Override
    public long countSellerOrders(User user) {
        return orderRepository.countOrdersBySeller(user.getUserId());
    }

    @Override
    public double getSellerSales(User user) {
        return orderRepository.getSellerSales(user.getUserId());
    }

    @Override
    public long countPendingSellerOrders(User user) {
        return orderRepository.countPendingOrdersBySeller(user.getUserId());
    }

    @Override
    public long countDeliveredSellerOrders(User user) {
        return orderRepository.countDeliveredOrdersBySeller(user.getUserId());
    }

    @Override
    public SellerDashboardResponse getSellerDashboard() {

        User seller = authUtil.loggedInUser();

        long totalProducts =
                countSellerProducts(seller);

        long totalOrders =
                countSellerOrders(seller);

        double totalSales =
                getSellerSales(seller);

        double totalCommission = totalSales * 0.10;
        double sellerEarnings = totalSales - totalCommission;

        long pendingOrders =
                countPendingSellerOrders(seller);

        long deliveredOrders =
                countDeliveredSellerOrders(seller);

        long lowStockProducts =
                countLowStockProducts(seller, 5);

        return new SellerDashboardResponse(
                totalProducts,
                totalOrders,
                totalSales,
                totalCommission,
                sellerEarnings,
                pendingOrders,
                deliveredOrders,
                lowStockProducts
        );
    }

    @Override
    public List<ProductDTO> getLowStockProducts(User user, Integer quantity) {

        return productRepository
                .findByUserAndQuantityLessThanEqual(user, quantity)
                .stream()
                .map(this::mapProductToDTO)
                .toList();
    }

}