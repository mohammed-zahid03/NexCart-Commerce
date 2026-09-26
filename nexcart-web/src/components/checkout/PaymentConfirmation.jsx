import React, { useEffect, useState } from "react";
import {
    FiArrowRight,
    FiCheck,
    FiCreditCard,
    FiLock,
    FiMapPin,
    FiPackage,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { stripePaymentConfirmation } from "../../store/actions";
import toast from "react-hot-toast";
import { formatPrice } from "../../utils/formatPrice";

const PaymentConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const { cart } = useSelector((state) => state.carts);

    const searchParams = new URLSearchParams(location.search);

    const paymentIntent = searchParams.get("payment_intent");
    const clientSecret = searchParams.get(
        "payment_intent_client_secret"
    );
    const redirectStatus = searchParams.get("redirect_status");

    const selectedUserCheckoutAddress = localStorage.getItem(
        "CHECKOUT_ADDRESS"
    )
        ? JSON.parse(localStorage.getItem("CHECKOUT_ADDRESS"))
        : null;

    useEffect(() => {
        if (
            paymentIntent &&
            clientSecret &&
            redirectStatus === "succeeded" &&
            cart &&
            cart.length > 0 &&
            selectedUserCheckoutAddress?.addressId
        ) {
            const sendData = {
                addressId: selectedUserCheckoutAddress.addressId,
                pgName: "Stripe",
                pgPaymentId: paymentIntent,
                pgStatus: "succeeded",
                pgResponseMessage: "Payment successful",
            };

            const createOrder = async () => {
                const createdOrder = await dispatch(
                    stripePaymentConfirmation(
                        sendData,
                        setErrorMessage,
                        setLoading,
                        toast
                    )
                );

                if (createdOrder) {
                    setOrder(createdOrder);
                }
            };

            createOrder();
        }
    }, [
        paymentIntent,
        clientSecret,
        redirectStatus,
        cart,
        retryCount,
    ]);

    // --------------------------------------------------
    // Loading
    // --------------------------------------------------

    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-6">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#ddd9d1] bg-white">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#dedbd4] border-t-[#171717]" />
                    </div>

                    <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500">
                        NexCart
                    </p>

                    <h2 className="mt-3 font-serif text-3xl text-[#171717]">
                        Confirming your order
                    </h2>

                    <p className="mt-3 text-sm text-slate-500">
                        Please don't close or refresh this page.
                    </p>
                </div>
            </div>
        );
    }

    // --------------------------------------------------
    // Error
    // --------------------------------------------------

    if (errorMessage) {
        return (
            <div className="min-h-screen bg-[#faf9f6] px-6 py-20">
                <div className="mx-auto max-w-lg text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f8efed]">
                        <span className="text-xl font-medium text-[#a33b2f]">
                            !
                        </span>
                    </div>

                    <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500">
                        Payment
                    </p>

                    <h1 className="mt-3 font-serif text-4xl tracking-[-0.03em] text-[#171717]">
                        Payment confirmation failed
                    </h1>

                    <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500">
                        {errorMessage}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => {
                                setErrorMessage("");
                                setOrder(null);
                                setRetryCount((prev) => prev + 1);
                            }}
                            className="flex-1 rounded-full bg-[#171717] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#2a2a2a]"
                        >
                            Retry confirmation
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="flex-1 rounded-full border border-[#dcd8d0] bg-white px-6 py-3.5 text-sm font-medium text-[#171717] transition hover:bg-[#f4f2ee]"
                        >
                            Continue shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --------------------------------------------------
    // Confirmation page
    // --------------------------------------------------

    return (
        <main className="min-h-screen bg-[#faf9f6] text-[#171717]">
            {order ? (
                <>
                    {/* -------------------------------- */}
                    {/* Success Header                    */}
                    {/* -------------------------------- */}

                    <section className="border-b border-[#e5e1d9] bg-[#faf9f6]">
                        <div className="mx-auto max-w-[1180px] px-6 pb-12 pt-16 lg:px-8">
                            <div className="text-center">
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#d8d4cc] bg-white">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#171717] text-white">
                                        <FiCheck
                                            size={23}
                                            strokeWidth={2}
                                        />
                                    </div>
                                </div>

                                <p className="mt-7 text-[11px] font-medium uppercase tracking-[0.25em] text-slate-500">
                                    NexCart
                                </p>

                                <h1 className="mt-3 font-serif text-4xl tracking-[-0.035em] text-[#171717] sm:text-5xl">
                                    Order confirmed
                                </h1>

                                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                                    Thank you for your purchase. Your order
                                    has been successfully placed and is now
                                    being processed.
                                </p>

                                <div className="mt-6 flex items-center justify-center gap-3 text-sm text-slate-500">
                                    <span>
                                        Order #{order.orderId}
                                    </span>

                                    <span className="h-1 w-1 rounded-full bg-slate-300" />

                                    <span>
                                        {order.orderDate
                                            ? new Date(
                                                  order.orderDate
                                              ).toLocaleDateString(
                                                  "en-IN",
                                                  {
                                                      day: "2-digit",
                                                      month: "short",
                                                      year: "numeric",
                                                  }
                                              )
                                            : "-"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* -------------------------------- */}
                    {/* Main Content                      */}
                    {/* -------------------------------- */}

                    <section className="mx-auto max-w-[1180px] px-6 py-10 lg:px-8 lg:py-14">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_350px]">
                            {/* ================================= */}
                            {/* LEFT COLUMN                       */}
                            {/* ================================= */}

                            <div className="space-y-6">
                                {/* Order Summary */}

                                <section className="overflow-hidden rounded-[20px] border border-[#e3dfd7] bg-white">
                                    <div className="border-b border-[#e8e4dd] px-7 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f0eb]">
                                                <FiPackage
                                                    size={18}
                                                    className="text-[#55524c]"
                                                />
                                            </div>

                                            <div>
                                                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                                                    Your purchase
                                                </p>

                                                <h2 className="mt-1 font-serif text-2xl text-[#171717]">
                                                    Order summary
                                                </h2>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-[#eeeae3]">
                                        {order.orderItems?.map((item) => (
                                            <div
                                                key={item.orderItemId}
                                                className="flex items-center justify-between gap-6 px-7 py-6"
                                            >
                                                <div className="min-w-0">
                                                    <h3 className="text-[15px] font-medium text-[#171717]">
                                                        {item.product
                                                            ?.productName ||
                                                            "Product"}
                                                    </h3>

                                                    <p className="mt-2 text-sm text-slate-500">
                                                        Qty{" "}
                                                        {item.quantity}
                                                        <span className="mx-2 text-slate-300">
                                                            ·
                                                        </span>
                                                        {formatPrice(
                                                            item.orderedProductPrice
                                                        )}
                                                    </p>

                                                    {item.discount > 0 && (
                                                        <p className="mt-2 text-xs font-medium text-[#4b806a]">
                                                            Discount{" "}
                                                            {formatPrice(
                                                                item.discount
                                                            )}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="shrink-0 text-right">
                                                    <p className="text-[15px] font-medium text-[#171717]">
                                                        {formatPrice(
                                                            item.orderedProductPrice *
                                                                item.quantity
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-[#e8e4dd] bg-[#fcfbf8] px-7 py-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-500">
                                                Order total
                                            </span>

                                            <span className="text-xl font-semibold tracking-[-0.02em] text-[#171717]">
                                                {formatPrice(
                                                    order.totalAmount
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </section>

                                {/* Delivery Address */}

                                {selectedUserCheckoutAddress && (
                                    <section className="rounded-[20px] border border-[#e3dfd7] bg-white">
                                        <div className="border-b border-[#e8e4dd] px-7 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f0eb]">
                                                    <FiMapPin
                                                        size={18}
                                                        className="text-[#55524c]"
                                                    />
                                                </div>

                                                <div>
                                                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                                                        Delivery
                                                    </p>

                                                    <h2 className="mt-1 font-serif text-2xl text-[#171717]">
                                                        Delivery address
                                                    </h2>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-7 py-6">
                                            <div className="rounded-2xl border border-[#ebe7e0] bg-[#fcfbf8] p-5">
                                                {selectedUserCheckoutAddress.buildingName && (
                                                    <p className="font-medium text-[#171717]">
                                                        {
                                                            selectedUserCheckoutAddress.buildingName
                                                        }
                                                    </p>
                                                )}

                                                {selectedUserCheckoutAddress.street && (
                                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                                        {
                                                            selectedUserCheckoutAddress.street
                                                        }
                                                    </p>
                                                )}

                                                <p className="text-sm leading-6 text-slate-600">
                                                    {
                                                        selectedUserCheckoutAddress.city
                                                    }
                                                    {selectedUserCheckoutAddress.state
                                                        ? `, ${selectedUserCheckoutAddress.state}`
                                                        : ""}
                                                </p>

                                                {selectedUserCheckoutAddress.pincode && (
                                                    <p className="text-sm leading-6 text-slate-600">
                                                        {
                                                            selectedUserCheckoutAddress.pincode
                                                        }
                                                    </p>
                                                )}

                                                {selectedUserCheckoutAddress.country && (
                                                    <p className="text-sm leading-6 text-slate-600">
                                                        {
                                                            selectedUserCheckoutAddress.country
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* Payment */}

                                {order.payment && (
                                    <section className="rounded-[20px] border border-[#e3dfd7] bg-white">
                                        <div className="border-b border-[#e8e4dd] px-7 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f0eb]">
                                                    <FiCreditCard
                                                        size={18}
                                                        className="text-[#55524c]"
                                                    />
                                                </div>

                                                <div>
                                                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                                                        Payment
                                                    </p>

                                                    <h2 className="mt-1 font-serif text-2xl text-[#171717]">
                                                        Payment details
                                                    </h2>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-6 px-7 py-6">
                                            <div>
                                                <p className="font-medium text-[#171717]">
                                                    {order.payment
                                                        .paymentMethod ||
                                                        order.payment
                                                            .pgName ||
                                                        "Stripe"}
                                                </p>

                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e8f3ed] text-[#3d765c]">
                                                        <FiCheck
                                                            size={12}
                                                            strokeWidth={2.5}
                                                        />
                                                    </span>

                                                    <span className="text-sm text-[#4b806a]">
                                                        {order.payment
                                                            .pgStatus ===
                                                        "succeeded"
                                                            ? "Payment successful"
                                                            : order.payment
                                                                  .pgStatus}
                                                    </span>
                                                </div>
                                            </div>

                                            <span className="text-lg font-semibold text-[#171717]">
                                                {formatPrice(
                                                    order.totalAmount
                                                )}
                                            </span>
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* ================================= */}
                            {/* RIGHT COLUMN                       */}
                            {/* ================================= */}

                            <aside>
                                <div className="rounded-[20px] border border-[#e3dfd7] bg-white p-7 lg:sticky lg:top-6">
                                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                                        Order details
                                    </p>

                                    <h2 className="mt-2 font-serif text-3xl tracking-[-0.03em] text-[#171717]">
                                        #{order.orderId}
                                    </h2>

                                    <div className="my-7 h-px bg-[#e7e3dc]" />

                                    <div className="space-y-5">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                                                Order date
                                            </p>

                                            <p className="mt-1.5 text-sm text-[#171717]">
                                                {order.orderDate
                                                    ? new Date(
                                                          order.orderDate
                                                      ).toLocaleDateString(
                                                          "en-IN",
                                                          {
                                                              day: "2-digit",
                                                              month: "short",
                                                              year: "numeric",
                                                          }
                                                      )
                                                    : "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                                                Status
                                            </p>

                                            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#eef6f1] px-3 py-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#4b806a]" />

                                                <span className="text-xs font-medium capitalize text-[#4b806a]">
                                                    {order.orderStatus ||
                                                        "Confirmed"}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                                                Payment
                                            </p>

                                            <p className="mt-1.5 text-sm text-[#171717]">
                                                {order.payment?.pgName ||
                                                    "Stripe"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="my-7 h-px bg-[#e7e3dc]" />

                                    <div className="flex items-end justify-between gap-4">
                                        <span className="text-sm text-slate-500">
                                            Total
                                        </span>

                                        <span className="text-2xl font-semibold tracking-[-0.03em] text-[#171717]">
                                            {formatPrice(
                                                order.totalAmount
                                            )}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => navigate("/")}
                                        className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-[#171717] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#292929]"
                                    >
                                        Continue shopping

                                        <FiArrowRight
                                            size={16}
                                            strokeWidth={1.8}
                                        />
                                    </button>

                                    <div className="mt-6 flex items-start gap-3 border-t border-[#e7e3dc] pt-6">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f2f0eb]">
                                            <FiLock
                                                size={15}
                                                className="text-[#55524c]"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-[#171717]">
                                                Secure payment
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                Your payment was securely
                                                processed through Stripe.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </section>
                </>
            ) : (
                <div className="flex min-h-[60vh] items-center justify-center px-6">
                    <div className="text-center">
                        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500">
                            NexCart
                        </p>

                        <h2 className="mt-3 font-serif text-3xl text-[#171717]">
                            Preparing your order confirmation
                        </h2>

                        <p className="mt-3 text-sm text-slate-500">
                            Please wait while we load your order details.
                        </p>
                    </div>
                </div>
            )}
        </main>
    );
};

export default PaymentConfirmation;