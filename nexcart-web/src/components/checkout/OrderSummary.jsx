import React from "react";
import {
    Check,
    CreditCard,
    MapPin,
    Package,
    ShieldCheck,
} from "lucide-react";

import { formatPriceCalculation } from "../../utils/formatPrice";

const OrderSummary = ({
    totalPrice,
    cart = [],
    address,
    paymentMethod,
}) => {
    const formatPrice = (value) =>
        `₹${Number(value || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 0,
        })}`;

    const itemCount = cart.reduce(
        (sum, item) => sum + Number(item?.quantity || 0),
        0
    );

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">

            {/* =====================================================
                LEFT — REVIEW DETAILS
            ====================================================== */}
            <div>

                <div className="mb-8">
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#858078]">
                        Step 03
                    </p>

                    <h2 className="mt-2 font-serif text-3xl tracking-[-0.03em] text-[#151515] sm:text-4xl">
                        Review your order
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-[#77736c]">
                        Please confirm your delivery and payment details before
                        proceeding.
                    </p>
                </div>


                {/* =================================================
                    DELIVERY ADDRESS
                ================================================= */}
                <section className="rounded-2xl border border-[#e3dfd8] bg-[#fffefa]">

                    <div className="flex items-center gap-3 border-b border-[#e7e3dc] px-6 py-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0eee9]">
                            <MapPin
                                size={18}
                                strokeWidth={1.6}
                                className="text-[#4e4a45]"
                            />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-[#151515]">
                                Delivery address
                            </h3>

                            <p className="mt-0.5 text-xs text-[#858078]">
                                Where your order will be delivered
                            </p>
                        </div>
                    </div>


                    <div className="px-6 py-6">

                        <p className="text-sm font-semibold text-[#151515]">
                            {address?.buildingName || "Saved address"}
                        </p>

                        <div className="mt-3 space-y-1 text-sm leading-5 text-[#68635c]">

                            {address?.street && (
                                <p>{address.street}</p>
                            )}

                            {(address?.city || address?.state) && (
                                <p>
                                    {[address?.city, address?.state]
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>
                            )}

                            {(address?.pincode || address?.country) && (
                                <p>
                                    {[address?.pincode, address?.country]
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>
                            )}

                        </div>

                    </div>
                </section>


                {/* =================================================
                    PAYMENT METHOD
                ================================================= */}
                <section className="mt-5 rounded-2xl border border-[#e3dfd8] bg-[#fffefa]">

                    <div className="flex items-center gap-3 border-b border-[#e7e3dc] px-6 py-5">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0eee9]">
                            <CreditCard
                                size={18}
                                strokeWidth={1.6}
                                className="text-[#4e4a45]"
                            />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-[#151515]">
                                Payment method
                            </h3>

                            <p className="mt-0.5 text-xs text-[#858078]">
                                Your selected payment option
                            </p>
                        </div>

                    </div>


                    <div className="flex items-center justify-between px-6 py-6">

                        <div>

                            <p className="text-sm font-semibold text-[#151515]">
                                {paymentMethod || "Stripe"}
                            </p>

                            <p className="mt-1 text-xs text-[#858078]">
                                Secure online payment
                            </p>

                        </div>


                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#151515]">
                            <Check
                                size={14}
                                strokeWidth={2.5}
                                className="text-white"
                            />
                        </div>

                    </div>

                </section>


                {/* =================================================
                    ORDER ITEMS
                ================================================= */}
                <section className="mt-5 rounded-2xl border border-[#e3dfd8] bg-[#fffefa]">

                    <div className="flex items-center justify-between border-b border-[#e7e3dc] px-6 py-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0eee9]">
                                <Package
                                    size={18}
                                    strokeWidth={1.6}
                                    className="text-[#4e4a45]"
                                />
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-[#151515]">
                                    Order items
                                </h3>

                                <p className="mt-0.5 text-xs text-[#858078]">
                                    {itemCount}{" "}
                                    {itemCount === 1 ? "item" : "items"}
                                </p>
                            </div>

                        </div>

                    </div>


                    <div className="divide-y divide-[#ebe7df]">

                        {cart.map((item) => (

                            <div
                                key={item?.productId}
                                className="flex items-center gap-4 px-6 py-5"
                            >

                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f1efea]">

                                    <img
                                        src={`${import.meta.env.VITE_BACK_END_URL}/images/${item?.image}`}
                                        alt={item?.productName || "Product"}
                                        className="h-full w-full object-contain p-2"
                                    />

                                </div>


                                <div className="min-w-0 flex-1">

                                    <p className="text-sm font-medium text-[#151515]">
                                        {item?.productName}
                                    </p>

                                    <p className="mt-1 text-xs text-[#858078]">
                                        Qty: {item?.quantity}
                                    </p>

                                </div>


                                <div className="text-right">

                                    <p className="text-sm font-semibold text-[#151515]">
                                        {formatPrice(
                                            Number(
                                                item?.specialPrice ||
                                                item?.price ||
                                                0
                                            ) *
                                            Number(item?.quantity || 0)
                                        )}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>
                </section>

            </div>


            {/* =====================================================
                RIGHT — ORDER TOTAL
            ====================================================== */}
            <aside className="h-fit rounded-2xl border border-[#e3dfd8] bg-[#fffefa] p-7 lg:sticky lg:top-6">

                <div className="flex items-center justify-between border-b border-[#e5e1da] pb-5">

                    <h2 className="font-serif text-2xl tracking-[-0.025em]">
                        Order summary
                    </h2>

                    <span className="text-xs text-[#77736c]">
                        {itemCount}{" "}
                        {itemCount === 1 ? "item" : "items"}
                    </span>

                </div>


                <div className="mt-5 space-y-3">

                    <div className="flex justify-between text-sm text-[#77736c]">
                        <span>Products</span>
                        <span className="text-[#151515]">
                            {formatPrice(totalPrice)}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm text-[#77736c]">
                        <span>Shipping</span>
                        <span className="font-medium text-emerald-700">
                            FREE
                        </span>
                    </div>

                    <div className="flex justify-between text-sm text-[#77736c]">
                        <span>Taxes</span>
                        <span className="text-[#151515]">
                            {formatPrice(0)}
                        </span>
                    </div>

                </div>


                <div className="mt-5 flex items-end justify-between border-t border-[#e5e1da] pt-5">

                    <div>
                        <p className="text-sm font-semibold text-[#151515]">
                            Total
                        </p>

                        <p className="mt-1 text-xs text-[#858078]">
                            Inclusive of taxes
                        </p>
                    </div>

                    <p className="text-xl font-semibold text-[#151515]">
                        {formatPrice(totalPrice)}
                    </p>

                </div>


                <div className="mt-6 border-t border-[#e5e1da] pt-5">

                    <div className="flex items-start gap-3">

                        <ShieldCheck
                            size={18}
                            strokeWidth={1.6}
                            className="mt-0.5 shrink-0 text-[#55514b]"
                        />

                        <div>

                            <p className="text-xs font-medium text-[#403d38]">
                                Secure checkout
                            </p>

                            <p className="mt-1 text-xs leading-5 text-[#858078]">
                                Your order and payment information are
                                securely protected.
                            </p>

                        </div>

                    </div>

                </div>

            </aside>

        </div>
    );
};

export default OrderSummary;