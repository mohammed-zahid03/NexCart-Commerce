import {
  useDispatch,
  useSelector,
} from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Truck,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import { getImageUrl } from "../../../utils/imageUrl";

import {
  addToCart,
  addToWishlist,
  removeFromWishlist,
} from "../../../store/actions";

const ProductCard = ({ product }) => {
 const dispatch = useDispatch();
const navigate = useNavigate();

// --------------------------------------------------
// PRODUCT DATA
// --------------------------------------------------

const productId = product?.productId;

const wishlistItems = useSelector(
  (state) => state.wishlist?.wishlist || []
);

const isWishlisted = wishlistItems.some(
  (item) =>
    String(item.productId) ===
    String(productId)
);

  const productName = product?.productName ?? "Product";

  const image =
    product?.image ?? "/images/product-placeholder.svg";

  const description = product?.description ?? "";

  const quantity = Number(product?.quantity ?? 0);

  const isAvailable = quantity > 0;

  const category =
    product?.category?.categoryName ??
    product?.category?.name ??
    "Electronics";

  const price = Number(product?.price ?? 0);

  const specialPrice =
    product?.specialPrice != null
      ? Number(product.specialPrice)
      : null;

  const discount =
    product?.discount != null
      ? Number(product.discount)
      : 0;

  // --------------------------------------------------
  // PRICING
  // --------------------------------------------------

  const hasDiscount =
    specialPrice != null &&
    specialPrice > 0 &&
    specialPrice < price;

  const currentPrice = hasDiscount
    ? specialPrice
    : price;

  const savings = hasDiscount
    ? price - specialPrice
    : 0;

  // --------------------------------------------------
  // TEMPORARY REVIEW FALLBACK
  // Replace these once real review data is available.
  // --------------------------------------------------

  const rating = Number(product?.rating ?? 4.8);

  const reviews = Number(product?.reviews ?? 124);

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  const formatPrice = (value) =>
    `₹${Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  // --------------------------------------------------
  // PRODUCT NAVIGATION
  // --------------------------------------------------

  const handleProductClick = () => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  // --------------------------------------------------
  // WISHLIST
  // --------------------------------------------------

  const addToWishlistHandler = (e) => {
  e.stopPropagation();

  dispatch(
  addToWishlist(product.productId, toast)
);
};
  // --------------------------------------------------
  // CART
  // --------------------------------------------------

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
          description,
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

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

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
        rounded-2xl
        border
        border-slate-200
        bg-white
        transition-all
        duration-300
        ease-out
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-[0_14px_35px_rgba(15,23,42,0.07)]
      "
    >
      {/* ==================================================
          IMAGE SECTION
      ================================================== */}

      <div className="relative shrink-0">
        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute left-3 top-3 z-10">
            <span
              className="
                inline-flex
                items-center
                rounded-full
                bg-white/95
                px-2
                py-1
                text-[10px]
                font-semibold
                leading-none
                tracking-wide
                text-orange-600
                shadow-sm
                ring-1
                ring-slate-100
                backdrop-blur-sm
              "
            >
              {discount}% OFF
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          type="button"
          onClick={addToWishlistHandler}
          aria-label={`Add ${productName} to wishlist`}
          className="
            absolute
            right-3
            top-3
            z-10
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-white/95
            text-slate-700
            shadow-sm
            ring-1
            ring-slate-100
            backdrop-blur-sm
            transition-all
            duration-200
            hover:scale-105
            hover:bg-white
            hover:text-slate-950
          "
        >
          <Heart
  size={17}
  strokeWidth={1.8}
  fill={isWishlisted ? "currentColor" : "none"}
  className={
    isWishlisted
      ? "text-red-500"
      : "text-slate-700"
  }
/>
        </button>

       {/* Product image frame */}
<div
  className="
    relative
    mt-3
    aspect-[4/3]
    w-full
    overflow-hidden
    rounded-xl
    bg-[#f7f7f5]
  "
>
  <img
    src={getImageUrl(image)}
    alt={productName}
    loading="lazy"
    className="
      h-full
      w-full
      object-cover
      transition-transform
      duration-500
      ease-out
      group-hover:scale-[1.025]
    "
  />
</div>
      </div>

      {/* ==================================================
          PRODUCT INFORMATION
      ================================================== */}

      <div
        className="
          flex
          flex-1
          flex-col
          px-3.5
          pb-3.5
          pt-2.5
        "
      >
        {/* Category */}
        <p
          className="
            truncate
            text-[10px]
            font-medium
            uppercase
            tracking-[0.14em]
            text-slate-400
          "
        >
          {category}
        </p>

        {/* Product name */}
        <h3
          className="
            mt-0.5
            line-clamp-2
            min-h-[23px]
            text-[16px]
            font-semibold
            leading-[1.3]
            tracking-[-0.015em]
            text-slate-950
            transition-colors
            group-hover:text-slate-700
          "
        >
          {productName}
        </h3>

        {/* ==================================================
            RATING
        ================================================== */}

        <div
          className="
            mt-0.5
            flex
            items-center
            gap-1.5
            whitespace-nowrap
          "
        >
          <div className="flex items-center gap-[1px]">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={12}
                fill="currentColor"
                strokeWidth={0}
                className="text-orange-400"
              />
            ))}
          </div>

          <span
            className="
              text-[12px]
              font-medium
              text-slate-500
            "
          >
            {rating.toFixed(1)}
          </span>

          <span className="text-[11px] text-slate-300">
            •
          </span>

          <span
            className="
              truncate
              text-[12px]
              text-slate-500
            "
          >
            {reviews.toLocaleString("en-IN")} reviews
          </span>
        </div>

        {/* ==================================================
            PRICE
        ================================================== */}

        <div
          className="
            mt-2
            flex
            items-baseline
            gap-2
          "
        >
          <span
            className="
              text-[22px]
              font-bold
              leading-none
              tracking-[-0.035em]
              text-slate-950
            "
          >
            {formatPrice(currentPrice)}
          </span>

          {hasDiscount && (
            <span
              className="
                text-[12px]
                leading-none
                text-slate-400
                line-through
              "
            >
              {formatPrice(price)}
            </span>
          )}
        </div>

        {/* Savings */}
        {savings > 0 && (
          <p
            className="
              mt-1
              text-[12px]
              font-medium
              leading-none
              text-emerald-600
            "
          >
            Save {formatPrice(savings)}
          </p>
        )}

        {/* ==================================================
            DELIVERY
        ================================================== */}

        <div
          className="
            mt-2.5
            flex
            min-w-0
            items-center
            gap-1.5
            text-[12px]
            text-slate-500
          "
        >
          <Truck
            size={13}
            strokeWidth={1.7}
            className="
              shrink-0
              text-slate-400
            "
          />

          <span className="truncate">
            Free delivery tomorrow
          </span>
        </div>

        {/* ==================================================
            ADD TO CART
        ================================================== */}

        <button
          type="button"
          onClick={addToCartHandler}
          disabled={!isAvailable}
          className="
            mt-2.5
            flex
            h-11
            w-full
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-slate-950
            px-4
            text-[13px]
            font-semibold
            text-white
            transition-all
            duration-200
            hover:bg-slate-800
            active:scale-[0.99]
            disabled:cursor-not-allowed
            disabled:bg-slate-100
            disabled:text-slate-400
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

export default ProductCard;