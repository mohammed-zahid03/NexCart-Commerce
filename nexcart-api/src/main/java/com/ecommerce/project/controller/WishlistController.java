package com.ecommerce.project.controller;

import com.ecommerce.project.payload.WishlistDTO;
import com.ecommerce.project.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;


    @PostMapping("/{productId}")
    public ResponseEntity<WishlistDTO> addToWishlist(
            @PathVariable Long productId
    ) {

        WishlistDTO wishlistDTO =
                wishlistService.addToWishlist(productId);

        return new ResponseEntity<>(
                wishlistDTO,
                HttpStatus.CREATED
        );
    }


    @GetMapping
    public ResponseEntity<List<WishlistDTO>> getWishlist() {

        List<WishlistDTO> wishlist =
                wishlistService.getWishlist();

        return new ResponseEntity<>(
                wishlist,
                HttpStatus.OK
        );
    }


    @DeleteMapping("/{productId}")
    public ResponseEntity<String> removeFromWishlist(
            @PathVariable Long productId
    ) {

        wishlistService.removeFromWishlist(productId);

        return new ResponseEntity<>(
                "Product removed from wishlist",
                HttpStatus.OK
        );
    }


    @GetMapping("/{productId}/exists")
    public ResponseEntity<Boolean> isProductInWishlist(
            @PathVariable Long productId
    ) {

        boolean exists =
                wishlistService.isProductInWishlist(productId);

        return new ResponseEntity<>(
                exists,
                HttpStatus.OK
        );
    }
}