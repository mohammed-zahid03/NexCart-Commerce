const ProductHeader = () => {
  return (
    <div className="mb-5 flex items-start justify-between">
      <div>
        <h1 className="text-5xl font-bold tracking-tight">
          Products
        </h1>

        <p className="mt-3 text-lg text-gray-500">
          Discover premium technology curated for modern lifestyles.
        </p>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Showing 1–20 of 2,148 products
      </p>
    </div>
  );
};

export default ProductHeader;