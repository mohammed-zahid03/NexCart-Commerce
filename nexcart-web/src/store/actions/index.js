import api from "../../api/api"

export const fetchProducts = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/public/products?${queryString}`);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch products",
         });
    }
};


export const fetchCategories = () => async (dispatch) => {
    try {
        dispatch({ type: "CATEGORY_LOADER" });
        const { data } = await api.get(`/public/categories`);
        dispatch({
            type: "FETCH_CATEGORIES",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_ERROR" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch categories",
         });
    }
};


export const addToCart = (data, qty = 1, toast) =>
    (dispatch, getState) => {

        const cartItems = getState().carts.cart;

        // Check if product is already in cart
        const alreadyInCart = cartItems.some(
            (item) => item.productId === data.productId
        );

        if (alreadyInCart) {
           toast(`${data?.productName} is already in the cart`);
            return;
        }

        // Check stock
        const availableQuantity = Number(data?.quantity ?? 0);

        if (availableQuantity >= qty) {
            dispatch({
                type: "ADD_CART",
                payload: {
                    ...data,
                    quantity: qty,
                },
            });

            toast.success(`${data?.productName} added to the cart`);

            localStorage.setItem(
                "cartItems",
                JSON.stringify(getState().carts.cart)
            );
        } else {
            toast.error("Out of stock");
        }
    };

export const increaseCartQuantity = 
    (data, toast, currentQuantity, setCurrentQuantity) =>
    (dispatch, getState) => {
        // Find the product
        const { products } = getState().products;
        
        const getProduct = products.find(
            (item) => item.productId === data.productId
        );

        const isQuantityExist = getProduct.quantity >= currentQuantity + 1;

        if (isQuantityExist) {
            const newQuantity = currentQuantity + 1;
            setCurrentQuantity(newQuantity);

            dispatch({
                type: "ADD_CART",
                payload: {...data, quantity: newQuantity },
            });
            localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        } else {
            toast.error("Quantity Reached to Limit");
        }

    };



export const decreaseCartQuantity = 
    (data, newQuantity) => (dispatch, getState) => {
        dispatch({
            type: "ADD_CART",
            payload: {...data, quantity: newQuantity},
        });
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
    }

export const removeFromCart =  (data, toast) => (dispatch, getState) => {
    dispatch({type: "REMOVE_CART", payload: data });
    toast.success(`${data.productName} removed from cart`);
    localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
}



export const authenticateSignInUser 
    = (sendData, toast, reset, navigate, setLoader, redirectTo = "/") => async (dispatch) => {
        try {
            setLoader(true);
            const { data } = await api.post("/auth/signin", sendData);
            dispatch({ type: "LOGIN_USER", payload: data });
            localStorage.setItem("auth", JSON.stringify(data));
            reset();
            toast.success("Login Success");
            navigate(redirectTo);
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Internal Server Error");
        } finally {
            setLoader(false);
        }
}


export const registerNewUser 
    = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
        try {
            setLoader(true);
            const { data } = await api.post("/auth/signup", sendData);
            reset();
            toast.success(data?.message || "User Registered Successfully");
            navigate("/login");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.response?.data?.password || "Internal Server Error");
        } finally {
            setLoader(false);
        }
};

export const submitSellerApplication =
    (sendData, toast, navigate, setLoader) => async () => {
        try {
            setLoader(true);

            const { data } = await api.post(
                "/seller-applications",
                sendData
            );

            toast.success(
                data?.message || "Seller application submitted successfully"
            );

            navigate("/seller-application/status");

            return data;
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to submit seller application"
            );

            return null;
        } finally {
            setLoader(false);
        }
    };


export const getMySellerApplication =
    () => async () => {
        try {
            const { data } = await api.get(
                "/seller-applications/me"
            );

            return data;
        } catch (error) {
            console.log(error);

            throw error;
        }
    };

    export const getAllSellerApplications =
  () => async () => {
    try {
      const { data } = await api.get(
        "/admin/seller-applications"
      );

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  export const approveSellerApplication =
    (applicationId, adminNote, toast) => async () => {
        try {
            const { data } = await api.put(
                `/admin/seller-applications/${applicationId}/approve`,
                null,
                {
                    params: {
                        adminNote: adminNote || undefined,
                    },
                }
            );

            toast.success("Seller application approved");
            return data;
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to approve seller application"
            );

            throw error;
        }
    };


export const rejectSellerApplication =
    (applicationId, adminNote, toast) => async () => {
        try {
            const { data } = await api.put(
                `/admin/seller-applications/${applicationId}/reject`,
                null,
                {
                    params: {
                        adminNote: adminNote || undefined,
                    },
                }
            );

            toast.success("Seller application rejected");
            return data;
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to reject seller application"
            );

            throw error;
        }
    };

export const logOutUser = (navigate) => (dispatch) => {
    dispatch({ type:"LOG_OUT" });
    localStorage.removeItem("auth");
    navigate("/login");
};

export const addUpdateUserAddress =
     (sendData, toast, addressId, setOpenAddressModal) => async (dispatch, getState) => {
    /*
    const { user } = getState().auth;
    await api.post(`/addresses`, sendData, {
          headers: { Authorization: "Bearer " + user.jwtToken },
        });
    */
    dispatch({ type:"BUTTON_LOADER" });
    try {
        if (!addressId) {
            const { data } = await api.post("/addresses", sendData);
        } else {
            await api.put(`/addresses/${addressId}`, sendData);
        }
        dispatch(getUserAddresses());
        toast.success("Address saved successfully");
        dispatch({ type:"IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
        dispatch({ type:"IS_ERROR", payload: null });
    } finally {
        setOpenAddressModal(false);
    }
};


export const deleteUserAddress = 
    (toast, addressId, setOpenDeleteModal) => async (dispatch, getState) => {
    try {
        dispatch({ type: "BUTTON_LOADER" });
        await api.delete(`/addresses/${addressId}`);
        dispatch({ type: "IS_SUCCESS" });
        dispatch(getUserAddresses());
        dispatch(clearCheckoutAddress());
        toast.success("Address deleted successfully");
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Some Error Occured",
         });
    } finally {
        setOpenDeleteModal(false);
    }
};

export const clearCheckoutAddress = () => {
    return {
        type: "REMOVE_CHECKOUT_ADDRESS",
    }
};

export const getUserAddresses = () => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/addresses`);
        dispatch({type: "USER_ADDRESS", payload: data});
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch user addresses",
         });
    }
};

