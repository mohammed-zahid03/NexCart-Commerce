import FilterCard from "../components/FilterCard";

const ColorFilter = () => {
  const colors = [
    "bg-black",
    "bg-white border-gray-300",
    "bg-gray-300",
    "bg-blue-600",
    "bg-red-500",
    "bg-green-500",
    "bg-orange-500",
  ];

  return (
    <FilterCard title="Color">

      <div className="flex items-center gap-3">
        {colors.map((color, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Color option ${index + 1}`}
            className={`h-4 w-4 rounded-full border ${color}`}
          />
        ))}
      </div>

    </FilterCard>
  );
};

export default ColorFilter;