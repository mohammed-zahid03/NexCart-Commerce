const initialState = {
    reviews: [],
    averageRating: 0,
    reviewCount: 0,
    loading: false,
    error: null,
};

export const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_PRODUCT_REVIEWS":
            return {
                ...state,
                reviews: Array.isArray(action.payload)
                    ? action.payload
                    : action.payload?.content || [],
                loading: false,
                error: null,
            };

        case "GET_PRODUCT_REVIEWS_ERROR":
            return {
                ...state,
                reviews: [],
                loading: false,
                error: action.payload,
            };

        case "GET_PRODUCT_AVERAGE_RATING":
            return {
                ...state,
                averageRating: Number(action.payload) || 0,
            };

        case "GET_PRODUCT_AVERAGE_RATING_ERROR":
            return {
                ...state,
                averageRating: 0,
            };

        case "GET_PRODUCT_REVIEW_COUNT":
            return {
                ...state,
                reviewCount: Number(action.payload) || 0,
            };

        case "GET_PRODUCT_REVIEW_COUNT_ERROR":
            return {
                ...state,
                reviewCount: 0,
            };

        case "CREATE_PRODUCT_REVIEW":
            return {
                ...state,
                reviews: [action.payload, ...state.reviews],
            };

        case "UPDATE_PRODUCT_REVIEW":
            return {
                ...state,
                reviews: state.reviews.map((review) =>
                    review.reviewId === action.payload.reviewId
                        ? action.payload
                        : review
                ),
            };

        case "DELETE_PRODUCT_REVIEW":
            return {
                ...state,
                reviews: state.reviews.filter(
                    (review) => review.reviewId !== action.payload
                ),
            };

        case "RESET_REVIEWS":
            return initialState;

        default:
            return state;
    }
};