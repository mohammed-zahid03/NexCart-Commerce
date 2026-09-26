import { X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const ActiveFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category");
  const keyword = searchParams.get("keyword");
  const brand = searchParams.get("brand");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const availability = searchParams.get("availability");

  const removeFilter = (key) => {
    const params = new URLSearchParams(searchParams);

    params.delete(key);

    // Return to the first page whenever filters change.
    params.delete("page");

    setSearchParams(params);
  };

  const clearAll = () => {
    setSearchParams({});
  };

  const hasFilters =
    category ||
    keyword ||
    brand ||
    minPrice ||
    maxPrice ||
    minRating ||
    availability;

  if (!hasFilters) {
    return null;
  }

  const priceLabel =
    minPrice && maxPrice
      ? `₹${Number(minPrice).toLocaleString()} – ₹${Number(
          maxPrice
        ).toLocaleString()}`
      : minPrice
      ? `₹${Number(minPrice).toLocaleString()}+`
      : `Up to ₹${Number(maxPrice).toLocaleString()}`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {category && (
        <span className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm">
          {category}

          <button
            type="button"
            onClick={() => removeFilter("category")}
            className="text-gray-500 hover:text-gray-900"
            aria-label={`Remove ${category} filter`}
          >
            <X size={15} />
          </button>
        </span>
      )}

      {keyword && (
        <span className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm">
          Search: {keyword}

          <button
            type="button"
            onClick={() => removeFilter("keyword")}
            className="text-gray-500 hover:text-gray-900"
            aria-label="Remove search filter"
          >
            <X size={15} />
          </button>
        </span>
      )}

      {brand && (
        <span className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm">
          {brand}

          <button
            type="button"
            onClick={() => removeFilter("brand")}
            className="text-gray-500 hover:text-gray-900"
            aria-label={`Remove ${brand} filter`}
          >
            <X size={15} />
          </button>
        </span>
      )}

      {(minPrice || maxPrice) && (
        <span className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm">
          {priceLabel}

          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams(searchParams);

              params.delete("minPrice");
              params.delete("maxPrice");
              params.delete("page");

              setSearchParams(params);
            }}
            className="text-gray-500 hover:text-gray-900"
            aria-label="Remove price filter"
          >
            <X size={15} />
          </button>
        </span>
      )}

      {minRating && (
        <span className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm">
          {minRating}★ & Up

          <button
            type="button"
            onClick={() => removeFilter("minRating")}
            className="text-gray-500 hover:text-gray-900"
            aria-label="Remove rating filter"
          >
            <X size={15} />
          </button>
        </span>
      )}

      {availability && (
        <span className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm">
          {availability === "inStock" ? "In Stock" : "Out of Stock"}

          <button
            type="button"
            onClick={() => removeFilter("availability")}
            className="text-gray-500 hover:text-gray-900"
            aria-label="Remove availability filter"
          >
            <X size={15} />
          </button>
        </span>
      )}

      <button
        type="button"
        onClick={clearAll}
        className="text-sm text-gray-500 hover:text-gray-900"
      >
        Clear All
      </button>
    </div>
  );
};

export default ActiveFilters;