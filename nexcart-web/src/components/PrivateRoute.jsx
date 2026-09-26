import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = ({
    publicPage = false,
    adminOnly = false,
    sellerOnly = false,
}) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    const isAdmin = user?.roles?.includes("ROLE_ADMIN");
    const isSeller = user?.roles?.includes("ROLE_SELLER");

    // Login / Register should only be accessible
    // when the user is NOT logged in.
    if (publicPage) {
        return user ? <Navigate to="/" replace /> : <Outlet />;
    }

    // Seller-only routes
    if (sellerOnly) {
        if (!user) {
            return (
                <Navigate
                    to="/login"
                    state={{ from: location }}
                    replace
                />
            );
        }

        if (!isSeller && !isAdmin) {
            return <Navigate to="/" replace />;
        }

        return <Outlet />;
    }

    // Admin routes
    if (adminOnly) {
        if (!user) {
            return (
                <Navigate
                    to="/login"
                    state={{ from: location }}
                    replace
                />
            );
        }

        // Sellers can access only the existing seller-allowed
        // admin pages.
        if (isSeller && !isAdmin) {
            const sellerAllowedPaths = [
                "/admin/orders",
                "/admin/products",
            ];

            const sellerAllowed = sellerAllowedPaths.some((path) =>
                location.pathname.startsWith(path)
            );

            if (!sellerAllowed) {
                return <Navigate to="/" replace />;
            }
        }

        if (!isAdmin && !isSeller) {
            return <Navigate to="/" replace />;
        }

        return <Outlet />;
    }

    // Normal authenticated routes
    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    return <Outlet />;
};

export default PrivateRoute;