export const selectUserCheckoutAddress = (address) => {
    localStorage.setItem("CHECKOUT_ADDRESS", JSON.stringify(address));
    
    return {
        type: "SELECT_CHECKOUT_ADDRESS",
        payload: address,
    }
};


export const addPaymentMethod = (method) => {
    return {
        type: "ADD_PAYMENT_METHOD",
        payload: method,
    }
};


export const createUserCart = (sendCartItems) => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        await api.post('/cart/create', sendCartItems);
        await dispatch(getUserCart());
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to create cart items",
         });
    }
};


export const getUserCart = () => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get('/carts/users/cart');
        
        dispatch({
            type: "GET_USER_CART_PRODUCTS",
            payload: data.products,
            totalPrice: data.totalPrice,
            cartId: data.cartId
        })
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch cart items",
         });
    }
};


export const createStripePaymentSecret 
    = (sendData, toast) => async (dispatch, getState) => {
        try {
            dispatch({ type: "IS_FETCHING" });
            const { data } = await api.post("/order/stripe-client-secret", sendData);
            dispatch({ type: "CLIENT_SECRET", payload: data });
              localStorage.setItem("client-secret", JSON.stringify(data));
              dispatch({ type: "IS_SUCCESS" });
     } catch (error) {
    console.log(error);

    const message =
        error?.response?.data?.message ||
        "Failed to initialize payment. Please try again.";

    dispatch({
        type: "IS_ERROR",
        payload: message,
    });

    if (toast) {
        toast.error(message);
    }
}
};


