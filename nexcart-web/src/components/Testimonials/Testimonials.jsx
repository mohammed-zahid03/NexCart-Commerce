import { useEffect, useState } from "react";
import testimonials from "./testimonialsData";
import TestimonialCard from "./TestimonialCard";

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  // Auto slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-[1650px] mx-auto px-8 py-20">

      <TestimonialCard
        testimonial={testimonials[current]}
        onPrev={prevSlide}
        onNext={nextSlide}
        currentIndex={current}
        total={testimonials.length}
        onDotClick={goToSlide}
      />

    </section>
  );
};

export default Testimonials;