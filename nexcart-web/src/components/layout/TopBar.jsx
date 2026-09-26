import { Link } from "react-router-dom";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Lock,
} from "lucide-react";

const TopBar = () => {
  return (
    <div className="hidden lg:flex bg-[#111111] text-gray-300 text-[13px] h-10 items-center justify-between px-14">

      {/* Left - Benefits */}
      <div className="flex items-center gap-8">

        <div className="flex items-center gap-2 hover:text-white transition">
          <Truck size={15} />
          <span>Free delivery on orders over ₹999</span>
        </div>

        <div className="flex items-center gap-2 hover:text-white transition">
          <RotateCcw size={15} />
          <span>30-day easy returns</span>
        </div>

        <div className="flex items-center gap-2 hover:text-white transition">
          <ShieldCheck size={15} />
          <span>2-year warranty</span>
        </div>

        <div className="flex items-center gap-2 hover:text-white transition">
          <Lock size={15} />
          <span>Secure checkout</span>
        </div>

      </div>

      {/* Right - Navigation */}
      <div className="flex items-center gap-7">

        <Link
          to="/profile/orders"
          className="hover:text-white transition"
        >
          Track Order
        </Link>

        <Link
          to="/contact"
          className="hover:text-white transition"
        >
          Help Center
        </Link>

        {/* Not functional yet - keep as display only */}
        <span className="text-gray-300">
          INR ▼
        </span>

        <span className="text-gray-300">
          EN ▼
        </span>

      </div>

    </div>
  );
};

export default TopBar;