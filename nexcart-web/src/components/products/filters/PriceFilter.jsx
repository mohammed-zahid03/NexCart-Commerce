import { useEffect, useState } from "react";
import FilterCard from "../components/FilterCard";
import { useSearchParams } from "react-router-dom";

const PriceFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || ""
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  );

  useEffect(() => {
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams);

    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }

    params.delete("page");

    setSearchParams(params);
  };

  const clearPriceFilter = () => {
    const params = new URLSearchParams(searchParams);

    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("page");

    setMinPrice("");
    setMaxPrice("");

    setSearchParams(params);
  };

  return (
    <FilterCard title="Price">
      <div className="space-y-3">

        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[12px] outline-none focus:border-gray-400"
          />

          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[12px] outline-none focus:border-gray-400"
          />
        </div>

        <button
          type="button"
          onClick={applyPriceFilter}
          className="w-full rounded-lg bg-black px-3 py-2 text-[12px] font-medium text-white transition hover:bg-gray-800"
        >
          Apply
        </button>

        {(minPrice || maxPrice) && (
          <button
            type="button"
            onClick={clearPriceFilter}
            className="w-full text-[11px] text-gray-500 transition hover:text-black"
          >
            Clear Price
          </button>
        )}

      </div>
    </FilterCard>
  );
};

export default PriceFilter;