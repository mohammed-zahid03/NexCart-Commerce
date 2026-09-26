import { Link } from "react-router-dom";

const footerRoutes = {
  "All Products": "/products",
  "Best Sellers": "/products",
  "New Arrivals": "/products",
  "Deals": "/products",
  "Gift Cards": null,

  "Help Center": "/contact",
  "Track Order": "/profile/orders",
  "Returns & Refunds": "/profile/orders",
  "Shipping Info": "/contact",
  "Contact Us": "/contact",

  "About Us": "/about",
  "Careers": null,
  "Press": null,
  "Blog": null,
  "Affiliate Program": null,

  "Terms & Conditions": null,
  "Privacy Policy": null,
  "Refund Policy": null,
  "Shipping Policy": null,
};

const FooterColumn = ({ title, items }) => {
  return (
    <div>
      <h3 className="mb-8 text-[17px] font-medium text-white">
        {title}
      </h3>

      <ul className="space-y-[18px]">
        {items.map((item) => {
          const route = footerRoutes[item];

          return (
            <li key={item}>
              {route ? (
                <Link
                  to={route}
                  className="
                    inline-block
                    text-[16px]
                    leading-9
                    text-[#B8B8B8]
                    transition-all
                    duration-300
                    hover:text-white
                    hover:translate-x-[2px]
                  "
                >
                  {item}
                </Link>
              ) : (
                <span
                  className="
                    inline-block
                    text-[16px]
                    leading-9
                    text-[#B8B8B8]
                  "
                >
                  {item}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FooterColumn;