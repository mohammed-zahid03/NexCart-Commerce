import React, { useState, useEffect } from 'react'
import Products from './components/products/Products'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom'
import Home from './components/home/Home'
import Navbar from "./components/layout/Navbar";
import About from './components/About'
import Contact from './components/Contact'
import { Toaster } from 'react-hot-toast'
import Cart from './components/cart/Cart'
import LogIn from './components/auth/LogIn'
import PrivateRoute from './components/PrivateRoute'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import Checkout from './components/checkout/Checkout'
import PaymentConfirmation from './components/checkout/PaymentConfirmation'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './components/admin/dashboard/Dashboard'
import AdminProducts from './components/admin/products/AdminProducts'
import Sellers from './components/admin/sellers/Sellers'
import Category from './components/admin/categories/Category'
import Orders from './components/admin/orders/Orders'
import AdminReturns from './components/admin/returns/AdminReturns'
import ContactMessages from './components/admin/contact/ContactMessages'
import AuditLogs from './components/admin/audit/AuditLogs'
import ProductDetails from './components/products/ProductDetails'
import Wishlist from "./components/wishlist/Wishlist";
import TopBar from "./components/layout/TopBar";
import CategoryNav from "./components/layout/CategoryNav";
import UserOrders from "./components/profile/UserOrders";
import Profile from "./components/profile/Profile";
import SellerDashboard from './components/seller/SellerDashboard';
import PageNotFound from "./components/PageNotFound";
import SellerApplication from './components/seller/SellerApplication';
import SellerApplicationStatus from './components/seller/SellerApplicationStatus';
import SellerApplications from './components/admin/sellerApplications/SellerApplications';

import HomeSectionPage from "./components/home/HomeSectionPage";
import BestSellingProducts from "./components/home/BestSellingProducts";
import NewArrivals from "./components/home/NewArrivals";
import Deals from "./components/home/Deals";
import TrustedBrands from "./components/home/TrustedBrands";
import Customers from './components/admin/customers/Customers';
import Reviews from './components/admin/reviews/Reviews'
import logoDark from "./assets/branding/logo-dark.png";




function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  return null;
}

function AuthHeader() {
  return (
    <header className="h-20 bg-white border-b border-slate-200">
      <div className="h-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 flex items-center justify-between">
        
        {/* NexCart Logo */}
        <Link
          to="/"
          className="flex items-center flex-shrink-0"
        >
          <img
            src={logoDark}
            alt="NexCart"
            className="h-9 sm:h-10 lg:h-11 w-auto"
          />
        </Link>

        {/* Back to Store */}
       <Link
  to="/"
  aria-label="Return to store"
  title="Return to store"
  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    className="h-[17px] w-[17px]"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10.5 12 3l9 7.5"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.5 9.5V21h13V9.5M9.5 21v-6h5v6"
    />
  </svg>
</Link>

      </div>
    </header>
  );
}

function AppContent() {
  const location = useLocation();

  const authPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  const isAuthPage = authPages.includes(location.pathname);

const isDashboardArea =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/seller");

  return (
    <React.Fragment>

      <ScrollToTop />

    {isAuthPage ? (
    <AuthHeader />
) : !isDashboardArea ? (
    <>
        <TopBar />
        <Navbar />
        <CategoryNav />
    </>
) : null}

      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />

        <Route
          path="/best-sellers"
          element={
            <HomeSectionPage>
              <BestSellingProducts />
            </HomeSectionPage>
          }
        />

        <Route
          path="/new-arrivals"
          element={
            <HomeSectionPage>
              <NewArrivals />
            </HomeSectionPage>
          }
        />

        <Route
          path="/deals"
          element={
            <HomeSectionPage>
              <Deals />
            </HomeSectionPage>
          }
        />

        <Route
          path="/brands"
          element={
            <HomeSectionPage>
              <TrustedBrands page={true} />
            </HomeSectionPage>
          }
        />

        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/cart' element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />

        <Route path='/' element={<PrivateRoute />}>
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/order-confirm' element={<PaymentConfirmation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<UserOrders />} />
          <Route path="/seller-application" element={<SellerApplication />} />
          <Route path="/seller-application/status" element={<SellerApplicationStatus />} />
        </Route>

        <Route path='/' element={<PrivateRoute publicPage />}>
          <Route path='/login' element={<LogIn />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route
  path="/reset-password"
  element={<ResetPassword />}
/>
        </Route>

        <Route path='/' element={<PrivateRoute adminOnly />}>
          <Route path='/admin' element={<AdminLayout />}>

            <Route
              path='seller-applications'
              element={<SellerApplications />}
            />

            <Route path='' element={<Dashboard />} />
            <Route path='products' element={<AdminProducts />} />
            <Route path='sellers' element={<Sellers />} />
            <Route path='customers' element={<Customers />} />
            <Route path='reviews' element={<Reviews />} />
            <Route path='orders' element={<Orders />} />
            <Route path='returns' element={<AdminReturns />} />
            <Route path='categories' element={<Category />} />
            <Route path='contact-messages' element={<ContactMessages />} />
            <Route path='audit-logs' element={<AuditLogs />} />

          </Route>
        </Route>

        <Route path='/' element={<PrivateRoute sellerOnly />}>
          <Route path='/seller' element={<AdminLayout />}>

            <Route path='' element={<SellerDashboard />} />
            <Route path='products' element={<AdminProducts />} />
            <Route path='orders' element={<Orders />} />

          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />

      </Routes>

      <Toaster position='bottom-center' />

    </React.Fragment>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
