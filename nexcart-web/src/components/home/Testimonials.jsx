const testimonials = [
  {
    name: "Rahul Sharma",
    review:
      "Amazing shopping experience. Delivery was quick and products were exactly as described.",
  },
  {
    name: "Priya Verma",
    review:
      "The quality exceeded my expectations. Definitely ordering again.",
  },
  {
    name: "Amit Kumar",
    review:
      "Secure payment process and excellent customer support.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-slate-50 rounded-2xl my-10">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-slate-800">
          What Our Customers Say
        </h2>

        <p className="text-slate-600 mt-3">
          Trusted by thousands of happy shoppers.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="text-yellow-500 text-xl mb-3">
              ★★★★★
            </div>

            <p className="text-slate-600 mb-4">
              "{item.review}"
            </p>

            <h4 className="font-semibold text-slate-800">
              {item.name}
            </h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;