package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.Review;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.ReviewDTO;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.ReviewRepository;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import com.ecommerce.project.repositories.OrderItemRepository;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AuthUtil authUtil;
    private final OrderItemRepository orderItemRepository;

    @Override
    public ReviewDTO createReview(
            Long productId,
            ReviewDTO reviewDTO
    ) {

        User user = authUtil.loggedInUser();

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product",
                                "productId",
                                productId
                        )
                );

        if (reviewRepository
                .existsByUserUserIdAndProductProductId(
                        user.getUserId(),
                        productId
                )) {

            throw new APIException(
                    "You have already reviewed this product"
            );
        }

        if (!orderItemRepository.existsPurchasedProduct(
                user.getEmail(),
                productId
        )) {
            throw new APIException(
                    "You can only review products you have purchased."
            );
        }

        Review review = new Review();

        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setUser(user);
        review.setProduct(product);

        Review savedReview =
                reviewRepository.save(review);

        return convertToDTO(savedReview);
    }

    @Override
    public List<ReviewDTO> getReviewsByProduct(
            Long productId
    ) {

        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException(
                    "Product",
                    "productId",
                    productId
            );
        }

        return reviewRepository
                .findByProductProductIdOrderByCreatedAtDesc(
                        productId
                )
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    public ReviewDTO getReviewById(
            Long reviewId
    ) {

        Review review = reviewRepository
                .findById(reviewId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Review",
                                "reviewId",
                                reviewId
                        )
                );

        return convertToDTO(review);
    }

    @Override
    public ReviewDTO updateReview(
            Long reviewId,
            ReviewDTO reviewDTO
    ) {

        User user = authUtil.loggedInUser();

        Review review = reviewRepository
                .findById(reviewId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Review",
                                "reviewId",
                                reviewId
                        )
                );

        if (!review.getUser()
                .getUserId()
                .equals(user.getUserId())) {

            throw new APIException(
                    "You can only update your own review"
            );
        }

        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());

        Review updatedReview =
                reviewRepository.save(review);

        return convertToDTO(updatedReview);
    }

    @Override
    public void deleteReview(
            Long reviewId
    ) {

        User user = authUtil.loggedInUser();

        Review review = reviewRepository
                .findById(reviewId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Review",
                                "reviewId",
                                reviewId
                        )
                );

        if (!review.getUser()
                .getUserId()
                .equals(user.getUserId())) {

            throw new APIException(
                    "You can only delete your own review"
            );
        }

        reviewRepository.delete(review);
    }

    @Override
    public Double getAverageRating(
            Long productId
    ) {

        List<Review> reviews =
                reviewRepository
                        .findByProductProductIdOrderByCreatedAtDesc(
                                productId
                        );

        if (reviews.isEmpty()) {
            return 0.0;
        }

        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }

    @Override
    public Long getReviewCount(
            Long productId
    ) {

        return (long) reviewRepository
                .findByProductProductIdOrderByCreatedAtDesc(
                        productId
                )
                .size();
    }

    private ReviewDTO convertToDTO(
            Review review
    ) {

        ReviewDTO dto = new ReviewDTO();

        dto.setReviewId(review.getReviewId());
        dto.setProductId(
                review.getProduct().getProductId()
        );
        dto.setUserId(
                review.getUser().getUserId()
        );
        dto.setUserName(
                review.getUser().getUserName()
        );
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUpdatedAt(review.getUpdatedAt());

        return dto;
    }

    @Override
    public List<ReviewDTO> getAllReviewsForAdmin() {

        return reviewRepository
                .findAll(
                        Sort.by(
                                Sort.Direction.DESC,
                                "createdAt"
                        )
                )
                .stream()
                .map(this::convertToDTO)
                .toList();
    }
    @Override
    public void deleteReviewByAdmin(Long reviewId) {

        Review review = reviewRepository
                .findById(reviewId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Review",
                                "reviewId",
                                reviewId
                        )
                );

        reviewRepository.delete(review);
    }

}