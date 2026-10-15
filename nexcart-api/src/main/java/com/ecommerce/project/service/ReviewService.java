package com.ecommerce.project.service;

import com.ecommerce.project.payload.ReviewDTO;

import java.util.List;

public interface ReviewService {

    ReviewDTO createReview(
            Long productId,
            ReviewDTO reviewDTO
    );

    List<ReviewDTO> getReviewsByProduct(
            Long productId
    );

    ReviewDTO getReviewById(
            Long reviewId
    );

    ReviewDTO updateReview(
            Long reviewId,
            ReviewDTO reviewDTO
    );

    void deleteReview(
            Long reviewId
    );

    Double getAverageRating(
            Long productId
    );

    Long getReviewCount(
            Long productId
    );

    List<ReviewDTO> getAllReviewsForAdmin();

    void deleteReviewByAdmin(Long reviewId);
}