export const stripePaymentConfirmation =
    (sendData, setErrorMessage, setLoading, toast) =>
    async (dispatch) => {
        try {
            setLoading(true);

            const response = await api.post(
                "/order/users/payments/online",
                sendData
            );

            if (response.data) {
                localStorage.removeItem("CHECKOUT_ADDRESS");
                localStorage.removeItem("cartItems");
                localStorage.removeItem("client-secret");

                dispatch({ type: "REMOVE_CLIENT_SECRET_ADDRESS" });
                dispatch({ type: "CLEAR_CART" });

                toast.success("Order Accepted");

                return response.data;
            } else {
                setErrorMessage("Payment Failed. Please try again.");
                return null;
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(
                error?.response?.data?.message ||
                "Payment Failed. Please try again."
            );
            return null;
        } finally {
            setLoading(false);
        }
    };

export const analyticsAction = () => async (dispatch, getState) => {
        try {
            dispatch({ type: "IS_FETCHING"});
            const { data } = await api.get('/admin/app/analytics');
            dispatch({
                type: "FETCH_ANALYTICS",
                payload: data,
            })
            dispatch({ type: "IS_SUCCESS"});
        } catch (error) {
            dispatch({ 
                type: "IS_ERROR",
                payload: error?.response?.data?.message || "Failed to fetch analytics data",
            });
        }
};

export const getOrdersForDashboard = (queryString, isAdmin) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const endpoint = isAdmin ? "/admin/orders" : "/seller/orders";
        const { data } = await api.get(`${endpoint}?${queryString}`);
        dispatch({
            type: "GET_ADMIN_ORDERS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch orders data",
         });
    }
};

export const getAllReturnRequests = () => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });

        const { data } = await api.get("/admin/returns");

        dispatch({
            type: "GET_ADMIN_RETURNS",
            payload: data,
        });

        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);

        dispatch({
            type: "IS_ERROR",
            payload:
                error?.response?.data?.message ||
                "Failed to fetch return requests",
        });
    }
};


export const updateReturnRequestStatus = (
    returnId,
    status,
    toast
) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });

        const { data } = await api.put(
            `/admin/returns/${returnId}/status`,
            null,
            {
                params: {
                    status: status,
                },
            }
        );

        dispatch({
            type: "GET_ADMIN_RETURNS",
            payload: await api
                .get("/admin/returns")
                .then((response) => response.data),
        });

        dispatch({ type: "IS_SUCCESS" });

        toast.success(
            `Return request ${status.toLowerCase()} successfully`
        );

        return data;
    } catch (error) {
        console.log(error);

        dispatch({
            type: "IS_ERROR",
            payload:
                error?.response?.data?.message ||
                "Failed to update return request",
        });

        toast.error(
            error?.response?.data?.message ||
                "Failed to update return request"
        );
    }
};



export const updateOrderStatusFromDashboard =
     (orderId, orderStatus, toast, setLoader, isAdmin) => async (dispatch, getState) => {
    try {
        setLoader(true);
        const endpoint = isAdmin ? "/admin/orders/" : "/seller/orders/";
        const { data } = await api.put(`${endpoint}${orderId}/status`, { status: orderStatus});
        toast.success(data.message || "Order updated successfully");
        await dispatch(getOrdersForDashboard("", isAdmin));
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
        setLoader(false)
    }
};


export const dashboardProductsAction = (queryString, isAdmin) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const endpoint = isAdmin ? "/admin/products" : "/seller/products";
        const { data } = await api.get(`${endpoint}?${queryString}`);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch dashboard products",
         });
    }
};


export const updateProductFromDashboard = 
    (sendData, toast, reset, setLoader, setOpen, isAdmin) => async (dispatch) => {
    try {
        setLoader(true);
        const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
        await api.put(`${endpoint}${sendData.id}`, sendData);
        toast.success("Product update successful");
        reset();
        setLoader(false);
        setOpen(false);
        await dispatch(dashboardProductsAction());
    } catch (error) {
        toast.error(error?.response?.data?.description || "Product update failed");
     
    }
};



export const addNewProductFromDashboard = 
    (sendData, toast, reset, setLoader, setOpen, isAdmin) => async(dispatch, getState) => {
        try {
            setLoader(true);
            const endpoint = isAdmin ? "/admin/categories/" : "/seller/categories/";
            await api.post(`${endpoint}${sendData.categoryId}/product`,
                sendData
            );
            toast.success("Product created successfully");
            reset();
            setOpen(false);
            await dispatch(dashboardProductsAction());
       } catch (error) {
    console.error(error);
    toast.error(
        error?.response?.data?.description ||
        error?.response?.data?.message ||
        "Product creation failed"
    );
} finally {
            setLoader(false);
        }
    }

