import React, { useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import {
    LockKeyhole,
    ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import PaymentForm from "./PaymentForm";
import { createStripePaymentSecret } from "../../store/actions";

const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    {
        developerTools: {
            assistant: {
                enabled: false,
            },
        },
    }
);

const StripePayment = () => {
    const dispatch = useDispatch();

    const {
        clientSecret,
        user,
        selectedUserCheckoutAddress,
    } = useSelector((state) => state.auth);

    const { totalPrice } = useSelector(
        (state) => state.carts
    );

    const {
        isLoading,
        errorMessage,
    } = useSelector(
        (state) => state.errors
    );

    useEffect(() => {
        if (!clientSecret) {
            const sendData = {
                email: user.email,
                name: `${user.username}`,
                address: selectedUserCheckoutAddress,
                description: `Order for ${user.email}`,
                metadata: {
                    test: "1",
                },
            };

            dispatch(
                createStripePaymentSecret(
                    sendData,
                    toast
                )
            );
        }
    }, [
        clientSecret,
        dispatch,
        user,
        selectedUserCheckoutAddress,
    ]);

    if (errorMessage) {
        return (
            <div className="mx-auto max-w-[1100px] px-5 py-10">
                <div className="rounded-2xl border border-[#ead7d4] bg-[#fff9f8] p-8 text-center">
                    <h2 className="font-serif text-2xl text-[#151515]">
                        Payment could not be initialized
                    </h2>

                    <p className="mt-2 text-sm text-[#77736c]">
                        {errorMessage}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-[1100px]">

            {clientSecret ? (
                <Elements
                    stripe={stripePromise}
                    options={{
                        clientSecret,
                        appearance: {
                            theme: "flat",
                            variables: {
                                colorPrimary: "#151515",
                                colorText: "#151515",
                                colorTextSecondary: "#77736c",
                                colorBackground: "#fffefa",
                                colorDanger: "#a04f47",
                                borderRadius: "10px",
                                fontFamily:
                                    "Inter, ui-sans-serif, system-ui, sans-serif",
                                spacingUnit: "4px",
                            },

                            rules: {
                                ".Input": {
                                    backgroundColor: "#fffefa",
                                    border: "1px solid #ddd9d2",
                                    boxShadow: "none",
                                },

                                ".Input:focus": {
                                    border:
                                        "1px solid #151515",
                                    boxShadow: "0 0 0 1px #151515",
                                },

                                ".Label": {
                                    color: "#5f5b54",
                                    fontSize: "13px",
                                },
                            },
                        },
                    }}
                >
                    <PaymentForm
                        clientSecret={clientSecret}
                        totalPrice={totalPrice}
                    />
                </Elements>
            ) : (
                <div className="rounded-2xl border border-[#e3dfd8] bg-[#fffefa] p-12">

                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ddd9d2] border-t-[#151515]" />

                    <p className="mt-4 text-center text-sm text-[#77736c]">
                        Preparing secure payment...
                    </p>

                </div>
            )}

        </div>
    );
};

export default StripePayment;