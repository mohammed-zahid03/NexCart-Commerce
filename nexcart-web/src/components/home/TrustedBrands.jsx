import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import apple from "../../assets/brands/apple.png";
import samsung from "../../assets/brands/samsung.png";
import sony from "../../assets/brands/sony.png";
import dell from "../../assets/brands/dell.png";
import nike from "../../assets/brands/nike.png";
import canon from "../../assets/brands/canon.png";
import bose from "../../assets/brands/bose.png";
import logitech from "../../assets/brands/logitech.png";

import api from "../../api/api";

const brandAssets = {
  Apple: {
    image: apple,
    className: "h-17",
  },
  Samsung: {
    image: samsung,
    className: "h-20",
  },
  Sony: {
    image: sony,
    className: "h-20",
  },
  Dell: {
    image: dell,
    className: "h-15",
  },
  Nike: {
    image: nike,
    className: "h-14",
  },
  Canon: {
    image: canon,
    className: "h-16",
  },
  Bose: {
    image: bose,
    className: "h-15",
  },
  Logitech: {
    image: logitech,
    className: "h-19",
  },
};

const TrustedBrands = ({ page = false }) => {
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const { data } = await api.get("/public/brands");

        const availableBrands = (data || [])
          .filter((brandName) => brandAssets[brandName])
          .map((brandName) => ({
            name: brandName,
            ...brandAssets[brandName],
          }));

        setBrands(availableBrands);
      } catch (error) {
        console.error("Failed to load brands:", error);
        setBrands([]);
      }
    };

    loadBrands();
  }, []);

  const handleBrandClick = (brandName) => {
    navigate(`/products?brand=${encodeURIComponent(brandName)}`);
  };

    if (page) {
  return (
    <section className="bg-[#fbfaf7]">
     <div className="mx-auto max-w-[1400px] px-6 pt-7 pb-10 md:pt-9 md:pb-12">

        {/* Page intro */}
        <div className="max-w-[760px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#6f8095]">
            Our Brands
          </p>

          <h1
            className="
              mt-4
              font-display
              text-[40px]
              font-normal
              leading-[1.05]
              tracking-[-0.045em]
              text-[#151515]
              md:text-[48px]
            "
          >
            Brands worth knowing.
          </h1>

          <p
            className="
              mt-4
              max-w-[620px]
              text-[15px]
              leading-6
              text-[#68798f]
              md:text-[16px]
              md:leading-7
            "
          >
            Explore technology from trusted brands, thoughtfully selected
            for the way you work, create, connect and live.
          </p>
        </div>

        {/* Divider */}
        <div className="mt-6 border-t border-[#e5e0d8]" />

        {/* Brand section */}
        <div className="mt-6">

          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#6f8095]">
                Explore brands
              </p>

              <h2
                className="
                  mt-2
                  font-display
                  text-[26px]
                  font-normal
                  tracking-[-0.03em]
                  text-[#151515]
                  md:text-[30px]
                "
              >
                Find the brands you trust.
              </h2>
            </div>

            <span className="hidden text-sm text-[#7a8490] sm:block">
              {brands.length} brands
            </span>
          </div>

          {/* Brand cards */}
         <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((brand) => (
              <button
                key={brand.name}
                type="button"
                onClick={() => handleBrandClick(brand.name)}
                aria-label={`View ${brand.name} products`}
                className="
                  group
                  relative
                  flex
                  min-h-[175px]
                  flex-col
                  justify-between
                  rounded-[16px]
                  border
                  border-[#e4dfd6]
                  bg-[#fffefb]
                  p-6
                  text-left
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#d2cbc0]
                  hover:shadow-[0_16px_40px_rgba(21,21,21,0.07)]
                "
              >
                {/* Logo */}
                <div className="flex h-[68px] items-center justify-center">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className={`
                      ${brand.className}
                      w-auto
                      max-w-[180px]
                      object-contain
                      opacity-70
                      transition-all
                      duration-300
                      group-hover:scale-105
                      group-hover:opacity-100
                    `}
                  />
                </div>

                {/* Bottom content */}
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[14px] font-medium text-[#151515]">
                      {brand.name}
                    </p>

                    <p className="mt-1 text-[11px] text-[#8a8a84]">
                      Explore products
                    </p>
                  </div>

                  <span
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#ddd7ce]
                      text-[#454545]
                      transition-all
                      duration-300
                      group-hover:border-[#151515]
                      group-hover:bg-[#151515]
                      group-hover:text-white
                    "
                  >
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom brand statement */}
        <div
          className="
            mt-10
            rounded-[16px]
            border
            border-[#e5e0d8]
            bg-[#f3f0ea]
            px-6
            py-6
            md:px-8
            md:py-7
          "
        >
          <div className="max-w-[800px]">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#6f8095]">
              Thoughtfully selected
            </p>

            <p
              className="
                mt-3
                font-display
                text-[20px]
                leading-tight
                tracking-[-0.025em]
                text-[#151515]
                md:text-[24px]
              "
            >
              Technology from brands chosen for quality, innovation and
              everyday value.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
  return (
    <section className="mx-auto max-w-[1600px] px-8 pt-10 pb-12">

      {/* Heading */}
      <h3
        className="
          font-display
          text-[30px]
          font-medium
          tracking-[-0.03em]
          text-[#111827]
        "
      >
        Trusted by leading brands
      </h3>

      {/* Logos */}
      <div className="mt-12 flex items-center justify-between">
        {brands.map((brand) => (
          <button
            key={brand.name}
            type="button"
            onClick={() => handleBrandClick(brand.name)}
            aria-label={`View ${brand.name} products`}
            className="
              flex
              h-20
              flex-1
              items-center
              justify-center
              cursor-pointer
              transition-all
              duration-300
              bg-transparent
              border-0
            "
          >
            <img
              src={brand.image}
              alt={brand.name}
              className={`
                ${brand.className}
                w-auto
                object-contain
                opacity-65
                transition-all
                duration-300
                hover:opacity-100
                hover:scale-105
              `}
            />
          </button>
        ))}
      </div>

    </section>
  );
};

export default TrustedBrands;