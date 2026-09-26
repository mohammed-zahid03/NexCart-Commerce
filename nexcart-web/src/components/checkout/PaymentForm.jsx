import React, { useState } from "react";
import {
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { formatPrice } from "../../utils/formatPrice";

import {
    FiLock,
    FiShield,
    FiCreditCard,
    FiArrowRight,
    FiInfo,
} from "react-icons/fi";

const PaymentForm = ({ clientSecret, totalPrice }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setErrorMessage("");
        setIsSubmitting(true);

        const { error: submitError } = await elements.submit();

        if (submitError) {
            setErrorMessage(submitError.message);
            setIsSubmitting(false);
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `${import.meta.env.VITE_FRONTEND_URL}/order-confirm`,
            },
        });

        if (error) {
            setErrorMessage(error.message);
            setIsSubmitting(false);
        }
    };

    const paymentElementOptions = {
        layout: {
            type: "accordion",
            defaultCollapsed: false,
            radios: false,
        },
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full"
        >
            {/* Main checkout card */}
            <div className="mx-auto w-full max-w-[1040px] overflow-hidden rounded-[18px] border border-[#e5e1da] bg-[#fffefa] shadow-[0_8px_30px_rgba(20,20,20,0.04)]">

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_285px]">

                    {/* =====================================================
                        LEFT — PAYMENT
                    ====================================================== */}
                    <div className="px-7 py-7 sm:px-8 lg:px-9">

                        {/* Heading */}
                        <div className="border-b border-[#e8e4dd] pb-5">

                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a847b]">
                                Step 04 of 04
                            </p>

                            <div className="flex items-center gap-2">
                                <h2 className="font-serif text-[30px] leading-[1.1] tracking-[-0.025em] text-[#111111]">
                                    Complete your payment
                                </h2>

                                <FiLock
                                    size={15}
                                    strokeWidth={1.7}
                                    className="mt-1 text-[#77716a]"
                                />
                            </div>

                            <p className="mt-2 text-[13px] leading-5 text-[#77716a]">
                                Your payment is securely processed through Stripe.
                            </p>
                        </div>

                        {/* Payment details heading */}
                        <div className="flex items-center gap-3 py-5">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1eee8]">
                                <FiCreditCard
                                    size={16}
                                    strokeWidth={1.7}
                                    className="text-[#5f5a54]"
                                />
                            </div>

                            <div>
                                <p className="text-[13px] font-semibold text-[#171717]">
                                    Payment details
                                </p>

                                <p className="mt-0.5 text-[11px] text-[#888179]">
                                    Enter your payment information securely.
                                </p>
                            </div>

                        </div>

                        {/* Stripe Payment Element */}
                        <div className="payment-element-wrapper">

                            <PaymentElement
                                options={paymentElementOptions}
                            />

                        </div>

                        {/* Error */}
                        {errorMessage && (
                            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[12px] leading-5 text-red-600">
                                {errorMessage}
                            </div>
                        )}

                        {/* Secure payment information */}
                        <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#f4f2ed] px-4 py-3.5">

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
                                <FiLock
                                    size={14}
                                    strokeWidth={1.7}
                                    className="text-[#69645d]"
                                />
                            </div>

                            <div>
                                <p className="text-[11px] font-medium text-[#383530]">
                                    Secure payment
                                </p>

                                <p className="mt-0.5 text-[10px] leading-4 text-[#8b867e]">
                                    Your payment information is encrypted and securely processed by Stripe.
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* =====================================================
                        RIGHT — ORDER SUMMARY
                    ====================================================== */}
                    <aside className="border-t border-[#e5e1da] bg-[#faf8f3] px-7 py-7 lg:border-l lg:border-t-0">

                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a847b]">
                            Order total
                        </p>

                        <p className="mt-3 font-serif text-[29px] tracking-[-0.025em] text-[#111111]">
                            {formatPrice(totalPrice)}
                        </p>

                        <p className="mt-2 max-w-[210px] text-[11px] leading-[1.65] text-[#77716a]">
                            Your final order total includes the selected products and applicable charges.
                        </p>

                        <div className="my-6 border-t border-[#dedad2]" />

                        {/* Secure checkout */}
                        <div className="flex gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0eee9]">
                                <FiShield
                                    size={15}
                                    strokeWidth={1.7}
                                    className="text-[#66615b]"
                                />
                            </div>

                            <div>
                                <p className="text-[12px] font-semibold text-[#272522]">
                                    Secure checkout
                                </p>

                                <p className="mt-1 text-[10px] leading-4 text-[#88827a]">
                                    Protected payment processing.
                                </p>
                            </div>

                        </div>

                        {/* Encrypted */}
                        <div className="mt-5 flex gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0eee9]">
                                <FiLock
                                    size={15}
                                    strokeWidth={1.7}
                                    className="text-[#66615b]"
                                />
                            </div>

                            <div>
                                <p className="text-[12px] font-semibold text-[#272522]">
                                    Encrypted
                                </p>

                                <p className="mt-1 text-[10px] leading-4 text-[#88827a]">
                                    Your payment details remain protected.
                                </p>
                            </div>

                        </div>

                        {/* Pay button */}
                        <button
                            type="submit"
                            disabled={!stripe || !elements || isSubmitting}
                            className="mt-7 flex h-[47px] w-full items-center justify-center gap-2 rounded-[11px] bg-[#151515] px-4 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                "Processing..."
                            ) : (
                                <>
                                    Pay {formatPrice(totalPrice)}
                                    <FiArrowRight
                                        size={15}
                                        strokeWidth={1.8}
                                    />
                                </>
                            )}
                        </button>

                    </aside>

                </div>
            </div>

            {/* Bottom page navigation is handled by Checkout.jsx */}
        </form>
    );
};

export default PaymentForm;