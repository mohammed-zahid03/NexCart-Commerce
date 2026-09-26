import { FaStar, FaCheckCircle } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const TestimonialCard = ({
  testimonial,
  onPrev,
  onNext,
  currentIndex,
  total,
  onDotClick,
}) => {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-[#171717] shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
      {/* Full banner image */}
      <img
        src={testimonial.image}
        alt={testimonial.name}
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          object-center
          brightness-[0.72]
          contrast-[0.95]
          saturate-[0.88]
        "
      />

      {/* Left reading overlay */}
      <div
        className="
          absolute
          inset-0
          bg-[linear-gradient(90deg,rgba(8,8,8,0.88)_0%,rgba(8,8,8,0.68)_32%,rgba(8,8,8,0.34)_58%,rgba(8,8,8,0.08)_82%,rgba(8,8,8,0)_100%)]
        "
      />

      {/* Subtle overall overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content */}
      <div
        className="
          relative
          z-10
          flex
          min-h-[430px]
          items-end
          px-7
          py-8
          sm:px-10
          sm:py-10
          lg:min-h-[440px]
          lg:px-14
          lg:py-12
        "
      >
        <div className="max-w-[680px]">
          {/* Eyebrow */}
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/65 sm:text-[11px]">
            Customer story
          </p>

          {/* Quote */}
          <h2
            className="
              mt-4
              font-display
              text-[28px]
              font-normal
              leading-[1.22]
              tracking-[-0.025em]
              text-white
              sm:text-[35px]
              lg:text-[43px]
              lg:leading-[1.18]
            "
          >
            “{testimonial.quote}”
          </h2>

          {/* Customer info */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[15px] font-semibold text-white">
                  {testimonial.name}
                </span>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-white/15
                    bg-white/10
                    px-2.5
                    py-1
                    text-[10px]
                    font-medium
                    text-white/85
                    backdrop-blur-sm
                  "
                >
                  <FaCheckCircle className="text-[10px] text-emerald-300" />
                  {testimonial.role}
                </span>
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, index) => (
                    <FaStar
                      key={index}
                      className="text-[13px] text-white"
                    />
                  ))}
                </div>

                <span className="text-[12px] text-white/65">
                  {testimonial.purchased}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Previous */}
      <button
        type="button"
        aria-label="Previous testimonial"
        onClick={onPrev}
        className="
          absolute
          left-4
          top-1/2
          z-20
          flex
          h-10
          w-10
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-white/20
          bg-white/90
          text-[#171717]
          shadow-md
          backdrop-blur-sm
          transition
          hover:scale-105
          hover:bg-white
          sm:left-5
        "
      >
        <IoChevronBack className="text-[18px]" />
      </button>

      {/* Next */}
      <button
        type="button"
        aria-label="Next testimonial"
        onClick={onNext}
        className="
          absolute
          right-4
          top-1/2
          z-20
          flex
          h-10
          w-10
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-white/20
          bg-white/90
          text-[#171717]
          shadow-md
          backdrop-blur-sm
          transition
          hover:scale-105
          hover:bg-white
          sm:right-5
        "
      >
        <IoChevronForward className="text-[18px]" />
      </button>

      {/* Dots */}
      <div
        className="
          absolute
          bottom-5
          left-1/2
          z-20
          flex
          -translate-x-1/2
          items-center
          gap-2
        "
      >
        {Array.from({ length: total }).map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to testimonial ${index + 1}`}
            onClick={() => onDotClick(index)}
            className={`
              rounded-full
              transition-all
              duration-200
              ${
                currentIndex === index
                  ? "h-2 w-8 bg-white"
                  : "h-2 w-2 bg-white/40 hover:bg-white/65"
              }
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCard;