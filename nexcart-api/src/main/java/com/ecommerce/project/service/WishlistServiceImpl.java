package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.User;
import com.ecommerce.project.model.Wishlist;
import com.ecommerce.project.payload.WishlistDTO;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.WishlistRepository;
import com.ecommerce.project.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuthUtil authUtil;


    @Override
    public WishlistDTO addToWishlist(Long productId) {

        User user = authUtil.loggedInUser();

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product",
                                "productId",
                                productId
                        )
                );

        boolean alreadyExists =
                wishlistRepository.existsByUserAndProduct(
                        user,
                        product
                );

        if (alreadyExists) {
            throw new APIException(
                    "Product " + product.getProductName()
                            + " is already in your wishlist"
            );
        }

        Wishlist wishlist = new Wishlist();

        wishlist.setUser(user);
        wishlist.setProduct(product);

        Wishlist savedWishlist =
                wishlistRepository.save(wishlist);

        return mapToDTO(savedWishlist);
    }


    @Override
    public List<WishlistDTO> getWishlist() {

        User user = authUtil.loggedInUser();

        return wishlistRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }


    @Override
    public void removeFromWishlist(Long productId) {

        User user = authUtil.loggedInUser();

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product",
                                "productId",
                                productId
                        )
                );

        Wishlist wishlist =
                wishlistRepository.findByUserAndProduct(
                                user,
                                product
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Wishlist",
                                        "productId",
                                        productId
                                )
                        );

        wishlistRepository.delete(wishlist);
    }


    @Override
    public boolean isProductInWishlist(Long productId) {

        User user = authUtil.loggedInUser();

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product",
                                "productId",
                                productId
                        )
                );

        return wishlistRepository.existsByUserAndProduct(
                user,
                product
        );
    }


    private WishlistDTO mapToDTO(Wishlist wishlist) {

        Product product = wishlist.getProduct();

        WishlistDTO dto = new WishlistDTO();

        dto.setWishlistId(
                wishlist.getWishlistId()
        );

        dto.setProductId(
                product.getProductId()
        );

        dto.setProductName(
                product.getProductName()
        );

        dto.setImage(
                product.getImage()
        );

        dto.setDescription(
                product.getDescription()
        );

        dto.setQuantity(
                product.getQuantity()
        );

        dto.setPrice(
                product.getPrice()
        );

        dto.setDiscount(
                product.getDiscount()
        );

        dto.setSpecialPrice(
                product.getSpecialPrice()
        );

        dto.setCreatedAt(
                wishlist.getCreatedAt()
        );

        return dto;
    }
}