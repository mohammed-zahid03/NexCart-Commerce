import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import { Outlet } from "react-router-dom";

import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    TransitionChild,
} from "@headlessui/react";

import {
    FiMenu,
    FiX,
    FiChevronRight,
    FiChevronDown,
} from "react-icons/fi";

import { sellerNavigation } from "../../utils";
import { logOutUser } from "../../store/actions";


const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);

    const accountMenuRef = useRef(null);

    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const isAdmin = user?.roles?.includes("ROLE_ADMIN");
    const isSeller = user?.roles?.includes("ROLE_SELLER");

    useEffect(() => {
    const handleClickOutside = (event) => {
        if (
            accountMenuRef.current &&
            !accountMenuRef.current.contains(event.target)
        ) {
            setAccountMenuOpen(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, []);

useEffect(() => {
    const handleEscape = (event) => {
        if (event.key === "Escape") {
            setAccountMenuOpen(false);
        }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
        document.removeEventListener("keydown", handleEscape);
    };
}, []);

const handleAdminLogout = () => {
    setAccountMenuOpen(false);
    dispatch(logOutUser(navigate));
};

    /*
     * SELLER LAYOUT
     * -----------------------------------------
     * No customer navbar.
     * No vertical sidebar.
     * No search/cart/profile row.
     * One compact horizontal seller bar.
     */
    if (isSeller && !isAdmin) {
        return (
           <div className="min-h-screen bg-[#F7F6F2] text-[#171717]">

                {/* Compact Seller Header */}
                <header className="h-[62px] border-b border-[#E5E2DC] bg-white">
                    <div className="mx-auto flex h-full max-w-[1240px] items-center justify-between px-5 sm:px-8">

                        {/* Brand */}
                        <Link
                            to="/seller"
                            className="flex items-center gap-2"
                        >
                            <span className="font-serif text-[22px] tracking-[-0.7px] text-[#151515]">
                                NexCart
                            </span>

                            <span className="h-4 w-px bg-[#d9d9d6]" />

                            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#7b8088]">
                                Seller
                            </span>
                        </Link>


                        {/* Seller Navigation */}
                        <nav className="hidden items-center gap-8 md:flex">
                            {sellerNavigation.map((item) => {
                                const active =
                                    pathname === item.href;

                                return (
                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        className={`relative py-2 text-[13px] font-medium transition ${
                                            active
                                                ? "text-[#111827]"
                                                : "text-[#6f7580] hover:text-[#111827]"
                                        }`}
                                    >
                                        {item.name}

                                        {active && (
                                            <span className="absolute -bottom-[19px] left-0 right-0 h-[2px] bg-[#111827]" />
                                        )}
                                    </NavLink>
                                );
                            })}

                            <NavLink
                                to="/profile"
                                className={`py-2 text-[13px] font-medium transition ${
                                    pathname === "/profile"
                                        ? "text-[#111827]"
                                        : "text-[#6f7580] hover:text-[#111827]"
                                }`}
                            >
                                My Account
                            </NavLink>
                        </nav>


                        {/* Store Link */}
                        <Link
                            to="/"
                            className="hidden items-center gap-1.5 text-[12px] font-medium text-[#70757e] transition hover:text-[#111827] sm:flex"
                        >
                            Store
                            <FiChevronRight className="text-[14px]" />
                        </Link>


                        {/* Mobile Menu */}
                        <div className="md:hidden">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-md p-2 text-[#222]"
                                aria-label="Open seller navigation"
                            >
                                <FiMenu className="text-[20px]" />
                            </button>
                        </div>

                    </div>
                </header>


                {/* Mobile Seller Navigation */}
                <Dialog
                    open={sidebarOpen}
                    onClose={setSidebarOpen}
                    className="relative z-50 md:hidden"
                >
                    <DialogBackdrop className="fixed inset-0 bg-black/50" />

                    <div className="fixed inset-0 flex justify-end">
                        <DialogPanel className="relative w-full max-w-[290px] bg-white shadow-xl">

                            <TransitionChild>
                                <button
                                    type="button"
                                    onClick={() => setSidebarOpen(false)}
                                    className="absolute -left-11 top-4 p-2 text-white"
                                >
                                    <FiX className="text-xl" />
                                </button>
                            </TransitionChild>

                            <div className="border-b border-[#E5E2DC] px-6 py-5">
                                <p className="font-serif text-[22px]">
                                    NexCart
                                </p>

                                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#858a92]">
                                    Seller
                                </p>
                            </div>

                            <nav className="p-4">
                                <div className="space-y-1">
                                    {sellerNavigation.map((item) => (
                                        <NavLink
                                            key={item.name}
                                            to={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={({ isActive }) =>
                                                `flex items-center rounded-lg px-4 py-3 text-sm font-medium ${
                                                    isActive
                                                        ? "bg-[#f1f1ef] text-[#111827]"
                                                        : "text-[#666d77] hover:bg-[#F7F6F2]"
                                                }`
                                            }
                                        >
                                            {item.name}
                                        </NavLink>
                                    ))}

                                    <NavLink
                                        to="/profile"
                                        onClick={() => setSidebarOpen(false)}
                                        className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-[#666d77] hover:bg-[#F7F6F2]"
                                    >
                                        My Account
                                    </NavLink>
                                </div>
                            </nav>

                        </DialogPanel>
                    </div>
                </Dialog>


                {/* Seller Content */}
                <main>
                    <div className="mx-auto max-w-[1240px] px-5 py-6 sm:px-8 lg:py-7">
                        <Outlet />
                    </div>
                </main>

            </div>
        );
    }


    /*
     * ADMIN LAYOUT
     * -----------------------------------------
     * Keep the sidebar behavior for admins.
     */
   return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#111827]">

        {/* Mobile Sidebar */}
        <Dialog
            open={sidebarOpen}
            onClose={setSidebarOpen}
            className="relative z-50 xl:hidden"
        >
            <DialogBackdrop className="fixed inset-0 bg-black/55" />

            <div className="fixed inset-0 flex">
                <DialogPanel className="relative mr-16 flex w-full max-w-[270px] flex-1">

                    <TransitionChild>
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            className="absolute -right-12 top-5 rounded-full p-2 text-white"
                        >
                            <FiX className="text-xl" />
                        </button>
                    </TransitionChild>

                    <Sidebar />
                </DialogPanel>
            </div>
        </Dialog>


        {/* Desktop Sidebar */}
        <aside className="hidden xl:fixed xl:inset-y-0 xl:z-40 xl:flex xl:w-[250px] xl:flex-col">
            <Sidebar />
        </aside>


        <div className="xl:pl-[250px]">

            {/* ADMIN HEADER */}
            <header className="sticky top-0 z-30 h-[68px] border-b border-[#E5E2DC] bg-white/95 backdrop-blur">

                <div className="flex h-full items-center px-5 sm:px-7">

                    {/* Mobile menu */}
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="mr-4 rounded-lg p-2 text-[#20242a] hover:bg-[#f3f3f0] xl:hidden"
                    >
                        <FiMenu className="text-[20px]" />
                    </button>


                    {/* Admin title */}
                   <div className="flex items-center gap-3">
    <Link
        to="/"
        className="
            font-serif
            text-[22px]
            tracking-[-0.5px]
            text-[#151515]
            transition-opacity
            hover:opacity-70
        "
        aria-label="Go to NexCart homepage"
    >
        NexCart
    </Link>

    <span className="h-4 w-px bg-[#dad9d5]" />

    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#7c828b]">
        Admin
    </span>
</div>


                    {/* Right side */}
                    <div className="ml-auto flex items-center gap-5">

                        <span className="hidden text-[12px] text-[#8a9099] sm:block">
                           
                        </span>

                        <div className="h-5 w-px bg-[#e2e1de]" />

                       
                       <div ref={accountMenuRef} className="relative">

    <button
        type="button"
        onClick={() =>
            setAccountMenuOpen((prev) => !prev)
        }
        aria-expanded={accountMenuOpen}
        aria-haspopup="menu"
        className="
            flex items-center gap-3
            border-l border-[#e5e2dc]
            pl-5
            text-left
            transition
            hover:opacity-80
            focus:outline-none
        "
    >
        <div
            className="
                flex h-9 w-9
                items-center justify-center
                rounded-full
                border border-[#e5e2dc]
                bg-[#f3f2ee]
                text-[12px]
                font-medium
                text-[#55514b]
            "
        >
            A
        </div>

        <div className="hidden sm:block">
            <p className="text-[13px] font-medium text-[#242424]">
                Admin
            </p>

            <p className="mt-0.5 text-[10px] text-[#8a8a85]">
                Administrator
            </p>
        </div>

        <FiChevronDown
            className={`
                hidden
                text-[14px]
                text-[#77736d]
                transition-transform
                duration-200
                sm:block
                ${accountMenuOpen ? "rotate-180" : ""}
            `}
        />
    </button>

    {accountMenuOpen && (
        <div
            role="menu"
            className="
                absolute
                right-0
                top-[calc(100%+10px)]
                z-50
                w-[230px]
                overflow-hidden
                rounded-[12px]
                border border-[#e5e2dc]
                bg-white
                shadow-[0_14px_35px_rgba(20,20,20,0.10)]
            "
        >

            {/* Account identity */}
            <div className="border-b border-[#eeeae4] px-4 py-3.5">
                <p className="text-[13px] font-medium text-[#242424]">
                    Admin
                </p>

                <p className="mt-0.5 text-[11px] text-[#85827c]">
                    Administrator
                </p>
            </div>

            {/* Menu items */}
            <div className="p-1.5">

                <Link
                    to="/profile"
                    onClick={() => setAccountMenuOpen(false)}
                    className="
                        block
                        rounded-[8px]
                        px-3 py-2.5
                        text-[13px]
                        text-[#45413c]
                        transition-colors
                        hover:bg-[#f7f6f2]
                    "
                >
                    Account
                </Link>

                <Link
                    to="/"
                    onClick={() => setAccountMenuOpen(false)}
                    className="
                        block
                        rounded-[8px]
                        px-3 py-2.5
                        text-[13px]
                        text-[#45413c]
                        transition-colors
                        hover:bg-[#f7f6f2]
                    "
                >
                    View Store
                </Link>

                <div className="my-1.5 border-t border-[#eeeae4]" />

                <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="
                        block
                        w-full
                        rounded-[8px]
                        px-3 py-2.5
                        text-left
                        text-[13px]
                        text-[#8b403a]
                        transition-colors
                        hover:bg-[#faf3f1]
                    "
                >
                    Sign out
                </button>

            </div>
        </div>
    )}

</div>






                    </div>

                </div>
            </header>


            {/* ADMIN WORKSPACE */}
            <main>
                <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-7 lg:px-9 lg:py-8">
                    <Outlet />
                </div>
            </main>

        </div>
    </div>
);
};

export default AdminLayout;