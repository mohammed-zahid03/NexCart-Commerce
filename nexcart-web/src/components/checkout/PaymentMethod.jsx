import React, { useEffect } from "react";
import { Check, CreditCard, LockKeyhole } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
    addPaymentMethod,
    createUserCart,
} from "../../store/actions";

const PaymentMethod = () => {
    const dispatch = useDispatch();

    const { paymentMethod } = useSelector(
        (state) => state.payment
    );

    const { cart, cartId } = useSelector(
        (state) => state.carts
    );

    const { errorMessage } = useSelector(
        (state) => state.errors
    );

    useEffect(() => {
        if (
            cart.length > 0 &&
            !cartId &&
            !errorMessage
        ) {
            const sendCartItems = cart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            }));

            dispatch(createUserCart(sendCartItems));
        }
    }, [dispatch, cart, cartId, errorMessage]);

    const paymentMethodHandler = () => {
        dispatch(addPaymentMethod("Stripe"));
    };

    return (
        <div className="mx-auto w-full max-w-2xl">

            {/* Section heading */}
            <div className="mb-8">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
                    Step 02
                </p>

                <h2 className="mt-2 font-serif text-3xl tracking-[-0.03em] text-[#151515] sm:text-4xl">
                    Payment method
                </h2>

                <p className="mt-3 text-sm text-slate-500 sm:text-base">
                    Choose how you'd like to pay for your order.
                </p>
            </div>


            {/* Payment card */}
            <div className="rounded-2xl border border-[#e4e0d8] bg-[#fffefa] p-6 shadow-[0_8px_30px_rgba(20,20,20,0.035)] sm:p-7">

                {/* Card heading */}
                <div className="mb-5 border-b border-[#ebe7df] pb-5">

                    <h3 className="text-base font-semibold text-[#151515]">
                        Payment option
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Select the available payment method.
                    </p>

                </div>


                {/* Stripe */}
                <button
                    type="button"
                    onClick={paymentMethodHandler}
                    className={`group w-full rounded-xl border p-5 text-left transition-all duration-200 ${
                        paymentMethod === "Stripe"
                            ? "border-[#151515] bg-[#faf9f5] shadow-[0_8px_24px_rgba(20,20,20,0.05)]"
                            : "border-[#e4e0d8] bg-white hover:border-[#c9c4ba] hover:shadow-[0_8px_24px_rgba(20,20,20,0.04)]"
                    }`}
                >

                    <div className="flex items-center gap-4">

                        {/* Radio */}
                        <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                paymentMethod === "Stripe"
                                    ? "border-[#151515]"
                                    : "border-[#aaa59d]"
                            }`}
                        >
                            {paymentMethod === "Stripe" && (
                                <div className="h-2.5 w-2.5 rounded-full bg-[#151515]" />
                            )}
                        </div>


                        {/* Icon */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0eee9]">
                            <CreditCard
                                size={21}
                                strokeWidth={1.7}
                                className="text-[#45413b]"
                            />
                        </div>


                        {/* Content */}
                        <div className="min-w-0 flex-1">

                            <div className="flex items-center justify-between gap-3">

                                <h4 className="text-sm font-semibold text-[#151515] sm:text-base">
                                    Stripe
                                </h4>

                                {paymentMethod === "Stripe" && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e9f6ef] px-2.5 py-1 text-[11px] font-medium text-[#24734a]">
                                        <Check size={12} strokeWidth={2.5} />
                                        Selected
                                    </span>
                                )}

                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                Secure online payment powered by Stripe.
                            </p>

                        </div>

                    </div>

                </button>


                {/* Security information */}
                <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#f5f3ee] px-4 py-3.5">

                    <LockKeyhole
                        size={17}
                        strokeWidth={1.7}
                        className="mt-0.5 shrink-0 text-[#666158]"
                    />

                    <div>
                        <p className="text-xs font-medium text-[#403d38]">
                            Secure payment
                        </p>

                        <p className="mt-0.5 text-xs leading-5 text-[#77736c]">
                            Your payment is securely processed through Stripe.
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default PaymentMethod;