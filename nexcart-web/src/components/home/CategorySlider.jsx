import {
  FaMobileAlt,
  FaHeadphones,
  FaLaptop,
  FaGamepad,
  FaTshirt,
  FaWatchmanMonitoring,
} from "react-icons/fa";

const categories = [
  {
    name: "Mobiles",
    icon: <FaMobileAlt />,
  },
  {
    name: "Audio",
    icon: <FaHeadphones />,
  },
  {
    name: "Laptops",
    icon: <FaLaptop />,
  },
  {
    name: "Gaming",
    icon: <FaGamepad />,
  },
  {
    name: "Fashion",
    icon: <FaTshirt />,
  },
  {
    name: "Watches",
    icon: <FaWatchmanMonitoring />,
  },
];

const CategorySlider = () => {
  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-center gap-8 flex-wrap">

          {categories.map((category) => (
            <div
              key={category.name}
              className="
              flex
              flex-col
              items-center
              cursor-pointer
              group
              "
            >
              <div
                className="
                w-24
                h-24
                rounded-full
                bg-slate-100
                flex
                items-center
                justify-center
                text-3xl
                text-slate-700
                shadow-md
                transition-all
                duration-300
                group-hover:bg-purple-100
                group-hover:scale-110
                "
              >
                {category.icon}
              </div>

              <span className="mt-3 font-medium text-slate-700">
                {category.name}
              </span>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default CategorySlider;