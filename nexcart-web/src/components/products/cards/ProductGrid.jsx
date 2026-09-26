import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import {
  fetchProducts,
  getWishlist,
} from "../../../store/actions";

import ProductCard from "./ProductCard";

const ProductGrid = ({ page = 0 }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const {
    products,
    isLoading,
  } = useSelector((state) => state.products);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    params.set("pageNumber", page);
    params.set("pageSize", "20");

    dispatch(fetchProducts(params.toString()));
  }, [dispatch, searchParams, page]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-[500px] animate-pulse rounded-2xl border border-gray-200 bg-white"
          />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <p className="text-sm text-gray-500">
          No products found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.productId}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductGrid;