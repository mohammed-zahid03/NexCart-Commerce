import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const HeroBannerNew = () => {
  return (
<section className="relative overflow-hidden bg-gradient-to-b from-black to-gray-900 min-h-screen flex items-center px-8 lg:px-20">      {/* Glow Effects */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-500/15 blur-[140px] rounded-full -top-20 -left-20"></div>

<div className="absolute w-[500px] h-[500px] bg-violet-500/10 blur-[140px] rounded-full -bottom-20 -right-20"></div>

      <div className="relative z-10 grid lg:grid-cols-2 items-center w-full">

        {/* LEFT */}
        <div>

          <span className="text-purple-400 font-semibold uppercase tracking-widest">
            Next Generation Shopping
          </span>

          <h1 className="text-white text-5xl lg:text-[72px] font-bold mt-4 leading-tight">
            Premium Electronics,
            <br />
           For Modern Living.
          </h1>

          <p className="text-slate-300 text-lg mt-6 max-w-lg">
            Shop premium electronics, fashion and lifestyle products from trusted brands with fast delivery and secure checkout.
          </p>

          <div className="flex gap-4 mt-8">

            <Link
              to="/products"
              className="bg-purple-600 hover:bg-purple-700 transition px-7 py-4 rounded-xl text-white font-semibold flex items-center gap-2"
            >
              Shop Now
              <FaArrowRight />
            </Link>

            <Link
              to="/products"
              className="border border-white/20 backdrop-blur-md text-white px-7 py-4 rounded-xl hover:bg-white/10 transition"
            >
              Explore Collection
            </Link>

          </div>

          {/* Stats */}
          <div className="flex gap-12 mt-8">

            <div>
              <h2 className="text-white text-3xl font-bold">
                12K+
              </h2>
              <p className="text-slate-400">
                Customers
              </p>
            </div>

            <div>
              <h2 className="text-white text-3xl font-bold">
                850+
              </h2>
              <p className="text-slate-400">
                Products
              </p>
            </div>

            <div>
              <h2 className="text-white text-3xl font-bold">
                4.9★
              </h2>
              <p className="text-slate-400">
                Rating
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT */}
<div className="relative hidden lg:flex justify-center items-center">

  <div className="absolute w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full"></div>

<img
  src="/hero-headphones.png"
  alt="Premium Headphones"
  className="relative z-10 w-[650px] object-contain drop-shadow-2xl"
/>

          

        </div>

      </div>
    </section>
  );
};

export default HeroBannerNew;