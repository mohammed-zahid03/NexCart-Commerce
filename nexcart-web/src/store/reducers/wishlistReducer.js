const initialState = {
  wishlist: [],
};

export const wishlistReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "GET_WISHLIST":
      return {
        ...state,
        wishlist: Array.isArray(action.payload)
          ? action.payload
          : [],
      };

    case "ADD_TO_WISHLIST":
      return {
        ...state,
        wishlist: [
          action.payload,
          ...state.wishlist,
        ],
      };

    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.filter(
          (item) =>
            String(item.productId) !==
            String(action.payload)
        ),
      };

    default:
      return state;
  }
};