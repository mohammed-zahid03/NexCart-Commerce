import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOutUser } from "../store/actions";

import {
  UserRound,
  ShoppingBag,
  Heart,
  Store,
  ShieldCheck,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { Menu, MenuItem } from '@mui/material';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const isSeller = user?.roles?.includes("ROLE_SELLER");

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menu with Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    dispatch(logOutUser(navigate));
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="relative z-50">
      {/* =========================
          ACCOUNT BUTTON
      ========================== */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="
          group
          flex items-center justify-center
          h-10 w-10
          rounded-full
          border border-slate-300
          bg-slate-100
          overflow-hidden
          transition-all duration-200
           hover:border-slate-400
          hover:shadow-sm
          focus:outline-none
        "
      >
       <UserRound
  size={21}
  strokeWidth={1.7}
   className="text-slate-600"
/>
      </button>

      {/* =========================
          DROPDOWN
      ========================== */}
      {isOpen && (
        <div
          role="menu"
          className="
            absolute
            right-0
            top-[calc(100%+12px)]
            w-[285px]
            overflow-hidden
            rounded-[14px]
            border border-[#e7e5e1]
            bg-white
            shadow-[0_12px_40px_rgba(0,0,0,0.10)]
          "
        >
          {/* =========================
              ACCOUNT HEADER
          ========================== */}
          <Link
            to="/profile"
            onClick={closeMenu}
            className="
              flex items-center gap-3
              px-5 py-4
              border-b border-[#eeeae4]
              transition-colors
              hover:bg-[#faf9f7]
            "
          >
           <div
  className="
    flex h-11 w-11
    shrink-0
    items-center
    justify-center
    rounded-full
    border border-[#d9d9d9]
    bg-[#f1f1f1]
  "
>
  <UserRound
    size={21}
    strokeWidth={1.7}
    className="text-[#777]"
  />
</div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-[#151515]">
                {user?.username || "Account"}
              </p>

              <p className="mt-0.5 text-[12px] text-[#77736d]">
                My Account
              </p>
            </div>

            <ChevronRight
              size={16}
              strokeWidth={1.7}
              className="text-[#99958e]"
            />
          </Link>

          {/* =========================
              ACCOUNT LINKS
          ========================== */}
          <div className="p-2">
            <Link
              to="/profile"
              onClick={closeMenu}
              className="
                group
                flex items-center gap-3
                rounded-[9px]
                px-3 py-3
                text-[#222]
                transition-colors
                hover:bg-[#f7f6f3]
              "
            >
              <UserRound
                size={18}
                strokeWidth={1.7}
                className="text-[#55514b]"
              />

              <span className="flex-1 text-[14px] font-medium">
                My Account
              </span>

              <ChevronRight
                size={15}
                strokeWidth={1.7}
                className="
                  text-[#aaa59d]
                  opacity-0
                  transition-opacity
                  group-hover:opacity-100
                "
              />
            </Link>

            <Link
              to="/profile/orders"
              onClick={closeMenu}
              className="
                group
                flex items-center gap-3
                rounded-[9px]
                px-3 py-3
                text-[#222]
                transition-colors
                hover:bg-[#f7f6f3]
              "
            >
              <ShoppingBag
                size={18}
                strokeWidth={1.7}
                className="text-[#55514b]"
              />

              <span className="flex-1 text-[14px] font-medium">
                My Orders
              </span>

              <ChevronRight
                size={15}
                strokeWidth={1.7}
                className="
                  text-[#aaa59d]
                  opacity-0
                  transition-opacity
                  group-hover:opacity-100
                "
              />
            </Link>

            <Link
              to="/wishlist"
              onClick={closeMenu}
              className="
                group
                flex items-center gap-3
                rounded-[9px]
                px-3 py-3
                text-[#222]
                transition-colors
                hover:bg-[#f7f6f3]
              "
            >
              <Heart
                size={18}
                strokeWidth={1.7}
                className="text-[#55514b]"
              />

              <span className="flex-1 text-[14px] font-medium">
                Wishlist
              </span>

              <ChevronRight
                size={15}
                strokeWidth={1.7}
                className="
                  text-[#aaa59d]
                  opacity-0
                  transition-opacity
                  group-hover:opacity-100
                "
              />
            </Link>
          </div>

          {/* =========================
              SELLER / ADMIN SECTION
          ========================== */}
          <div className="border-t border-[#eeeae4] p-2">
            {isAdmin || isSeller ? (
              <Link
                to={isAdmin ? "/admin" : "/seller"}
                onClick={closeMenu}
                className="
                  group
                  flex items-center gap-3
                  rounded-[9px]
                  px-3 py-3
                  text-[#222]
                  transition-colors
                  hover:bg-[#f7f6f3]
                "
              >
                {isAdmin ? (
                  <ShieldCheck
                    size={18}
                    strokeWidth={1.7}
                    className="text-[#55514b]"
                  />
                ) : (
                  <Store
                    size={18}
                    strokeWidth={1.7}
                    className="text-[#55514b]"
                  />
                )}

                <span className="flex-1 text-[14px] font-medium">
                  {isAdmin ? "Admin Panel" : "Seller Panel"}
                </span>

                <ChevronRight
                  size={15}
                  strokeWidth={1.7}
                  className="
                    text-[#aaa59d]
                    opacity-0
                    transition-opacity
                    group-hover:opacity-100
                  "
                />
              </Link>
            ) : (
              <Link
                to="/seller-application"
                onClick={closeMenu}
                className="
                  group
                  flex items-center gap-3
                  rounded-[9px]
                  px-3 py-3
                  text-[#222]
                  transition-colors
                  hover:bg-[#f7f6f3]
                "
              >
                <Store
                  size={18}
                  strokeWidth={1.7}
                  className="text-[#55514b]"
                />

                <span className="flex-1 text-[14px] font-medium">
                  Become a Seller
                </span>

                <ChevronRight
                  size={15}
                  strokeWidth={1.7}
                  className="
                    text-[#aaa59d]
                    opacity-0
                    transition-opacity
                    group-hover:opacity-100
                  "
                />
              </Link>
            )}
          </div>

          {/* =========================
              SIGN OUT
          ========================== */}
          <div className="border-t border-[#eeeae4] p-2">
            <button
              type="button"
              onClick={handleLogout}
              className="
                group
                flex w-full items-center gap-3
                rounded-[9px]
                px-3 py-3
                text-[#55514b]
                transition-colors
                hover:bg-[#f7f6f3]
                hover:text-[#151515]
              "
            >
              <LogOut
                size={18}
                strokeWidth={1.7}
              />

              <span className="flex-1 text-left text-[14px] font-medium">
                Sign out
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;