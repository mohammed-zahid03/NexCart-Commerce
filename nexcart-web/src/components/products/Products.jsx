import { useState } from "react";
import { useSelector } from "react-redux";

import Breadcrumb from "./components/Breadcrumb";
import ActiveFilters from "./components/ActiveFilters";
import SortDropdown from "./components/SortDropdown";
import FilterSidebar from "./filters/FilterSidebar";
import ProductGrid from "./cards/ProductGrid";
import Pagination from "./components/Pagination";

const Products = () => {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <main className="bg-[#f8fafc]">
      <div className="mx-auto max-w-[1600px] px-8">

        {/* Top Row: Breadcrumb + Product Toolbar */}
        <div className="mt-2 mb-4 grid grid-cols-[280px_1fr] items-center gap-10">

          {/* Breadcrumb */}
          <div className="py-3">
            <Breadcrumb />
          </div>

          {/* Product Toolbar */}
          <div className="flex min-w-0 items-center justify-between gap-4">

            {/* Count + Active Filters */}
            <div className="flex min-w-0 items-center gap-5">
              <ProductCount />

              <ActiveFilters />
            </div>

            {/* Sort */}
            <SortDropdown />

          </div>
        </div>

        {/* Sidebar + Products */}
        <div className="grid grid-cols-[280px_1fr] gap-10">

          {/* LEFT SIDEBAR */}
          <aside className="w-[280px]">
            <FilterSidebar />
          </aside>

          {/* RIGHT PRODUCTS */}
          <section className="min-w-0">

            <ProductGrid page={currentPage} />

            <Pagination
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />

          </section>
        </div>

      </div>
    </main>
  );
};

const ProductCount = () => {
  const { pagination } = useSelector(
    (state) => state.products
  );

  const pageNumber = pagination?.pageNumber ?? 0;
  const pageSize = pagination?.pageSize ?? 20;
  const totalElements = pagination?.totalElements ?? 0;

  if (totalElements === 0) {
    return (
      <p className="shrink-0 whitespace-nowrap text-sm text-gray-500">
        No products
      </p>
    );
  }

  const start = pageNumber * pageSize + 1;

  const end = Math.min(
    start + pageSize - 1,
    totalElements
  );

  return (
    <p className="shrink-0 whitespace-nowrap text-sm text-gray-500">
      Showing {start}–{end} of{" "}
      {totalElements.toLocaleString("en-IN")} products
    </p>
  );
};

export default Products;