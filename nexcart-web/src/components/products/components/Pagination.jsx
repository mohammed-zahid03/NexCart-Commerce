import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";

const Pagination = ({ currentPage, onPageChange }) => {
  const { pagination } = useSelector(
    (state) => state.products
  );

  const totalPages = pagination?.totalPages ?? 0;

  const pageNumber = pagination?.pageNumber ?? currentPage;

  if (totalPages <= 1) {
    return null;
  }

  const pages = [];

  /*
   * Backend page numbers are normally zero-based.
   * UI page numbers are one-based.
   */
  const activePage = pageNumber + 1;

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (activePage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, activePage - 1);
    const end = Math.min(totalPages - 1, activePage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (activePage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);
  }

  const handlePageClick = (page) => {
    onPageChange(page - 1);
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-2">

      {/* Previous */}
      <button
        type="button"
        disabled={activePage === 1}
        onClick={() =>
          onPageChange(currentPage - 1)
        }
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          border
          border-gray-200
          bg-white
          text-gray-600
          transition
          hover:bg-gray-50
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`dots-${index}`}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                text-[12px]
                text-gray-500
              "
            >
              ...
            </span>
          );
        }

        const isActive = page === activePage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => handlePageClick(page)}
            className={`
              flex
              h-9
              w-9
              items-center
              justify-center
              text-[12px]
              font-medium
              transition
              ${
                isActive
                  ? "rounded-full bg-black text-white"
                  : "rounded-lg text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        type="button"
        disabled={activePage === totalPages}
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          border
          border-gray-200
          bg-white
          text-gray-600
          transition
          hover:bg-gray-50
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronRight size={16} />
      </button>

    </div>
  );
};

export default Pagination;