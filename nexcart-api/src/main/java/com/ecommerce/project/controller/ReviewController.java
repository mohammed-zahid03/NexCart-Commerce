package com.ecommerce.project.controller;

import com.ecommerce.project.payload.ReviewDTO;
import com.ecommerce.project.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<ReviewDTO> createReview(
            @PathVariable Long productId,
            @Valid @RequestBody ReviewDTO reviewDTO
    ) {
        ReviewDTO createdReview =
                reviewService.createReview(
                        productId,
                        reviewDTO
                );

        return new ResponseEntity<>(
                createdReview,
                HttpStatus.CREATED
        );
    }

    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<ReviewDTO>> getReviewsByProduct(
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(
                reviewService.getReviewsByProduct(productId)
        );
    }

    @GetMapping("/reviews/{reviewId}")
    public ResponseEntity<ReviewDTO> getReviewById(
            @PathVariable Long reviewId
    ) {
        return ResponseEntity.ok(
                reviewService.getReviewById(reviewId)
        );
    }

    @PutMapping("/reviews/{reviewId}")
    public ResponseEntity<ReviewDTO> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewDTO reviewDTO
    ) {
        return ResponseEntity.ok(
                reviewService.updateReview(
                        reviewId,
                        reviewDTO
                )
        );
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<String> deleteReview(
            @PathVariable Long reviewId
    ) {
        reviewService.deleteReview(reviewId);

        return ResponseEntity.ok(
                "Review deleted successfully"
        );
    }

    @GetMapping("/products/{productId}/reviews/average")
    public ResponseEntity<Double> getAverageRating(
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(
                reviewService.getAverageRating(productId)
        );
    }

    @GetMapping("/products/{productId}/reviews/count")
    public ResponseEntity<Long> getReviewCount(
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(
                reviewService.getReviewCount(productId)
        );
    }

    @GetMapping("/admin/reviews")
    public ResponseEntity<List<ReviewDTO>> getAllReviewsForAdmin() {
        return ResponseEntity.ok(
                reviewService.getAllReviewsForAdmin()
        );
    }

    @DeleteMapping("/admin/reviews/{reviewId}")
    public ResponseEntity<String> deleteReviewByAdmin(
            @PathVariable Long reviewId
    ) {
        reviewService.deleteReviewByAdmin(reviewId);

        return ResponseEntity.ok(
                "Review deleted successfully"
        );
    }
}