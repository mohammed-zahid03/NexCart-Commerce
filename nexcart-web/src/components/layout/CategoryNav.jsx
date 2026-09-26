import { useEffect, useState } from "react";
import { Menu, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

const CategoryNav = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const response = await api.get("/public/categories", {
          params: {
            pageNumber: 0,
            pageSize: 100,
            sortBy: "categoryName",
            sortOrder: "asc",
          },
        });

        setCategories(response.data.content || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
  setShowCategories(false);
  navigate(`/products?category=${encodeURIComponent(categoryName)}`);
};

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto h-14 px-8 lg:px-14 flex items-center justify-between">

        {/* Left - Shop by Category */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCategories((prev) => !prev)}
            className="flex items-center gap-2 font-semibold text-slate-900 hover:text-gray-600 transition"
          >
            <Menu size={20} />

            <span>Shop by Category</span>

            <ChevronDown
              size={18}
              className={`transition-transform ${
                showCategories ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Category Dropdown */}
          {showCategories && (
            <div className="absolute left-0 top-full z-50 mt-3 w-64 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
              {loading ? (
                <div className="px-4 py-4 text-sm text-gray-500">
                  Loading categories...
                </div>
              ) : categories.length > 0 ? (
                <div className="max-h-80 overflow-y-auto py-2">
                  {categories.map((category) => (
                    <button
                      key={category.categoryId}
                      type="button"
                     onClick={() =>
  handleCategoryClick(category.categoryName)
}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition"
                    >
                      {category.categoryName}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-4 text-sm text-gray-500">
                  No categories available.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center Navigation */}
        <div className="hidden lg:flex items-center gap-14">
          <Link
            to="/products"
            className="hover:text-gray-600 transition"
          >
            Shop
          </Link>

        <Link
  to="/deals"
  className="hover:text-gray-600 transition"
>
  Deals
</Link>

<Link
  to="/new-arrivals"
  className="hover:text-gray-600 transition"
>
  New Arrivals
</Link>

<Link
  to="/best-sellers"
  className="hover:text-gray-600 transition"
>
  Best Sellers
</Link>

<Link
  to="/brands"

  className="hover:text-gray-600 transition"
>
  Brands
</Link>
          <Link
            to="/about"
            className="hover:text-gray-600 transition"
          >
            About Us
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CategoryNav;