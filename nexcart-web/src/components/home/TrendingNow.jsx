import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import api from "../../api/api";
import TrendingProductCard from "./TrendingProductCard";

const TrendingNow = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setLoading(true);

        const { data } = await api.get(
          "/public/products/trending"
        );

        setTrendingProducts(
          Array.isArray(data) ? data.slice(0, 5) : []
        );
      } catch (error) {
        console.error(
          "Failed to fetch trending products:",
          error
        );

        setTrendingProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <section className="bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-12">

        {/* Header */}
        <div className="mb-7 flex items-center justify-between">
          <h2 className="font-serif text-[38px] leading-none tracking-[-0.03em] text-[#111827]">
            Trending now
          </h2>

          <Link
            to="/products"
            className="
              group
              flex
              items-center
              gap-2
              text-[14px]
              font-medium
              text-[#111827]
              hover:text-gray-500
              transition
            "
          >
            View all trending

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-10 text-center text-gray-500">
            Loading trending products...
          </div>
        )}

        {/* Empty State */}
        {!loading && trendingProducts.length === 0 && (
          <div className="py-10 text-center text-gray-500">
            No trending products available yet.
          </div>
        )}

        {/* Trending Products */}
        {!loading && trendingProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {trendingProducts.map((product) => (
              <TrendingProductCard
                key={product.productId}
                product={product}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default TrendingNow;