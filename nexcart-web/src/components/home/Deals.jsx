import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import api from "../../api/api";
import HomeProductCard from "./HomeProductCard";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const { data } = await api.get("/public/products/deals", {
          params: {
            pageNumber: 0,
            pageSize: 5,
          },
        });

        setDeals(data?.content || []);
      } catch (error) {
        console.error("Failed to load deals:", error);
        setDeals([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDeals();
  }, []);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-10">

        <div className="mb-7 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-[38px] leading-none tracking-[-0.03em] text-[#111827]">
              Deals
            </h2>

            <p className="mt-3 text-[15px] text-[#64748B]">
              Great products at their best prices.
            </p>
          </div>

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
              transition
              hover:text-gray-500
            "
          >
            View all products

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

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
                    bg-[#F8FAFC]
                  "
                />
              ))
            : deals.length > 0
              ? deals.map((product) => (
                  <HomeProductCard
                    key={product.productId}
                    product={product}
                  />
                ))
              : (
                  <div className="col-span-full py-10 text-center text-[#64748B]">
                    No deals available.
                  </div>
                )}

        </div>
      </div>
    </section>
  );
};

export default Deals;