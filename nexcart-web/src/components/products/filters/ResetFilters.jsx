import { useSearchParams } from "react-router-dom";

const ResetFilters = () => {
  const [, setSearchParams] = useSearchParams();

  const handleReset = () => {
    setSearchParams({});
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
    >
      Reset Filters
    </button>
  );
};

export default ResetFilters;