import FilterCard from "../components/FilterCard";
import { useSearchParams } from "react-router-dom";

const AvailabilityFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const availability = searchParams.get("availability");

  const handleAvailabilityChange = (value) => {
    const params = new URLSearchParams(searchParams);

    if (availability === value) {
      params.delete("availability");
    } else {
      params.set("availability", value);
      params.delete("page");
    }

    setSearchParams(params);
  };

  return (
    <FilterCard title="Availability">
      <div className="space-y-[6px]">

        <label className="flex h-[19px] cursor-pointer items-center gap-2 text-[12px]">
          <input
            type="checkbox"
            checked={availability === "inStock"}
            onChange={() => handleAvailabilityChange("inStock")}
            className="h-3.5 w-3.5 accent-black"
          />
          <span>In Stock</span>
        </label>

        <label className="flex h-[19px] cursor-pointer items-center gap-2 text-[12px]">
          <input
            type="checkbox"
            checked={availability === "outOfStock"}
            onChange={() => handleAvailabilityChange("outOfStock")}
            className="h-3.5 w-3.5 accent-black"
          />
          <span>Out of Stock</span>
        </label>

      </div>
    </FilterCard>
  );
};

export default AvailabilityFilter;