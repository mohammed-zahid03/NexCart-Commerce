import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { adminNavigation, sellerNavigation } from "../../utils";
import classNames from "classnames";
import { FiChevronRight } from "react-icons/fi";

const Sidebar = () => {
    const { pathname } = useLocation();
    const { user } = useSelector((state) => state.auth);

    const isAdmin = user?.roles?.includes("ROLE_ADMIN");
    const navigation = isAdmin ? adminNavigation : sellerNavigation;

    return (
        <aside className="flex h-full w-full flex-col bg-[#191a1c] text-white">
            
        

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <div className="space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={classNames(
                                    "group relative flex items-center gap-4 rounded-md px-4 py-3.5 text-[15px] font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-white/[0.08] text-white"
                                        : "text-white/55 hover:bg-white/[0.05] hover:text-white"
                                )}
                            >
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[#4f7cff]" />
                                )}

                                <item.icon
                                    className={classNames(
                                        "text-[20px]",
                                        isActive
                                            ? "text-white"
                                            : "text-white/55 group-hover:text-white"
                                    )}
                                />

                                <span>{item.name}</span>

                                {isActive && (
                                    <FiChevronRight className="ml-auto text-sm text-white/40" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Seller Account */}
                {!isAdmin && (
                    <div className="mt-9 border-t border-white/10 pt-7">
                        <p className="px-4 text-[11px] font-medium tracking-[1.5px] text-white/35">
                            SELLER ACCOUNT
                        </p>
                    </div>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;