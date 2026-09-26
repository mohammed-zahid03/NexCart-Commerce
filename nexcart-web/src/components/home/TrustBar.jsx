import {
  FaShippingFast,
  FaShieldAlt,
  FaUndoAlt,
  FaStar,
} from "react-icons/fa";

const TrustBar = () => {
  const items = [
    {
      icon: <FaShippingFast />,
      title: "Free Shipping",
      subtitle: "On all orders",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Checkout",
      subtitle: "100% protected",
    },
    {
      icon: <FaUndoAlt />,
      title: "30-Day Returns",
      subtitle: "Easy refunds",
    },
    {
      icon: <FaStar />,
      title: "10K+ Customers",
      subtitle: "Trusted worldwide",
    },
  ];

  return (
    <section className="grid md:grid-cols-4 gap-6 py-10">
      {items.map((item, index) => (
        <div
          key={index}
          className="
          bg-white
          rounded-2xl
          shadow-lg
          hover:shadow-xl
          hover:-translate-y-1
          transition-all
          duration-300
          p-6
          flex
          items-center
          gap-4
        "
        >
          <div className="text-purple-600 text-3xl">
            {item.icon}
          </div>

          <div>
            <h3 className="font-semibold text-slate-800">
              {item.title}
            </h3>

            <p className="text-sm text-slate-500">
              {item.subtitle}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default TrustBar;