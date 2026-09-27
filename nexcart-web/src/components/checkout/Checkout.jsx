import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    LockKeyhole,
    ShieldCheck,
    RotateCcw,
} from "lucide-react";

import AddressInfo from "./AddressInfo";
import PaymentMethod from "./PaymentMethod";
import OrderSummary from "./OrderSummary";
import StripePayment from "./StripePayment";
import ErrorPage from "../shared/ErrorPage";

import { getUserAddresses } from "../../store/actions";

const Checkout = () => {
    const [activeStep, setActiveStep] = useState(0);

    const dispatch = useDispatch();

    const { errorMessage } = useSelector((state) => state.errors);

    const { cart, totalPrice } = useSelector(
        (state) => state.carts
    );

    const {
        address,
        selectedUserCheckoutAddress,
    } = useSelector((state) => state.auth);

    const { paymentMethod } = useSelector(
        (state) => state.payment
    );

    useEffect(() => {
        dispatch(getUserAddresses());
    }, [dispatch]);

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (
            activeStep === 0 &&
            !selectedUserCheckoutAddress
        ) {
            toast.error(
                "Please select a delivery address before continuing."
            );
            return;
        }

        if (
            activeStep === 1 &&
            !paymentMethod
        ) {
            toast.error(
                "Please select a payment method before continuing."
            );
            return;
        }

        setActiveStep((prev) => prev + 1);
    };

    const steps = [
        "Address",
        "Payment",
        "Review",
        "Confirmation",
    ];

    const isDisabled =
        Boolean(errorMessage) ||
        (activeStep === 0 && !selectedUserCheckoutAddress) ||
        (activeStep === 1 && !paymentMethod);

    return (
        <div className="min-h-[calc(100vh-100px)] bg-[#f8f7f3] pb-24 text-[#151515]">

            {/* =====================================================
                CHECKOUT HEADER
            ===================================================== */}
            <section className="border-b border-[#e6e2db] bg-[#faf9f6]">

                <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 lg:px-10">

                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#858078]">
                        NexCart
                    </p>

                    <h1 className="mt-2 font-serif text-4xl tracking-[-0.035em] sm:text-5xl">
                        Checkout
                    </h1>

                    <p className="mt-2 text-sm text-[#77736c]">
                        Complete your order securely in just a few steps.
                    </p>

                    {/* =================================================
                        STEPPER
                    ================================================= */}
                    <div className="mt-9 hidden md:flex items-start">

                        {steps.map((step, index) => {

                            const active = activeStep === index;
                            const completed = activeStep > index;
                            const last = index === steps.length - 1;

                            return (
                                <React.Fragment key={step}>

                                    <div className="flex min-w-[90px] flex-col items-center">

                                        <div
                                            className={`
                                                flex h-10 w-10 items-center
                                                justify-center rounded-full
                                                border text-xs font-semibold
                                                transition-all
                                                ${
                                                    active || completed
                                                        ? "border-[#151515] bg-[#151515] text-white"
                                                        : "border-[#d5d1ca] bg-[#faf9f6] text-[#77736c]"
                                                }
                                            `}
                                        >
                                            {completed ? (
                                                <Check size={15} strokeWidth={2.4} />
                                            ) : (
                                                index + 1
                                            )}
                                        </div>

                                        <span
                                            className={`
                                                mt-2 text-xs
                                                ${
                                                    active
                                                        ? "font-semibold text-[#151515]"
                                                        : "text-[#77736c]"
                                                }
                                            `}
                                        >
                                            {step}
                                        </span>

                                    </div>

                                    {!last && (
                                        <div
                                            className={`
                                                mt-5 h-px flex-1
                                                ${
                                                    completed
                                                        ? "bg-[#151515]"
                                                        : "bg-[#d8d4cd]"
                                                }
                                            `}
                                        />
                                    )}

                                </React.Fragment>
                            );
                        })}

                    </div>

                    {/* Mobile step */}
                    <div className="mt-7 flex items-center justify-between md:hidden">

                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#858078]">
                                Step {activeStep + 1} of {steps.length}
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                                {steps[activeStep]}
                            </p>
                        </div>

                        <div className="h-2 w-28 overflow-hidden rounded-full bg-[#dedbd4]">
                            <div
                                className="h-full rounded-full bg-[#151515] transition-all"
                                style={{
                                    width: `${((activeStep + 1) / steps.length) * 100}%`,
                                }}
                            />
                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                MAIN
            ===================================================== */}
            <main className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

                {/* =================================================
                    STEP 1 — ADDRESS
                ================================================= */}
                {activeStep === 0 && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">

                        <AddressInfo address={address} />

                        <CheckoutSummary
                            cart={cart}
                            totalPrice={totalPrice}
                        />

                    </div>
                )}


                {/* =================================================
                    STEP 2 — PAYMENT
                ================================================= */}
                {activeStep === 1 && (
                    <div className="mx-auto max-w-3xl">

                        <div className="mb-6">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#858078]">
                                Step 02
                            </p>

                            <h2 className="mt-2 font-serif text-3xl tracking-[-0.025em]">
                                Payment method
                            </h2>

                            <p className="mt-2 text-sm text-[#77736c]">
                                Choose how you'd like to pay for your order.
                            </p>
                        </div>

                        <PaymentMethod />

                    </div>
                )}


                {/* =================================================
                    STEP 3 — REVIEW
                ================================================= */}
                {activeStep === 2 && (
                    <OrderSummary
                        totalPrice={totalPrice}
                        cart={cart}
                        address={selectedUserCheckoutAddress}
                        paymentMethod={paymentMethod}
                    />
                )}


                {/* =================================================
                    STEP 4 — PAYMENT
                ================================================= */}
{activeStep === 3 && (
    <StripePayment />
)}

            </main>


            {/* =====================================================
                BOTTOM CHECKOUT BAR
            ===================================================== */}
            <div className="fixed bottom-0 left-0 z-40 w-full border-t border-[#ddd9d2] bg-[#faf9f6]/95 backdrop-blur-md">

                <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 sm:px-8 lg:px-10">

                    <button
                        type="button"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={`
                            inline-flex items-center gap-2 text-sm
                            font-medium transition
                            ${
                                activeStep === 0
                                    ? "cursor-not-allowed text-[#b7b3ad]"
                                    : "text-[#4e4a45] hover:text-[#151515]"
                            }
                        `}
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>


                    <span className="hidden text-xs text-[#77736c] sm:block">
                        Step {activeStep + 1} of {steps.length}
                    </span>


                    {activeStep < steps.length - 1 && (
                        <button
                            type="button"
                            disabled={isDisabled}
                            onClick={handleNext}
                            className={`
                                inline-flex items-center gap-3
                                rounded-full px-6 py-3
                                text-sm font-semibold
                                transition-all
                                ${
                                    isDisabled
                                        ? "cursor-not-allowed bg-[#d7d3cc] text-[#89857e]"
                                        : "bg-[#151515] text-white hover:bg-[#292929] hover:shadow-lg"
                                }
                            `}
                        >
                            {activeStep === 0
                                ? "Continue to payment"
                                : activeStep === 1
                                ? "Review order"
                                : "Continue to payment"}

                            <ArrowRight size={16} />
                        </button>
                    )}

                </div>

            </div>


            {errorMessage && (
                <ErrorPage message={errorMessage} />
            )}

        </div>
    );
};


