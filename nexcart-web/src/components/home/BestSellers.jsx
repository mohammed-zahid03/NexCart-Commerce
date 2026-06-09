import { useSelector } from "react-redux";
import ProductCard from "../shared/ProductCard";

const BestSellers = () => {
  const { products } = useSelector((state) => state.products);

  const bestSellers = products?.slice(0, 4);

  return (
    <section className="py-16 bg-slate-50 rounded-3xl my-10">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-slate-800">
          Best Sellers
        </h2>

        <p className="text-slate-600 mt-2">
          Our most popular products loved by customers
        </p>
      </div>

      <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6 px-4">
        {bestSellers?.map((item) => (
          <div key={item.productId} className="relative">
            <span className="absolute top-3 right-3 z-10 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              Best Seller
            </span>

            <ProductCard {...item} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSellers;