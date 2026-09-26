import heroBg from "../../assets/hero/hero-bg.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative h-[620px] overflow-hidden">
      {/* Background Image */}
      <img
        src={heroBg}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover object-[88%_center] brightness-110 contrast-110"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto h-full px-14">
        <div className="flex h-full items-center">
          <div className="max-w-[460px] ml-4">
            <p className="uppercase tracking-[0.25em] text-sm font-medium text-gray-300">
              NEW COLLECTION
            </p>

            <h1 className="mt-6 text-[72px] leading-[1] font-serif text-white">
  Tech that
  <br />
  <span className="whitespace-nowrap">
    moves with you.
  </span>
</h1>

            <p className="mt-8 text-lg leading-8 text-gray-300">
              Thoughtfully designed premium gadgets and accessories to simplify
              every moment.
            </p>

            <div className="mt-10 flex gap-5">
              <Link
  to="/products"
  className="
    inline-flex
    items-center
    justify-center
    rounded-lg
    bg-black
    px-8
    py-[18px]
    text-white
    transition
    duration-300
    hover:bg-neutral-900
  "
>
  Explore Collection
</Link>

              <Link
  to="/best-sellers"
  className="
    inline-flex
    items-center
    justify-center
    rounded-lg
    border
    border-white/40
    px-8
    py-[18px]
    text-white
    backdrop-blur-sm
    transition
    duration-300
    hover:bg-white/10
  "
>
  Shop Bestsellers
</Link>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
