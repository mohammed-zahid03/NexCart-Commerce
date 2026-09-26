import { Link } from "react-router-dom";

const TrendingProductCard = ({ product }) => {
  const sellingPrice =
    product.specialPrice != null
      ? product.specialPrice
      : product.price;

  return (
    <Link
      to={`/product/${product.productId}`}
      className="
        group
        flex
        items-center
        gap-4
        rounded-[20px]
        border
        border-[#E8E8E8]
        bg-white
        p-4
        shadow-sm
        hover:-translate-y-1
        hover:shadow-md
        transition-all
        duration-300
      "
    >
      {/* Product Image */}
      <div
        className="
          w-[82px]
          h-[82px]
          flex-shrink-0
          rounded-[14px]
          bg-[#F5F1EA]
          overflow-hidden
          flex
          items-center
          justify-center
        "
      >
        <img
          src={`${import.meta.env.VITE_BACK_END_URL}/images/${product.image}`}
          alt={product.productName}
          className="
            w-full
            h-full
            object-contain
            p-2
            transition-transform
            duration-300
            group-hover:scale-105
          "
        />
      </div>

      {/* Product Details */}
      <div className="min-w-0 flex-1">
        <h3
          className="
            text-[15px]
            font-medium
            leading-5
            text-[#111827]
            line-clamp-2
          "
        >
          {product.productName}
        </h3>

        <p
          className="
            mt-2
            text-[19px]
            font-bold
            tracking-[-0.02em]
            text-[#111827]
          "
        >
          ₹{Number(sellingPrice).toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  );
};

export default TrendingProductCard;