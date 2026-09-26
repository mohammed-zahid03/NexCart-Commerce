import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import audio from "../../assets/collections/audio.png";
import laptop from "../../assets/collections/laptop.png";
import watch from "../../assets/collections/watch.png";
import gaming from "../../assets/collections/gaming.png";
import monitor from "../../assets/collections/monitor.png";
import smartphone from "../../assets/collections/smartphone.png";

const collections = [
  {
    title: "Audio",
    image: audio,
    path: "/products?category=Audio",
  },
  {
    title: "Laptops",
    image: laptop,
    path: "/products?category=Computers",
  },
  {
    title: "Smartwatches",
    image: watch,
   path: "/products?category=Smartwatches",
  },
  {
    title: "Gaming",
    image: gaming,
    path: "/products?category=Accessories",
  },
  {
    title: "Monitors",
    image: monitor,
    path: "/products?category=Computers",
  },
  {
    title: "Smartphones",
    image: smartphone,
    path: "/products?category=Smartphones",
  },
];

const CuratedCollections = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-14">

        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-semibold text-slate-900">
            Curated Collections
          </h2>

          <Link
  to="/products"
  className="flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
>
  View all collections
  <ArrowRight size={16} />
</Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">

          {collections.map((item, index) => (
  <Link
    key={index}
    to={item.path}
    className="relative h-[320px] rounded-2xl overflow-hidden group cursor-pointer block"
  >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="absolute inset-0 bg-black/35"></div>

              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <span className="text-white font-semibold">
                  {item.title}
                </span>

                <div className="w-9 h-9 rounded-full border border-white/50 flex items-center justify-center">
                  <ArrowRight size={16} className="text-white" />
                </div>
              </div>

            </Link>
          ))}

        </div>

      </div>
    </section>
  );
};

export default CuratedCollections;