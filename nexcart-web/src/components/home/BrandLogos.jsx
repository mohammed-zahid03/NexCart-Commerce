const brands = [
  "Apple",
  "Samsung",
  "Sony",
  "Nike",
  "Adidas",
  "Puma",
];

const BrandLogos = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-slate-800">
          Trusted Brands
        </h2>

        <p className="text-slate-600 mt-2">
          Explore products from leading global brands
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {brands.map((brand) => (
          <div
            key={brand}
            className="bg-white border rounded-xl py-6 text-center font-semibold text-slate-700 shadow-sm hover:shadow-lg transition"
          >
            {brand}
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandLogos;