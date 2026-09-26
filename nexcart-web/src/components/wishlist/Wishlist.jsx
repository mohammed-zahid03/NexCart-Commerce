import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowRight,
  Heart,
  ShoppingCart,
} from "lucide-react";
import {
  getWishlist,
  removeFromWishlist,
  addToCart
} from "../../store/actions";

import toast from "react-hot-toast";
import { getImageUrl } from "../../utils/imageUrl";

const Wishlist = () => {
  const { wishlist = [] } = useSelector(
    (state) => state.wishlist || {}
  );

  const { user } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(getWishlist());
    }
  }, [dispatch, user]);

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("en-IN");

  const getDiscount = (price, specialPrice) => {
    const original = Number(price || 0);
    const current = Number(specialPrice || 0);

    if (!original || !current || current >= original) {
      return 0;
    }

    return Math.round(((original - current) / original) * 100);
  };

const handleRemove = (productId) => {
  dispatch(
    removeFromWishlist(
      productId,
      toast
    )
  );
};

  const handleAddToCart = (item) => {
  const quantity = Number(item.quantity ?? 0);

  if (quantity <= 0) {
    toast.error("Product is out of stock");
    return;
  }

  dispatch(
    addToCart(
      {
        image: item.image,
        productName: item.productName,
        description: item.description,
        specialPrice: item.specialPrice,
        price: item.price,
        productId: item.productId,
        quantity: item.quantity,
      },
      1,
      toast
    )
  );

  dispatch(
    removeFromWishlist(item.productId)
  );
};

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:px-14 lg:py-12">

        {/* =====================================================
            BREADCRUMB
        ===================================================== */}
        <nav className="mb-8 flex items-center gap-2 text-[13px] text-gray-500">
          <Link
            to="/"
            className="transition-colors hover:text-gray-950"
          >
            Home
          </Link>

          <span className="text-gray-300">›</span>

          <span className="font-medium text-gray-900">
            Wishlist
          </span>
        </nav>

        {/* =====================================================
            HEADER
        ===================================================== */}
        <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
              Saved for later
            </p>

            <div className="mt-1.5 flex items-center gap-3">
              <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-gray-950 sm:text-[36px]">
                Your Wishlist
              </h1>

              {wishlist.length > 0 && (
                <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-gray-600 ring-1 ring-gray-200">
                  {wishlist.length}{" "}
                  {wishlist.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            <p className="mt-2 max-w-xl text-[14px] leading-6 text-gray-500">
              Products you've saved are kept here so you can come back
              whenever you're ready.
            </p>
          </div>

          {wishlist.length > 0 && (
            <Link
              to="/products"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-[13px] font-semibold text-gray-900 transition hover:border-gray-900 hover:bg-gray-50"
            >
              Continue shopping
              <ArrowRight size={15} />
            </Link>
          )}
        </section>

        {/* =====================================================
            EMPTY WISHLIST
        ===================================================== */}
        {wishlist.length === 0 ? (
<section className="flex min-h-[420px] items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-16">            <div className="max-w-md text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
                <Heart
                  size={32}
                  strokeWidth={1.5}
                  className="text-gray-400"
                />
              </div>

              <h2 className="mt-6 text-[24px] font-semibold tracking-[-0.025em] text-gray-950">
                Your wishlist is empty
              </h2>

              <p className="mt-2 text-[14px] leading-6 text-gray-500">
                Save products you love and they'll appear here.
                You can come back and purchase them whenever you're ready.
              </p>

              <Link
                to="/products"
                className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0f172a] px-6 text-[13px] font-semibold text-white transition hover:bg-black"
              >
                Continue shopping
<span className="text-[16px]">→</span>
              </Link>
            </div>
          </section>
        ) : (
          /* =====================================================
             WISHLIST GRID
          ===================================================== */
          <section className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10">

            {wishlist.map((item) => {
              const currentPrice =
                Number(item.specialPrice ?? item.price ?? 0);

              const originalPrice = Number(item.price ?? 0);

              const discount = getDiscount(
                originalPrice,
                currentPrice
              );

              const hasDiscount =
                discount > 0 && currentPrice < originalPrice;

              return (
                <article
                  key={item.productId}
                  className="group min-w-0"
                >
                  {/* =================================================
                      IMAGE
                  ================================================= */}
                  <div className="relative overflow-hidden rounded-xl bg-[#f7f7f5]">

                    {/* Discount */}
                    {hasDiscount && (
                      <span className="absolute left-3 top-3 z-10 rounded-md bg-white px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-orange-600 shadow-sm">
                        {discount}% OFF
                      </span>
                    )}

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => handleRemove(item.productId)}
                      aria-label={`Remove ${item.productName} from wishlist`}
                      className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition hover:text-red-500"
                    >
                      <Heart
                        size={17}
                        fill="currentColor"
                        strokeWidth={1.8}
                        className="text-red-500"
                      />
                    </button>

                    {/* Product link */}
                    <Link
                      to={`/product/${item.productId}`}
                      className="block aspect-square"
                    >
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.productName}
                        className="h-full w-full object-contain p-6.5 transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </Link>
                  </div>

                  {/* =================================================
                      PRODUCT INFORMATION
                  ================================================= */}
                  <div className="pt-4">

                    <Link
                      to={`/product/${item.productId}`}
                      className="block"
                    >
                      <h2 className="min-h-[42px] text-[14px] font-semibold leading-5 text-gray-950 transition-colors group-hover:text-gray-600 sm:text-[15px]">
                        {item.productName}
                      </h2>
                    </Link>

                    {/* Price */}
                    <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="text-[17px] font-bold tracking-[-0.02em] text-gray-950 sm:text-[18px]">
                        ₹{formatPrice(currentPrice)}
                      </span>

                      {hasDiscount && (
                        <>
                          <span className="text-[12px] text-gray-400 line-through">
                            ₹{formatPrice(originalPrice)}
                          </span>

                          <span className="text-[11px] font-semibold text-green-600">
                            Save ₹
                            {formatPrice(
                              originalPrice - currentPrice
                            )}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Availability / delivery */}
                  

                    {/* Actions */}
                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0f172a] px-3 text-[12px] font-semibold text-white transition hover:bg-black sm:text-[13px]"
                      >
                        <ShoppingCart size={15} />
                        Add to Cart
                      </button>

                      
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
};

export default Wishlist;