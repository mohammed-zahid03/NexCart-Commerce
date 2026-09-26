import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const sortOptions = [
  {
    label: "Most Popular",
    sortBy: null,
    sortOrder: null,
  },
  {
    label: "Price: Low to High",
    sortBy: "specialPrice",
    sortOrder: "asc",
  },
  {
    label: "Price: High to Low",
    sortBy: "specialPrice",
    sortOrder: "desc",
  },
  {
    label: "Name: A to Z",
    sortBy: "productName",
    sortOrder: "asc",
  },
  {
    label: "Name: Z to A",
    sortBy: "productName",
    sortOrder: "desc",
  },
];

const SortDropdown = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentSortBy = searchParams.get("sortBy");
  const currentSortOrder = searchParams.get("sortOrder");

  const currentOption =
    sortOptions.find(
      (option) =>
        option.sortBy === currentSortBy &&
        option.sortOrder === currentSortOrder
    ) || sortOptions[0];

  const handleSortChange = (option) => {
    const params = new URLSearchParams(searchParams);

    params.delete("sortBy");
    params.delete("sortOrder");
    params.delete("page");

    if (option.sortBy && option.sortOrder) {
      params.set("sortBy", option.sortBy);
      params.set("sortOrder", option.sortOrder);
    }

    setSearchParams(params);
    setIsOpen(false);
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="
          flex h-11 min-w-[190px] items-center justify-between
          gap-6 rounded-xl
          border border-gray-200
          bg-white
          px-4
          text-sm text-gray-900
          shadow-sm
          transition
          hover:border-gray-300
        "
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{currentOption.label}</span>

        <ChevronDown
          size={18}
          className={`text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="
            absolute right-0 z-50 mt-2
            min-w-[190px]
            overflow-hidden
            rounded-xl
            border border-gray-200
            bg-white
            shadow-lg
          "
          role="listbox"
        >
          {sortOptions.map((option) => {
            const isSelected =
              option.sortBy === currentSortBy &&
              option.sortOrder === currentSortOrder;

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => handleSortChange(option)}
                className={`
                  block w-full px-4 py-3 text-left text-sm
                  transition
                  hover:bg-gray-50
                  ${
                    isSelected
                      ? "bg-gray-50 font-medium text-gray-900"
                      : "text-gray-700"
                  }
                `}
                role="option"
                aria-selected={isSelected}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;