export const deleteProduct = 
    (setLoader, productId, toast, setOpenDeleteModal, isAdmin) => async (dispatch, getState) => {
    try {
        setLoader(true)
        const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
        await api.delete(`${endpoint}${productId}`);
        toast.success("Product deleted successfully");
        setLoader(false);
        setOpenDeleteModal(false);
        await dispatch(dashboardProductsAction());
    } catch (error) {
        console.log(error);
        toast.error(
            error?.response?.data?.message || "Some Error Occured"
        )
    }
};


export const updateProductImageFromDashboard = 
    (formData, productId, toast, setLoader, setOpen, isAdmin) => async (dispatch) => {
    try {
        setLoader(true);
        const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
        await api.put(`${endpoint}${productId}/image`, formData);
        toast.success("Image upload successful");
        setLoader(false);
        setOpen(false);
        await dispatch(dashboardProductsAction());
    } catch (error) {
        toast.error(error?.response?.data?.description || "Product Image upload failed");
     
    }
};

export const getAllCategoriesDashboard = (queryString) => async (dispatch) => {
  dispatch({ type: "CATEGORY_LOADER" });
  try {
    const { data } = await api.get(`/public/categories?${queryString}`);
    dispatch({
      type: "FETCH_CATEGORIES",
      payload: data["content"],
      pageNumber: data["pageNumber"],
      pageSize: data["pageSize"],
      totalElements: data["totalElements"],
      totalPages: data["totalPages"],
      lastPage: data["lastPage"],
    });

    dispatch({ type: "CATEGORY_SUCCESS" });
  } catch (err) {
    console.log(err);

    dispatch({
      type: "IS_ERROR",
      payload: err?.response?.data?.message || "Failed to fetch categories",
    });
  }
};

export const createCategoryDashboardAction =
  (sendData, setOpen, reset, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });
      await api.post("/admin/categories", sendData);
      dispatch({ type: "CATEGORY_SUCCESS" });
      reset();
      toast.success("Category Created Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.categoryName || "Failed to create new category"
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

export const updateCategoryDashboardAction =
  (sendData, setOpen, categoryID, reset, toast) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.put(`/admin/categories/${categoryID}`, sendData);

      dispatch({ type: "CATEGORY_SUCCESS" });

      reset();
      toast.success("Category Update Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.categoryName || "Failed to update category"
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

export const deleteCategoryDashboardAction =
  (setOpen, categoryID, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.delete(`/admin/categories/${categoryID}`);

      dispatch({ type: "CATEGORY_SUCCESS" });

      toast.success("Category Delete Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to delete category");
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };


  export const getAllSellersDashboard =
  (queryString) => async (dispatch, getState) => {
    const { user } = getState().auth;
    try {
      dispatch({ type: "IS_FETCHING" });
      const { data } = await api.get(`/auth/sellers?${queryString}`);
      dispatch({
        type: "GET_SELLERS",
        payload: data["content"],
        pageNumber: data["pageNumber"],
        pageSize: data["pageSize"],
        totalElements: data["totalElements"],
        totalPages: data["totalPages"],
        lastPage: data["lastPage"],
      });

      dispatch({ type: "IS_SUCCESS" });
    } catch (err) {
      console.log(err);
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Failed to fetch sellers data",
      });
    }
  };

export const addNewDashboardSeller =
  (sendData, toast, reset, setOpen, setLoader) => async (dispatch) => {
    try {
      setLoader(true);
      await api.post("/admin/sellers", sendData);
      reset();
      toast.success("Seller registered successfully!");

      await dispatch(getAllSellersDashboard());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.password ||
          "Internal Server Error"
      );
    } finally {
      setLoader(false);
      setOpen(false);
    }
  };


  export const deleteSellerDashboardAction =
  (setOpen, sellerId, toast) => async (dispatch) => {
    try {
      dispatch({ type: "IS_FETCHING" });

      await api.delete(`/auth/sellers/${sellerId}`);

      dispatch({ type: "IS_SUCCESS" });

      toast.success("Seller deleted successfully");

      setOpen(false);

      await dispatch(getAllSellersDashboard());
    } catch (err) {
      console.log(err);

      toast.error(
        err?.response?.data?.message || "Failed to delete seller"
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };



export const getWishlist = () => async (dispatch) => {
  try {
    const { data } = await api.get("/wishlist");

    dispatch({
      type: "GET_WISHLIST",
      payload: data,
    });
  } catch (error) {
    console.log("GET WISHLIST ERROR:", error);

    dispatch({
      type: "GET_WISHLIST_ERROR",
      payload:
        error?.response?.data?.message ||
        "Failed to fetch wishlist",
    });
  }
};

export const addToWishlist =
  (productId, toast) => async (dispatch) => {
    try {
      const { data } = await api.post(
        `/wishlist/${productId}`
      );

      dispatch({
        type: "ADD_TO_WISHLIST",
        payload: data,
      });

      if (toast) {
        toast.success("Added to Wishlist");
      }
    } catch (error) {
      console.log("ADD WISHLIST ERROR:", error);

      if (toast) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to add to wishlist"
        );
      }
    }
  };

