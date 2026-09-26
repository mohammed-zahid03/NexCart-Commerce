import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardOverview from "./DashboardOverview";

import {
    FaBoxOpen,
    FaDollarSign,
    FaShoppingCart,
    FaCalendarDay,
    FaCalendarAlt,
    FaUndo,
    FaChartLine,
    FaUsers,
    FaUserTie,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { analyticsAction } from "../../../store/actions";
import Loader from "../../shared/Loader";
import ErrorPage from "../../shared/ErrorPage";

import SalesOverTimeChart from "./SalesOverTimeChart";
import OrdersByStatusChart from "./OrdersByStatusChart";
import TopProductsChart from "./TopProductsChart";
import TopSellersChart from "./TopSellersChart";
import ReturnsByStatusChart from "./ReturnsByStatusChart";

const Dashboard = () => {
    const dispatch = useDispatch();

    const { isLoading, errorMessage } = useSelector(
        (state) => state.errors
    );

    const {
        analytics: {
            productCount,
            totalRevenue,
            totalOrders,
            ordersToday,
            ordersThisMonth,
            totalRefunds,
            averageOrderValue,
            customerCount,
            sellerCount,
            salesOverTime,
            ordersByStatus,
            topProducts,
            topSellers,
            returnsByStatus,
        },
    } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(analyticsAction());
    }, [dispatch]);

    if (isLoading) {
        return <Loader />;
    }

    if (errorMessage) {
        return <ErrorPage message={errorMessage} />;
    }

   return (
    <div className="mx-auto max-w-[1380px]">

        {/* PAGE HEADER */}
        <section className="mb-7">

            <div className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#858b94]">
                <span>Admin Panel</span>
                <span className="text-[#b7babf]">›</span>
                <span>Dashboard</span>
            </div>

            <h1 className="font-serif text-[36px] leading-none tracking-[-1.4px] text-[#151515] sm:text-[42px]">
                Admin Dashboard
            </h1>

            <p className="mt-3 text-[14px] text-[#737b86]">
                Overview of your NexCart marketplace.
            </p>

        </section>


        {/* PRIMARY METRICS */}
        <section>

            <div className="mb-3">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8a9099]">
                    Marketplace overview
                </p>
            </div>

           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

    <Link
        to="/admin/orders"
        className="block rounded-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#263442]/30"
    >
        <DashboardOverview
            title="Total Revenue"
            amount={totalRevenue}
            Icon={FaDollarSign}
            revenue
            featured
            description="Revenue across all orders"
        />
    </Link>

    <Link
        to="/admin/orders"
        className="block rounded-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#263442]/30"
    >
        <DashboardOverview
            title="Total Orders"
            amount={totalOrders}
            Icon={FaShoppingCart}
            featured
            description="Orders placed"
        />
    </Link>

    <Link
        to="/admin/products"
        className="block rounded-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#263442]/30"
    >
        <DashboardOverview
            title="Total Products"
            amount={productCount}
            Icon={FaBoxOpen}
            featured
            description="Products listed"
        />
    </Link>

    <Link
        to="/admin/customers"
        className="block rounded-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#263442]/30"
    >
        <DashboardOverview
            title="Customers"
            amount={customerCount}
            Icon={FaUsers}
            featured
            description="Registered customers"
        />
    </Link>

</div>

        </section>


        {/* SECONDARY METRICS */}
        <section className="mt-3">

            <div className="rounded-2xl border border-[#e3e1dc] bg-white">

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5">

    <Link
        to="/admin/orders"
        className="block rounded-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#263442]/30"
    >
        <DashboardOverview
            title="Orders Today"
            amount={ordersToday}
            Icon={FaCalendarDay}
            description="Today's orders"
        />
    </Link>

    <Link
        to="/admin/orders"
        className="block rounded-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#263442]/30"
    >
        <DashboardOverview
            title="This Month"
            amount={ordersThisMonth}
            Icon={FaCalendarAlt}
            description="Orders this month"
        />
    </Link>

    <Link
        to="/admin/returns"
        className="block rounded-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#263442]/30"
    >
        <DashboardOverview
            title="Total Refunds"
            amount={totalRefunds}
            Icon={FaUndo}
            revenue
            description="Refunded amount"
        />
    </Link>

    <Link
        to="/admin/orders"
        className="block rounded-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#263442]/30"
    >
        <DashboardOverview
            title="Average Order"
            amount={averageOrderValue}
            Icon={FaChartLine}
            revenue
            description="Average order value"
        />
    </Link>

    <Link
        to="/admin/sellers"
        className="block rounded-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#263442]/30"
    >
        <DashboardOverview
            title="Sellers"
            amount={sellerCount}
            Icon={FaUserTie}
            description="Registered sellers"
        />
    </Link>

</div>

            </div>

        </section>


        {/* ANALYTICS */}
        <section className="mt-8">

            <div className="mb-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#858b94]">
                    Performance
                </p>

                <h2 className="mt-1 font-serif text-[26px] tracking-[-0.6px] text-[#151515]">
                    Sales overview
                </h2>
            </div>

            {/* NO EXTRA CARD HERE */}
            <SalesOverTimeChart data={salesOverTime} />

        </section>


        {/* ORDERS + RETURNS */}
        <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">

            <div>

                <div className="mb-3 px-1">
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#858b94]">
                        Orders
                    </p>

                    <h2 className="mt-1 font-serif text-[24px] tracking-[-0.5px] text-[#151515]">
                        Order activity
                    </h2>
                </div>

                <OrdersByStatusChart data={ordersByStatus} />

            </div>


            <div>

                <div className="mb-3 px-1">
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#858b94]">
                        Returns
                    </p>

                    <h2 className="mt-1 font-serif text-[24px] tracking-[-0.5px] text-[#151515]">
                        Return activity
                    </h2>
                </div>

                <ReturnsByStatusChart data={returnsByStatus} />

            </div>

        </section>


        {/* PRODUCTS + SELLERS */}
        <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">

            <div>

                <div className="mb-3 px-1">
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#858b94]">
                        Products
                    </p>

                    <h2 className="mt-1 font-serif text-[24px] tracking-[-0.5px] text-[#151515]">
                        Best-performing products
                    </h2>

                </div>

                <TopProductsChart data={topProducts} />

            </div>


            <div>

                <div className="mb-3 px-1">
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#858b94]">
                        Marketplace
                    </p>

                    <h2 className="mt-1 font-serif text-[24px] tracking-[-0.5px] text-[#151515]">
                        Seller performance
                    </h2>

                </div>

                <TopSellersChart data={topSellers} />

            </div>

        </section>

    </div>
);
};

export default Dashboard;