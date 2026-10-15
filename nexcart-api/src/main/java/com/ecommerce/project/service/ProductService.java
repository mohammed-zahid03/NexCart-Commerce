package com.ecommerce.project.service;

import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.payload.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import com.ecommerce.project.payload.SellerDashboardResponse;

public interface ProductService {
    ProductDTO addProduct(Long categoryId, ProductDTO product);

    ProductDTO getProductById(Long productId);

    ProductResponse getAllProducts(
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
    );

    ProductResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductResponse searchProductByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductResponse searchByBrand(
            String brand,
            Integer pageNumber,
            Integer pageSize,
            String sortBy,
            String sortOrder
    );

    ProductDTO updateProduct(Long productId, ProductDTO product);

    ProductDTO deleteProduct(Long productId);

    ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException;

    ProductDTO updateProductForSeller(Long productId, ProductDTO product, User user);

    ProductDTO deleteProductForSeller(Long productId, User user);

    ProductDTO updateProductImageForSeller(Long productId, MultipartFile image, User user) throws IOException;



    ProductResponse getAllProductsForAdmin(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductDTO updateProductStatus(Long productId, String status);

    ProductResponse getAllProductsForSeller(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    Page<ProductDTO> getFeaturedProducts(Integer pageNumber, Integer pageSize);

    ProductDTO updateFeaturedStatus(Long productId, boolean featured);

    List<String> getAllBrands();

    List<ProductDTO> getNewArrivals();

    Page<ProductDTO> getDeals(Integer pageNumber, Integer pageSize);

    long countSellerProducts(User user);

    long countLowStockProducts(User user, Integer quantity);

    List<ProductDTO> getLowStockProducts(User user, Integer quantity);

    long countSellerOrders(User user);

    double getSellerSales(User user);

    long countPendingSellerOrders(User user);

    long countDeliveredSellerOrders(User user);

    SellerDashboardResponse getSellerDashboard();
}