export const removeFromWishlist =
  (productId, toast) => async (dispatch) => {
    try {
      await api.delete(`/wishlist/${productId}`);

      dispatch({
        type: "REMOVE_FROM_WISHLIST",
        payload: productId,
      });

      if (toast) {
        toast.success("Removed from Wishlist");
      }
    } catch (error) {
      console.log("REMOVE WISHLIST ERROR:", error);

      if (toast) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to remove from wishlist"
        );
      }
    }
  };


  // ==================== REVIEW ACTIONS ====================

export const getProductReviews =
  (productId) => async (dispatch) => {
    try {
      const { data } = await api.get(
        `/products/${productId}/reviews`
      );

      dispatch({
        type: "GET_PRODUCT_REVIEWS",
        payload: data,
      });
    } catch (error) {
      console.log("GET REVIEWS ERROR:", error);

      dispatch({
        type: "GET_PRODUCT_REVIEWS_ERROR",
        payload:
          error?.response?.data?.message ||
          "Failed to fetch reviews",
      });
    }
  };


export const getProductAverageRating =
  (productId) => async (dispatch) => {
    try {
      const { data } = await api.get(
        `/products/${productId}/reviews/average`
      );

      dispatch({
        type: "GET_PRODUCT_AVERAGE_RATING",
        payload: data,
      });
    } catch (error) {
      console.log("GET AVERAGE RATING ERROR:", error);

      dispatch({
        type: "GET_PRODUCT_AVERAGE_RATING_ERROR",
        payload: 0,
      });
    }
  };


export const getProductReviewCount =
  (productId) => async (dispatch) => {
    try {
      const { data } = await api.get(
        `/products/${productId}/reviews/count`
      );

      dispatch({
        type: "GET_PRODUCT_REVIEW_COUNT",
        payload: data,
      });
    } catch (error) {
      console.log("GET REVIEW COUNT ERROR:", error);

      dispatch({
        type: "GET_PRODUCT_REVIEW_COUNT_ERROR",
        payload: 0,
      });
    }
  };


export const createProductReview =
  (productId, reviewData, toast) =>
  async (dispatch) => {
    try {
      const { data } = await api.post(
        `/products/${productId}/reviews`,
        reviewData
      );

      dispatch({
        type: "CREATE_PRODUCT_REVIEW",
        payload: data,
      });

      if (toast) {
        toast.success("Review submitted successfully");
      }

      return data;
    } catch (error) {
      console.log("CREATE REVIEW ERROR:", error);

      if (toast) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to submit review"
        );
      }

      return null;
    }
  };


export const updateProductReview =
  (reviewId, reviewData, toast) =>
  async (dispatch) => {
    try {
      const { data } = await api.put(
        `/reviews/${reviewId}`,
        reviewData
      );

      dispatch({
        type: "UPDATE_PRODUCT_REVIEW",
        payload: data,
      });

      if (toast) {
        toast.success("Review updated successfully");
      }

      return data;
    } catch (error) {
      console.log("UPDATE REVIEW ERROR:", error);

      if (toast) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to update review"
        );
      }

      return null;
    }
  };


export const deleteProductReview =
  (reviewId, toast) =>
  async (dispatch) => {
    try {
      await api.delete(
        `/reviews/${reviewId}`
      );

      dispatch({
        type: "DELETE_PRODUCT_REVIEW",
        payload: reviewId,
      });

      if (toast) {
        toast.success("Review deleted successfully");
      }

      return true;
    } catch (error) {
      console.log("DELETE REVIEW ERROR:", error);

      if (toast) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to delete review"
        );
      }

      return false;
    }
  };