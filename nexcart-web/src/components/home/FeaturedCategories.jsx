const categories = [
  "Electronics",
  "Fashion",
  "Gaming",
  "Watches",
  "Shoes",
  "Accessories",
];

const FeaturedCategories = () => {
  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold text-center mb-8">
        Featured Categories
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category}
            className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition"
          >
            <h3 className="text-lg font-semibold">
              {category}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;