
import {
  useDispatch,
  useSelector,
} from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  addToCart,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../../store/actions";

const HomeProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

useEffect(() => {
  if (user) {
    dispatch(getWishlist());
  }
}, [dispatch, user]);

  const productId = product?.productId;

  const wishlistItems = useSelector(
    (state) => state.wishlist?.wishlist || []
  );

  const isWishlisted = wishlistItems.some(
    (item) =>
      String(item.productId) ===
      String(productId)
  );

  const productName =
    product?.productName ?? "Product";

  const image = product?.image
  ? `${import.meta.env.VITE_BACK_END_URL}/images/${product.image}`
  : "/images/product-placeholder.svg";

  const quantity = Number(
    product?.quantity ?? 0
  );

  const isAvailable = quantity > 0;

  const price = Number(
    product?.price ?? 0
  );

  const specialPrice =
    product?.specialPrice != null
      ? Number(product.specialPrice)
      : null;

  const hasDiscount =
    specialPrice != null &&
    specialPrice > 0 &&
    specialPrice < price;

  const currentPrice = hasDiscount
    ? specialPrice
    : price;

  const formatPrice = (value) =>
    `₹${Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const handleProductClick = () => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  const wishlistHandler = (e) => {
  e.stopPropagation();

  if (!user) {
    toast.error("Please login to use wishlist");
    navigate("/login");
    return;
  }

  if (isWishlisted) {
    dispatch(removeFromWishlist(productId, toast));
  } else {
    dispatch(addToWishlist(productId, toast));
  }
};

  const addToCartHandler = (e) => {
    e.stopPropagation();

    if (!isAvailable) {
      toast.error("Product is out of stock");
      return;
    }

    dispatch(
      addToCart(
        {
          image,
          productName,
          description: product?.description ?? "",
          specialPrice,
          price,
          productId,
          quantity,
        },
        1,
        toast
      )
    );
  };

  return (
    <article
      onClick={handleProductClick}
      className="
        group
        relative
        flex
        h-full
        w-full
        cursor-pointer
        flex-col
        overflow-hidden
        rounded-[22px]
        border
        border-[#E7E8EA]
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-md
      "
    >
      {/* Product Image */}
      <div
        className="
          relative
          aspect-square
          w-full
          overflow-hidden
          bg-[#F5F1EA]
        "
      >
        <img
          src={image}
          alt={productName}
          loading="lazy"
          className="
            h-full
            w-full
            object-contain
            p-2
            transition-transform
            duration-300
            group-hover:scale-[1.03]
          "
        />

        {/* Wishlist */}
        <button
          type="button"
          onClick={wishlistHandler}
          aria-label={`Add ${productName} to wishlist`}
          className="
            absolute
            right-3
            top-3
            z-10
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-[#E8E8E8]
            bg-white
            shadow-sm
            transition-all
            duration-200
            hover:bg-[#111827]
            hover:text-white
          "
        >
          <Heart
            size={17}
            strokeWidth={1.8}
            fill={
              isWishlisted
                ? "currentColor"
                : "none"
            }
            className={
              isWishlisted
                ? "text-red-500"
                : "text-[#111827]"
            }
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <h3
          className="
            min-h-[40px]
            line-clamp-2
            text-[14px]
            font-medium
            leading-5
            text-[#111827]
          "
        >
          {productName}
        </h3>

        {/* Price */}
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-[18px] font-semibold text-[#111827]">
            {formatPrice(currentPrice)}
          </span>

          {hasDiscount && (
            <span className="text-[12px] text-gray-400 line-through">
              {formatPrice(price)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={addToCartHandler}
          disabled={!isAvailable}
          className="
            mt-3
            flex
            h-10
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#111827]
            px-3
            text-[13px]
            font-semibold
            text-white
            transition-all
            duration-200
            hover:bg-gray-800
            active:scale-[0.99]
            disabled:cursor-not-allowed
            disabled:bg-gray-100
            disabled:text-gray-400
          "
        >
          <ShoppingCart
            size={15}
            strokeWidth={1.8}
          />

          {isAvailable
            ? "Add to Cart"
            : "Out of Stock"}
        </button>
      </div>
    </article>
  );
};

export default HomeProductCard;