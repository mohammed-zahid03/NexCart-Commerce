import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    subtitle: "On orders over $50",
  },
  {
    icon: RotateCcw,
    title: "30-day Returns",
    subtitle: "Hassle-free returns",
  },
  {
    icon: ShieldCheck,
    title: "2-year Warranty",
    subtitle: "Quality you can trust",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    subtitle: "100% protected",
  },
];

const FeatureIcons = () => {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-14 py-8">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex items-center gap-4"
              >
                <Icon size={28} className="text-black" />

                <div>
                  <h4 className="font-semibold text-gray-900">
                    {item.title}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default FeatureIcons;