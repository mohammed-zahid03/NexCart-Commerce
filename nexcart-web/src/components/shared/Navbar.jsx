import { Badge } from "@mui/material";
import { useState } from "react";
import { FaShoppingCart, FaSignInAlt } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import UserMenu from "../UserMenu";
import { FaSearch } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

const Navbar = () => {
  const path = useLocation().pathname;
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { cart } = useSelector((state) => state.carts);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="h-[72px] bg-slate-950/90 backdrop-blur-xl  border-b border-white/10 text-white z-50 flex items-center sticky top-0 shadow-xl">
      <div className="lg:px-14 sm:px-8 px-4 w-full flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center text-2xl font-bold tracking-wide hover:scale-105 transition duration-300"
        >
          <FiShoppingBag className="mr-2 text-4xl text-purple-400" />
          <span className="font-bold tracking-wide">NexCart</span>
        </Link>

        <div className="hidden lg:flex items-center bg-white/95 rounded-full px-5 py-3 w-[360px] shadow-xl border border-gray-200">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-black w-full"
          />
        </div>

        <ul
          className={`flex sm:gap-12 gap-5 sm:items-center  text-slate-800 sm:static absolute left-0 top-[70px] sm:shadow-none shadow-md ${
            navbarOpen ? "h-fit sm:pb-0 pb-5" : "h-0 overflow-hidden"
          }  transition-all duration-100 sm:h-fit sm:bg-none bg-custom-gradient   text-white sm:w-fit w-full sm:flex-row flex-col px-4 sm:px-0`}
        >
          <li className="font-semiboldtransition-all duration-150">
            <Link
              className={`transition duration-300 hover:text-white hover:scale-105 ${
                path === "/" ? "text-white font-semibold" : "text-gray-200"
              }`}
              to="/"
            >
              Home
            </Link>
          </li>

          <li className="font-semibold">
            <Link
              className={`transition duration-300 hover:text-white hover:scale-105 ${
                path === "/products"
                  ? "text-white font-semibold"
                  : "text-gray-200"
              }`}
              to="/products"
            >
              Products
            </Link>
          </li>

          <li className="font-semibold">
            <Link
              className={`transition duration-300 hover:text-white hover:scale-105 ${
                path === "/about" ? "text-white font-semibold" : "text-gray-200"
              }`}
              to="/about"
            >
              About
            </Link>
          </li>

          <li className="font-semibold">
            <Link
              className={`transition duration-300 hover:text-white hover:scale-105 ${
                path === "/contact"
                  ? "text-white font-semibold"
                  : "text-gray-200"
              }`}
              to="/contact"
            >
              Contact
            </Link>
          </li>

          <li>
            <div className="flex items-center gap-5 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Link
                className={`${
                  path === "/wishlist" ? "text-white" : "text-gray-300"
                }`}
                to="/wishlist"
              >
                <Badge
                  showZero
                  badgeContent={wishlist?.length || 0}
                  color="error"
                  overlap="circular"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <FaHeart size={22} />
                </Badge>
              </Link>

              <div className="h-5 w-px bg-white/20"></div>

              <Link
                className={`${
                  path === "/cart" ? "text-white" : "text-gray-300"
                }`}
                to="/cart"
              >
                <Badge
                  showZero
                  badgeContent={cart?.length || 0}
                  color="primary"
                  overlap="circular"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <FaShoppingCart size={22} />
                </Badge>
              </Link>
            </div>
          </li>
          {user && user.id ? (
            <li className="font-medium transition-all duration-150">
              <UserMenu />
            </li>
          ) : (
            <li className="font-medium transition-all duration-150">
              <Link
                className="flex items-center space-x-2 px-4 py-[6px] 
                            bg-linear-to-r from-purple-600 to-violet-500
                            text-white font-semibold rounded-md shadow-lg 
                            hover:from-purple-700 hover:to-violet-600
                            duration-300 ease-in-out transform "
                to="/login"
              >
                <FaSignInAlt />
                <span>Login</span>
              </Link>
            </li>
          )}
        </ul>

        <button
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="sm:hidden flex items-center sm:mt-0 mt-2"
        >
          {navbarOpen ? (
            <RxCross2 className="text-white text-3xl" />
          ) : (
            <IoIosMenu className="text-white text-3xl" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
