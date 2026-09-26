import { useSearchParams } from "react-router-dom";
import FilterCard from "../components/FilterCard";

const DiscountFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const discounts = [
    { label: "10% or more", value: "10" },
    { label: "20% or more", value: "20" },
    { label: "30% or more", value: "30" },
    { label: "50% or more", value: "50" },
  ];

  const selectedDiscount = searchParams.get("minDiscount");

  const handleDiscountChange = (value) => {
    const params = new URLSearchParams(searchParams);

    if (selectedDiscount === value) {
      params.delete("minDiscount");
    } else {
      params.set("minDiscount", value);
    }

    params.set("pageNumber", "0");
    setSearchParams(params);
  };

  return (
    <FilterCard title="Discount">
      <div className="space-y-[6px]">
        {discounts.map((discount) => (
          <label
            key={discount.value}
            className="flex h-[18px] cursor-pointer items-center gap-2 text-[12px]"
          >
            <input
              type="checkbox"
              checked={selectedDiscount === discount.value}
              onChange={() => handleDiscountChange(discount.value)}
              className="h-3.5 w-3.5 accent-black"
            />

            <span>{discount.label}</span>
          </label>
        ))}
      </div>
    </FilterCard>
  );
};

export default DiscountFilter;