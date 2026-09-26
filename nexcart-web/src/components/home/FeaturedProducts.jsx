import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import api from "../../api/api";
import HomeProductCard from "./HomeProductCard";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const { data } = await api.get("/public/products/featured", {
          params: {
            pageNumber: 0,
            pageSize: 5,
          },
        });

        setFeaturedProducts(data?.content || []);
      } catch (error) {
        console.error("Failed to load featured products:", error);
        setFeaturedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <section className="bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-10">

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[260px_1fr]">

          {/* Left Content */}
          <div className="lg:pr-4">

            <h2 className="font-serif text-[42px] leading-[1.05] tracking-[-0.03em] text-[#111827]">
              Our most
              <br />
              loved
              <br />
              essentials.
            </h2>

            <p className="mt-4 text-[15px] leading-6 text-[#64748B]">
              Handpicked products.
              <br />
              Top performance.
            </p>

            <Link
              to="/products"
              className="
                group
                mt-7
                inline-flex
                items-center
                gap-2
                text-[15px]
                font-medium
                text-[#111827]
                transition
                hover:text-gray-500
              "
            >
              View all products

              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">

            {isLoading
              ? [1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="
                      h-[320px]
                      animate-pulse
                      rounded-[22px]
                      border
                      border-[#E7E8EA]
                      bg-white
                    "
                  />
                ))
              : featuredProducts.length > 0
                ? featuredProducts.map((product) => (
                    <HomeProductCard
                      key={product.productId}
                      product={product}
                    />
                  ))
                : (
                  <div className="col-span-full py-10 text-center text-[#64748B]">
                    No featured products available.
                  </div>
                )}

          </div>

        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;