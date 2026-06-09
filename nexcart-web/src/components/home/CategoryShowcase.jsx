import electronics from "../../assets/categories/electronics.jpg";
import fashion from "../../assets/categories/fashion.jpg";
import books from "../../assets/categories/books.jpg";
import sports from "../../assets/categories/sports.jpg";

const categories = [
  {
    name: "Electronics",
    image: electronics,
  },
  {
    name: "Fashion",
    image: fashion,
  },
  {
    name: "Books",
    image: books,
  },
  {
    name: "Sports",
    image: sports,
  },
];

const CategoryShowcase = () => {
  return (
    <section className="py-20">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-slate-800">
          Featured Collections
        </h2>
        <p className="text-slate-600 mt-2">
          Explore products from our most popular categories
        </p>
      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <div
            key={category.name}
            className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
          >
            <img
              src={category.image}
              alt={category.name}
              className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <h3 className="text-white text-2xl font-bold">
                {category.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryShowcase;