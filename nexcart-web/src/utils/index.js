import {
  FaBoxOpen,
  FaHome,
  FaShoppingCart,
  FaStore,
  FaThList,
  FaUndoAlt,
  FaEnvelope,
  FaClipboardList,
  FaUsers,
  FaStar
} from "react-icons/fa";
import { bannerImageOne, bannerImageThree, bannerImageTwo } from "./constant";

export const bannerLists = [
    {
        id: 1,
        image: bannerImageOne,
        title: "Home Comfort",
        subtitle: "Living Room",
        description: "Upgrade your space with cozy and stylish sofas",
      },
      {
        id: 2,
        image: bannerImageTwo,
        title: "Entertainment Hub",
        subtitle: "Smart TV",
        description: "Experience the latest in home entertainment",
      },
      {
        id: 3,
        image: bannerImageThree,
        title: "Playful Picks",
        subtitle: "Kids' Clothing",
        description: "Bright and fun styles for kids, up to 20% off",
    }
];


export const adminNavigation = [
  {
    name: "Dashboard", 
    href: "/admin", 
    icon: FaHome, 
    current: true 
  }, {
    name: "Orders", 
    href: "/admin/orders", 
    icon: FaShoppingCart
  }, {
    name: "Products", 
    href: "/admin/products", 
    icon: FaBoxOpen
  }, {
    name: "Categories", 
    href: "/admin/categories", 
    icon: FaThList
  }, 
   {
    name: "Sellers", 
    href: "/admin/sellers", 
    icon: FaStore 
  }, 
  {
  name: "Customers",
  href: "/admin/customers",
  icon: FaUsers
},
{
  name: "Reviews",
  href: "/admin/reviews",
  icon: FaStar
},
  {
    name: "Seller Applications",
    href: "/admin/seller-applications",
    icon: FaClipboardList
},
  {
    name: "Returns",
    href: "/admin/returns",
    icon: FaUndoAlt
   }, {
    name: "Contact Messages",
    href: "/admin/contact-messages",
    icon: FaEnvelope
  },
  {
  name: "Audit Logs",
  href: "/admin/audit-logs",
  icon: FaClipboardList
}
];


export const sellerNavigation = [
  {
    name: "Dashboard",
    href: "/seller",
    icon: FaHome,
    current: true
  },
  {
    name: "Orders",
    href: "/seller/orders",
    icon: FaShoppingCart
  },
  {
    name: "Products",
    href: "/seller/products",
    icon: FaBoxOpen
  }
];