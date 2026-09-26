import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

import {
    FiBox,
    FiShoppingCart,
    FiBarChart2,
    FiPercent,
    FiCreditCard,
    FiClock,
    FiTruck,
    FiArrowRight,
    FiPackage,
} from "react-icons/fi";

const SellerDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lowStockProducts, setLowStockProducts] = useState([]);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/seller/dashboard");

                setDashboard(response.data);

                const lowStockResponse = await api.get(
                    "/seller/products/low-stock"
                );

                setLowStockProducts(lowStockResponse.data);
            } catch (error) {
                console.error("Failed to load seller dashboard:", error);

                setError(
                    error?.response?.data?.message ||
                    "Unable to load seller dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const money = (value) =>
        `₹${Number(value || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    const primaryCards = [
        {
            title: "Total Products",
            value: dashboard?.totalProducts ?? 0,
            description: "Products currently listed",
            icon: FiBox,
            link: "/seller/products",
        },
        {
            title: "Total Orders",
            value: dashboard?.totalOrders ?? 0,
            description: "Orders received",
            icon: FiShoppingCart,
            link: "/seller/orders",
        },
        {
            title: "Total Sales",
            value: money(dashboard?.totalSales),
            description: "Total revenue from orders",
            icon: FiBarChart2,
        },
    ];

    const secondaryCards = [
        {
            title: "Platform Commission",
            value: money(dashboard?.totalCommission),
            description: "Total commission charges",
            icon: FiPercent,
        },
        {
            title: "Seller Earnings",
            value: money(dashboard?.sellerEarnings),
            description: "Your earnings after commission",
            icon: FiCreditCard,
        },
        {
            title: "Pending Orders",
            value: dashboard?.pendingOrders ?? 0,
            description: "Orders awaiting processing",
            icon: FiClock,
        },
    ];

   return (
    <div className="mx-auto max-w-[1180px]">

        {/* Header */}
        <div className="mb-6">

            <div className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#7c838d]">
                <span>Seller Panel</span>
                <span>›</span>
                <span>Dashboard</span>
            </div>

            <h1 className="font-serif text-[36px] leading-none tracking-[-1.4px] text-[#111827] sm:text-[42px]">
                Seller Dashboard
            </h1>

            <p className="mt-2 text-[14px] text-[#757d88]">
                Manage your products and customer orders.
            </p>

        </div>


        {/* Loading */}
        {loading && (
            <div className="rounded-xl border border-[#e3e3e0] bg-white p-8 text-center">
                <p className="text-sm text-[#737b8a]">
                    Loading dashboard...
                </p>
            </div>
        )}


        {/* Error */}
        {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm text-red-600">
                    {error}
                </p>
            </div>
        )}


        {/* Dashboard */}
        {!loading && !error && dashboard && (
            <>

                {/* Top 3 */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                    {/* Products */}
                    <Link
                        to="/seller/products"
                        className="group rounded-xl border border-[#e2e2df] bg-white p-5 transition hover:border-[#cdceca] hover:shadow-[0_8px_24px_rgba(20,20,20,0.05)]"
                    >
                        <div className="flex items-start justify-between">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f4f4f1]">
                                <FiBox className="text-[18px] text-[#20242a]" />
                            </div>

                            <FiArrowRight className="text-[17px] text-[#383c42] transition-transform group-hover:translate-x-1" />

                        </div>

                        <p className="mt-4 text-[13px] font-medium text-[#343940]">
                            Total Products
                        </p>

                        <p className="mt-0.5 text-[28px] font-semibold leading-none tracking-[-1px] text-[#111827]">
                            {dashboard.totalProducts}
                        </p>

                        <p className="mt-1 text-[11px] text-[#8a9099]">
                            Products currently listed
                        </p>
                    </Link>


                    {/* Orders */}
                    <Link
                        to="/seller/orders"
                        className="group rounded-xl border border-[#e2e2df] bg-white p-5 transition hover:border-[#cdceca] hover:shadow-[0_8px_24px_rgba(20,20,20,0.05)]"
                    >
                        <div className="flex items-start justify-between">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f4f4f1]">
                                <FiShoppingCart className="text-[18px] text-[#20242a]" />
                            </div>

                            <FiArrowRight className="text-[17px] text-[#383c42] transition-transform group-hover:translate-x-1" />

                        </div>

                        <p className="mt-4 text-[13px] font-medium text-[#343940]">
                            Total Orders
                        </p>

                        <p className="mt-0.5 text-[28px] font-semibold leading-none tracking-[-1px] text-[#111827]">
                            {dashboard.totalOrders}
                        </p>

                        <p className="mt-1 text-[11px] text-[#8a9099]">
                            Orders received
                        </p>
                    </Link>


                    {/* Sales */}
                    <div className="rounded-xl border border-[#e2e2df] bg-white p-5">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f4f4f1]">
                            <FiBarChart2 className="text-[18px] text-[#20242a]" />
                        </div>

                        <p className="mt-4 text-[13px] font-medium text-[#343940]">
                            Total Sales
                        </p>

                        <p className="mt-0.5 text-[28px] font-semibold leading-none tracking-[-1px] text-[#111827]">
                            {money(dashboard.totalSales)}
                        </p>

                        <p className="mt-1 text-[11px] text-[#8a9099]">
                            Total revenue from orders
                        </p>

                    </div>

                </div>


                {/* Financial / Order Summary */}
                <div className="mt-3 rounded-xl border border-[#e2e2df] bg-white px-2">

                    <div className="grid grid-cols-1 divide-y divide-[#e8e8e5] md:grid-cols-3 md:divide-x md:divide-y-0">

                        <div className="flex items-center gap-4 px-4 py-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f4f1]">
                                <FiPercent className="text-[16px] text-[#20242a]" />
                            </div>

                            <div>
                                <p className="text-[12px] font-medium text-[#343940]">
                                    Platform Commission
                                </p>

                                <p className="mt-0.5 text-[21px] font-semibold text-[#111827]">
                                    {money(dashboard.totalCommission)}
                                </p>

                                <p className="text-[10px] text-[#8a9099]">
                                    Total commission charges
                                </p>
                            </div>
                        </div>


                        <div className="flex items-center gap-4 px-4 py-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f4f1]">
                                <FiCreditCard className="text-[16px] text-[#20242a]" />
                            </div>

                            <div>
                                <p className="text-[12px] font-medium text-[#343940]">
                                    Seller Earnings
                                </p>

                                <p className="mt-0.5 text-[21px] font-semibold text-[#111827]">
                                    {money(dashboard.sellerEarnings)}
                                </p>

                                <p className="text-[10px] text-[#8a9099]">
                                    Your earnings after commission
                                </p>
                            </div>
                        </div>


                        <div className="flex items-center gap-4 px-4 py-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f4f1]">
                                <FiClock className="text-[16px] text-[#20242a]" />
                            </div>

                            <div>
                                <p className="text-[12px] font-medium text-[#343940]">
                                    Pending Orders
                                </p>

                                <p className="mt-0.5 text-[21px] font-semibold text-[#111827]">
                                    {dashboard.pendingOrders}
                                </p>

                                <p className="text-[10px] text-[#8a9099]">
                                    Orders awaiting processing
                                </p>
                            </div>
                        </div>

                    </div>
                </div>


                {/* Delivered + Low Stock */}
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">

                    <div className="flex items-center justify-between rounded-xl border border-[#e2e2df] bg-white px-5 py-4">

                        <div className="flex items-center gap-4">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f4f4f1]">
                                <FiTruck className="text-[18px] text-[#20242a]" />
                            </div>

                            <div>
                                <p className="text-[13px] font-medium text-[#343940]">
                                    Delivered Orders
                                </p>

                                <p className="text-[25px] font-semibold leading-none text-[#111827]">
                                    {dashboard.deliveredOrders ?? 0}
                                </p>

                                <p className="mt-1 text-[11px] text-[#8a9099]">
                                    Successfully delivered orders
                                </p>
                            </div>

                        </div>

                        <FiArrowRight className="text-[17px] text-[#30343a]" />

                    </div>


                    <div className="flex items-center justify-between rounded-xl border border-[#e2e2df] bg-white px-5 py-4">

                        <div className="flex items-center gap-4">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f4f4f1]">
                                <FiPackage className="text-[18px] text-[#20242a]" />
                            </div>

                            <div>
                                <p className="text-[13px] font-medium text-[#343940]">
                                    Low Stock Products
                                </p>

                                <p className="text-[25px] font-semibold leading-none text-[#111827]">
                                    {dashboard.lowStockProducts ?? 0}
                                </p>

                                <p className="mt-1 text-[11px] text-[#8a9099]">
                                    Products running low in stock
                                </p>
                            </div>

                        </div>

                        <Link to="/seller/products">
                            <FiArrowRight className="text-[17px] text-[#30343a]" />
                        </Link>

                    </div>

                </div>


                {/* Quick Actions */}
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">

                    <Link
                        to="/seller/products"
                        className="group flex items-center justify-between rounded-xl border border-[#e2e2df] bg-white px-5 py-4 transition hover:border-[#cdceca] hover:shadow-[0_8px_24px_rgba(20,20,20,0.05)]"
                    >
                        <div className="flex items-center gap-4">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f4f4f1]">
                                <FiBox className="text-[18px] text-[#20242a]" />
                            </div>

                            <div>
                                <h2 className="font-serif text-[20px] text-[#111827]">
                                    My Products
                                </h2>

                                <p className="mt-0.5 text-[11px] text-[#8a9099]">
                                    Add, update and manage your products.
                                </p>
                            </div>

                        </div>

                        <FiArrowRight className="text-[17px] transition-transform group-hover:translate-x-1" />

                    </Link>


                    <Link
                        to="/seller/orders"
                        className="group flex items-center justify-between rounded-xl border border-[#e2e2df] bg-white px-5 py-4 transition hover:border-[#cdceca] hover:shadow-[0_8px_24px_rgba(20,20,20,0.05)]"
                    >
                        <div className="flex items-center gap-4">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f4f4f1]">
                                <FiShoppingCart className="text-[18px] text-[#20242a]" />
                            </div>

                            <div>
                                <h2 className="font-serif text-[20px] text-[#111827]">
                                    My Orders
                                </h2>

                                <p className="mt-0.5 text-[11px] text-[#8a9099]">
                                    View and manage orders for your products.
                                </p>
                            </div>

                        </div>

                        <FiArrowRight className="text-[17px] transition-transform group-hover:translate-x-1" />

                    </Link>

                </div>


                {/* Low Stock Details */}
                {lowStockProducts.length > 0 && (
                    <div className="mt-4 rounded-xl border border-[#e2e2df] bg-white">

                        <div className="border-b border-[#e8e8e5] px-5 py-4">

                            <h2 className="font-serif text-[20px] text-[#111827]">
                                Low Stock Products
                            </h2>

                            <p className="mt-0.5 text-[11px] text-[#8a9099]">
                                Products that may need restocking.
                            </p>

                        </div>

                        <div>
                            {lowStockProducts.map((product) => (
                                <div
                                    key={product.productId}
                                    className="flex items-center justify-between border-b border-[#eeeeeb] px-5 py-3.5 last:border-b-0"
                                >
                                    <div>
                                        <p className="text-[13px] font-medium text-[#20242b]">
                                            {product.productName}
                                        </p>

                                        <p className="mt-0.5 text-[11px] text-[#8a9099]">
                                            Stock: {product.quantity}
                                        </p>
                                    </div>

                                    <Link
                                        to="/seller/products"
                                        className="flex items-center gap-1.5 text-[11px] font-medium text-[#30343a] hover:text-[#4f7cff]"
                                    >
                                        Manage
                                        <FiArrowRight />
                                    </Link>
                                </div>
                            ))}
                        </div>

                    </div>
                )}

            </>
        )}
    </div>
);
};

export default SellerDashboard;