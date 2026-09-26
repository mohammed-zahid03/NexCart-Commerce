const FilterCard = ({ title, children }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">

      {/* Header */}
      <div className="mb-3 flex items-center justify-between">

        <h3 className="text-[13px] font-semibold text-gray-900">
          {title}
        </h3>

        <span className="text-xs text-gray-500">
          ⌃
        </span>

      </div>

      {/* Content */}
      {children}

    </div>
  );
};

export default FilterCard;