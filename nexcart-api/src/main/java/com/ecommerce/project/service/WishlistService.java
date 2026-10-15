package com.ecommerce.project.service;

import com.ecommerce.project.payload.WishlistDTO;

import java.util.List;

public interface WishlistService {

    WishlistDTO addToWishlist(Long productId);

    List<WishlistDTO> getWishlist();

    void removeFromWishlist(Long productId);

    boolean isProductInWishlist(Long productId);
}