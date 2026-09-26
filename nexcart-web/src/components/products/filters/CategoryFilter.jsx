import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { fetchCategories } from "../../../store/actions";

const CategoryFilter = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const categories = useSelector(
    (state) => state.products.categories
  );

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  const categoryList = categories || [];

  const selectedCategory = searchParams.get("category");

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(searchParams);

    if (selectedCategory === category) {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    params.delete("pageNumber");
    params.delete("page");

    setSearchParams(params);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-gray-900">
          Categories
        </h3>

        <span className="text-xs text-gray-500">
          ⌃
        </span>
      </div>

      <div className="space-y-[7px]">
        {categoryList.map((category) => (
          <label
            key={category.categoryId}
            className="flex cursor-pointer items-center justify-between text-[12px]"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  selectedCategory === category.categoryName
                }
                onChange={() =>
                  handleCategoryChange(category.categoryName)
                }
                className="h-3.5 w-3.5 accent-black"
              />

              <span className="text-gray-900">
                {category.categoryName}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;