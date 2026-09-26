import { useEffect, useState } from "react";
import FilterCard from "../components/FilterCard";
import { useSearchParams } from "react-router-dom";

const BrandFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACK_END_URL}/api/public/brands`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }

        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands([]);
      }
    };

    fetchBrands();
  }, []);

  const selectedBrand = searchParams.get("brand");

  const handleBrandChange = (brand) => {
    const params = new URLSearchParams(searchParams);

    if (selectedBrand === brand) {
      params.delete("brand");
    } else {
      params.set("brand", brand);
      params.delete("page");
    }

    setSearchParams(params);
  };

  return (
    <FilterCard title="Brand">
      <div className="space-y-[6px]">
        {brands.map((brand) => (
          <label
            key={brand}
            className="flex h-[19px] cursor-pointer items-center justify-between text-[12px]"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedBrand === brand}
                onChange={() => handleBrandChange(brand)}
                className="h-3.5 w-3.5 accent-black"
              />

              <span className="text-gray-900">{brand}</span>
            </div>
          </label>
        ))}
      </div>
    </FilterCard>
  );
};

export default BrandFilter;