import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import NotificationBell from "./NotificationBell";

import profileImage from "../../assets/profile/avatar.jpg";

import {
  Search,
  Heart,
  ShoppingCart,
  UserRound,
} from "lucide-react";

import UserMenu from "../UserMenu";

import logoDark from "../../assets/branding/logo-dark.png";

const Navbar = () => {
 const navigate = useNavigate();

const [search, setSearch] = useState("");
const [suggestions, setSuggestions] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);
const [loadingSuggestions, setLoadingSuggestions] = useState(false);

const searchRef = useRef(null);

const { user } = useSelector((state) => state.auth);

useEffect(() => {
  const keyword = search.trim();

  if (keyword.length < 2) {
    setSuggestions([]);
    setShowSuggestions(false);
    return;
  }

  const controller = new AbortController();

  const fetchSuggestions = async () => {
    try {
      setLoadingSuggestions(true);

      const response = await fetch(
        `${import.meta.env.VITE_BACK_END_URL}/api/public/products?keyword=${encodeURIComponent(
          keyword
        )}&pageNumber=0&pageSize=5`,
        {
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search suggestions");
      }

      const data = await response.json();

      setSuggestions(data.content || []);
      setShowSuggestions(true);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Search suggestions error:", error);
        setSuggestions([]);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoadingSuggestions(false);
      }
    }
  };

  const timer = setTimeout(fetchSuggestions, 300);

  return () => {
    clearTimeout(timer);
    controller.abort();
  };
}, [search]);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target)
    ) {
      setShowSuggestions(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

  return (
    <header className="bg-white border-b border-gray-100">
      <div
        className="
          max-w-[1440px] mx-auto
          h-[62px] sm:h-[72px] lg:h-[82px]
          px-4 sm:px-6 lg:px-14
          flex items-center justify-between
        "
      >
        {/* Left Section */}
        <div className="flex items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center flex-shrink-0"
          >
            <img
              src={logoDark}
              alt="NexCart"
              className="h-9 sm:h-11 lg:h-14 w-auto"
            />
          </Link>

         
        </div>
<div
  ref={searchRef}
  className="relative hidden lg:flex items-center w-[700px]"
>
  <div className="flex items-center w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-full px-6 shadow-sm">
    <Search
      size={18}
      className="text-gray-400"
    />

    <input
      type="text"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setShowSuggestions(true);
      }}
      onFocus={() => {
        if (search.trim().length >= 2) {
          setShowSuggestions(true);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && search.trim()) {
          setShowSuggestions(false);

          navigate(
            `/products?keyword=${encodeURIComponent(
              search.trim()
            )}`
          );
        }

        if (e.key === "Escape") {
          setShowSuggestions(false);
        }
      }}
      placeholder="Search for products, brands and more..."
      className="flex-1 bg-transparent outline-none px-4 text-[15px] font-medium text-slate-800 placeholder:text-gray-400"
    />
  </div>

  {showSuggestions && search.trim().length >= 2 && (
    <div className="absolute left-0 right-0 top-[60px] z-50 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
      {loadingSuggestions ? (
        <div className="px-5 py-4 text-sm text-gray-500">
          Searching...
        </div>
      ) : suggestions.length > 0 ? (
        <>
          <div className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Products
          </div>

          <div>
            {suggestions.map((product) => (
              <button
                key={product.productId}
                type="button"
                onClick={() => {
                  setShowSuggestions(false);
                  setSearch("");

                  navigate(`/product/${product.productId}`);
                }}
                className="flex w-full items-center gap-4 px-5 py-3 text-left transition hover:bg-gray-50"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {product.productName}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {product.category?.categoryName || "Product"}
                  </p>
                </div>

                <span className="shrink-0 text-sm font-semibold text-gray-900">
                  ₹{Number(
                    product.specialPrice ?? product.price
                  ).toLocaleString("en-IN")}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setShowSuggestions(false);

              navigate(
                `/products?keyword=${encodeURIComponent(
                  search.trim()
                )}`
              );
            }}
            className="w-full border-t border-gray-100 px-5 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-black"
          >
            View all results for "{search.trim()}"
          </button>
        </>
      ) : (
        <div className="px-5 py-4">
          <p className="text-sm text-gray-700">
            No products found.
          </p>

          <button
            type="button"
            onClick={() => {
              setShowSuggestions(false);

              navigate(
                `/products?keyword=${encodeURIComponent(
                  search.trim()
                )}`
              );
            }}
            className="mt-2 text-sm font-medium text-gray-900 hover:underline"
          >
            Search anyway →
          </button>
        </div>
      )}
    </div>
  )}
</div>

        {/* Right Side */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="
              flex flex-col items-center justify-center
              gap-0.5
              min-w-[42px]
              text-gray-700 hover:text-black
              transition
            "
          >
            <Heart
              size={20}
              strokeWidth={1.8}
            />

            <span className="text-[10px] sm:text-xs leading-none">
              Wishlist
            </span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="
              flex flex-col items-center justify-center
              gap-0.5
              min-w-[34px]
              text-gray-700 hover:text-black
              transition
            "
          >
            <ShoppingCart
              size={20}
              strokeWidth={1.8}
            />

            <span className="text-[10px] sm:text-xs leading-none">
              Cart
            </span>
          </Link>

          {/* Notifications */}
<NotificationBell />

          {/* Account */}
{user && user.id ? (
  <UserMenu />
) : (
 <Link
  to="/login"
  className="group flex flex-col items-center justify-center gap-1.5 px-3 py-1.5 text-gray-900 transition-colors duration-200"
>
  <span className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 group-hover:bg-gray-100">
    <UserRound
      size={21}
      strokeWidth={1.8}
      className="text-gray-800 transition-transform duration-200 group-hover:scale-105"
    />
  </span>

  <span className="text-sm font-medium leading-none">
    Sign in
  </span>
</Link>
)}
        </div>
      </div>
    </header>
  );
};

export default Navbar;