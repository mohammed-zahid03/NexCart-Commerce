import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../store/actions";
import { useState } from "react";

const ProductDetails = () => {
  const { id } = useParams();

  const [qty, setQty] = useState(1);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const { products } = useSelector((state) => state.products);

  console.log(products);
  console.log(id);

  const product = products?.find((item) => String(item.productId) === id);

  if (!products) {
    return <div className="p-10">Loading...</div>;
  }

  if (!product) {
    return <div className="p-10">Product not found</div>;
  }

  return (
    <div className="lg:px-14 sm:px-8 px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Left Side Image */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          {product.discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
              {product.discount}% OFF
            </span>
          )}

          <img
            src={product.image}
            alt={product.productName}
            className="w-full h-[500px] object-cover"
          />
        </div>
        {/* Right Side Details */}
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            {product.productName}
          </h1>

          <div className="flex items-center mt-4">
            <span className="text-yellow-400 text-xl">★★★★★</span>

            <span className="ml-2 text-gray-500">(124 Reviews)</span>
          </div>

          <div className="mt-6">
            {product.specialPrice ? (
              <>
                <span className="text-gray-400 line-through text-xl">
                  ${Number(product.price).toFixed(2)}
                </span>

                <span className="ml-3 text-3xl font-bold text-slate-800">
                  ${Number(product.specialPrice).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-slate-800">
                ${Number(product.price).toFixed(2)}
              </span>
            )}
          </div>

          <div className="mt-4">
            {product.quantity > 0 ? (
              <span className="text-green-600 font-semibold">In Stock</span>
            ) : (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            )}
          </div>

          <p className="mt-6 text-gray-600 leading-relaxed">
            {product.description}
          </p>

          <label className="font-medium text-slate-700">Quantity</label>

          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              -
            </button>

            <span className="font-semibold text-lg">{qty}</span>

            <button
              onClick={() => setQty(qty + 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              +
            </button>
          </div>

          <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold">
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductDetails;
