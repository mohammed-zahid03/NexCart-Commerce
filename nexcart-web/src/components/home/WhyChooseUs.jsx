import {
  FaShippingFast,
  FaShieldAlt,
  FaUndo,
  FaHeadset,
} from "react-icons/fa";

const features = [
  {
    icon: <FaShippingFast size={35} />,
    title: "Free Shipping",
    description: "Free delivery on all orders above ₹499",
  },
  {
    icon: <FaShieldAlt size={35} />,
    title: "Secure Payments",
    description: "100% safe and encrypted payment process",
  },
  {
    icon: <FaUndo size={35} />,
    title: "Easy Returns",
    description: "Hassle-free returns within 7 days",
  },
  {
    icon: <FaHeadset size={35} />,
    title: "24/7 Support",
    description: "Dedicated customer support anytime",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-slate-800">
          Why Choose NexCart
        </h2>

        <p className="text-slate-600 mt-3">
          Shopping made simple, secure, and reliable.
        </p>
      </div>

      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition duration-300"
          >
            <div className="flex justify-center text-indigo-600 mb-4">
              {feature.icon}
            </div>

            <h3 className="font-bold text-lg mb-2">
              {feature.title}
            </h3>

            <p className="text-sm text-slate-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;