/* =============================================================
   RIGHT-SIDE ORDER SUMMARY
============================================================= */

const CheckoutSummary = ({ cart = [], totalPrice = 0 }) => {

    const formatPrice = (value) =>
        `₹${Number(value || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 0,
        })}`;

    const itemCount = cart.reduce(
        (sum, item) => sum + Number(item?.quantity || 0),
        0
    );

    return (
        <aside className="h-fit rounded-2xl border border-[#e3dfd8] bg-[#fffefa] p-7 lg:sticky lg:top-6">

            <div className="flex items-center justify-between border-b border-[#e5e1da] pb-5">

                <h2 className="font-serif text-2xl tracking-[-0.02em]">
                    Order summary
                </h2>

                <span className="text-xs text-[#77736c]">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>

            </div>


            {/* Products */}
            <div className="space-y-5 py-5">

                {cart.map((item) => (

                    <div
                        key={item?.productId}
                        className="flex gap-4"
                    >

                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f1efea]">

                            <img
                                src={`${import.meta.env.VITE_BACK_END_URL}/images/${item?.image}`}
                                alt={item?.productName || "Product"}
                                className="h-full w-full object-contain p-2"
                            />

                        </div>


                        <div className="min-w-0 flex-1">

                            <p className="text-sm font-semibold leading-5 text-[#202020]">
                                {item?.productName}
                            </p>

                            <p className="mt-1 text-xs text-[#858078]">
                                {item?.description
                                    ? item.description
                                        .split(" ")
                                        .slice(0, 2)
                                        .join(" ")
                                    : "Premium product"}
                            </p>

                            <div className="mt-3 flex items-center justify-between">

                                <span className="text-xs text-[#77736c]">
                                    Qty: {item?.quantity}
                                </span>

                                <span className="text-sm font-semibold">
                                    {formatPrice(
                                        Number(item?.specialPrice || item?.price || 0) *
                                        Number(item?.quantity || 0)
                                    )}
                                </span>

                            </div>

                        </div>

                    </div>

                ))}

            </div>


            {/* Pricing */}
            <div className="border-t border-[#e5e1da] pt-5">

                <div className="flex justify-between py-2 text-sm text-[#77736c]">
                    <span>Subtotal</span>
                    <span className="text-[#151515]">
                        {formatPrice(totalPrice)}
                    </span>
                </div>

                <div className="flex justify-between py-2 text-sm text-[#77736c]">
                    <span>Shipping</span>
                    <span className="font-medium text-emerald-700">
                        FREE
                    </span>
                </div>

                <div className="flex justify-between py-2 text-sm text-[#77736c]">
                    <span>Estimated taxes</span>
                    <span className="text-[#151515]">
                        ₹0
                    </span>
                </div>

            </div>


            {/* Total */}
            <div className="mt-3 flex items-end justify-between border-t border-[#e5e1da] pt-5">

                <div>
                    <p className="text-sm font-semibold">
                        Total
                        <span className="ml-1 font-normal text-[#858078]">
                            (Incl. of taxes)
                        </span>
                    </p>
                </div>

                <span className="text-xl font-semibold">
                    {formatPrice(totalPrice)}
                </span>

            </div>


            {/* Trust */}
            <div className="mt-5 grid grid-cols-3 border-t border-[#e5e1da] pt-5">

                <div className="flex flex-col items-center gap-1 border-r border-[#e5e1da] px-2 text-center">

                    <LockKeyhole size={17} className="text-[#4e4a45]" />

                    <span className="text-[10px] font-medium">
                        Secure
                    </span>

                    <span className="text-[10px] text-[#858078]">
                        checkout
                    </span>

                </div>


                <div className="flex flex-col items-center gap-1 border-r border-[#e5e1da] px-2 text-center">

                    <ShieldCheck size={18} className="text-[#4e4a45]" />

                    <span className="text-[10px] font-medium">
                        Encrypted
                    </span>

                    <span className="text-[10px] text-[#858078]">
                        payment
                    </span>

                </div>


                <div className="flex flex-col items-center gap-1 px-2 text-center">

                    <RotateCcw size={17} className="text-[#4e4a45]" />

                    <span className="text-[10px] font-medium">
                        30-day
                    </span>

                    <span className="text-[10px] text-[#858078]">
                        returns
                    </span>

                </div>

            </div>

        </aside>
    );
};

export default Checkout;