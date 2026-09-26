import workspaceBanner from "../../assets/banners/workspace-banner.png";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const MainPromoBanner = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-12">

        <div
          className="
            overflow-hidden
            rounded-[28px]
            bg-[#111111]
            grid
            grid-cols-1
            lg:grid-cols-[62%_38%]
            min-h-[360px]
            shadow-sm
          "
        >

          {/* Image */}
          <div className="relative min-h-[260px] lg:min-h-[360px] overflow-hidden">

            <img
              src={workspaceBanner}
              alt="Modern workspace"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                transition-transform
                duration-700
                hover:scale-105
              "
            />

          </div>

          {/* Content */}
          <div className="flex flex-col justify-center px-8 py-10 lg:px-10">

            <p className="text-[11px] tracking-[0.28em] uppercase text-gray-400 font-medium">
              FEATURED STORY
            </p>

            <h2 className="mt-4 font-serif text-[40px] lg:text-[46px] leading-[1.05] tracking-[-0.03em] text-white">
              The modern
              <br />
              workspace
            </h2>

            <p className="mt-4 max-w-[390px] text-[14px] leading-6 text-gray-400">
              Tools that inspire productivity and elevate your craft.
              Designed for creators, professionals, and everyday work.
            </p>

            <Link
              to="/products"
              className="
                group
                mt-6
                inline-flex
                w-fit
                items-center
                gap-3
                rounded-full
                border
                border-white/40
                px-6
                py-3
                text-[14px]
                font-medium
                text-white
                hover:bg-white
                hover:text-black
                transition-all
              "
            >
              Explore Collection

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
};

export default MainPromoBanner;