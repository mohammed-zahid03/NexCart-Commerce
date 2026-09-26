import {
  FaMobileAlt,
  FaTshirt,
  FaGamepad,
  FaClock,
  FaShoePrints,
  FaGem,
} from "react-icons/fa";

const categories = [
  {
    icon: <FaMobileAlt />,
    title: "Electronics",
    count: "120 Products",
  },
  {
    icon: <FaTshirt />,
    title: "Fashion",
    count: "85 Products",
  },
  {
    icon: <FaGamepad />,
    title: "Gaming",
    count: "60 Products",
  },
  {
    icon: <FaClock />,
    title: "Watches",
    count: "45 Products",
  },
  {
    icon: <FaShoePrints />,
    title: "Shoes",
    count: "70 Products",
  },
  {
    icon: <FaGem />,
    title: "Accessories",
    count: "95 Products",
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-16">

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900">
          Shop by Category
        </h2>

        <p className="text-slate-500 mt-3 text-lg">
          Discover products across our most popular collections
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">

        {categories.map((category) => (
          <div
            key={category.title}
            className="
            bg-white
            rounded-3xl
            p-8
            text-center
            shadow-lg
            hover:shadow-2xl
            hover:-translate-y-2
            hover:scale-105
            transition-all
            duration-300
            cursor-pointer
            border border-slate-100
            "
          >

            <div className="flex justify-center mb-5">
              <div
                className="
                w-20 h-20
                rounded-2xl
                bg-purple-100
                flex items-center justify-center
                text-purple-600
                text-4xl
                "
              >
                {category.icon}
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              {category.title}
            </h3>

            <p className="text-slate-500 mt-2">
              {category.count}
            </p>

          </div>
        ))}

      </div>
    </section>
  );
};

export default FeaturedCategories;