import FilterCard from "../components/FilterCard";
import { useSearchParams } from "react-router-dom";

const RatingFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedRating = searchParams.get("minRating");

  const ratings = [
    { value: "5", label: "★★★★★" },
    { value: "4", label: "★★★★☆" },
    { value: "3", label: "★★★☆☆" },
    { value: "2", label: "★★☆☆☆" },
  ];

  const handleRatingChange = (value) => {
    const params = new URLSearchParams(searchParams);

    if (selectedRating === value) {
      params.delete("minRating");
    } else {
      params.set("minRating", value);
      params.delete("page");
    }

    setSearchParams(params);
  };

  return (
    <FilterCard title="Rating">
      <div className="space-y-[6px]">
        {ratings.map((rating) => (
          <label
            key={rating.value}
            className="flex h-[18px] cursor-pointer items-center gap-2 text-[12px]"
          >
            <input
              type="checkbox"
              checked={selectedRating === rating.value}
              onChange={() => handleRatingChange(rating.value)}
              className="h-3.5 w-3.5 accent-black"
            />

            <span className="tracking-[1px] text-[#F59E0B]">
              {rating.label}
            </span>

            <span className="text-gray-500">& Up</span>
          </label>
        ))}
      </div>
    </FilterCard>
  );
};

export default RatingFilter;