import { MdArrowBack, MdLockOutline, MdShoppingCart } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ItemContent from "./ItemContent";
import CartEmpty from "./CartEmpty";
import { formatPrice } from "../../utils/formatPrice";

const Cart = () => {
    const { cart } = useSelector((state) => state.carts);
const { isLoading } = useSelector((state) => state.errors);

if (isLoading) {
    return (
        <main className="min-h-screen bg-[#f7f8fa]">
            <div className="mx-auto w-full max-w-[1440px] px-5 py-10">
                <div className="animate-pulse">
                    {/* Header skeleton */}
                    <div className="mb-8 h-8 w-40 rounded bg-gray-200" />

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
                        {/* Cart items skeleton */}
                        <div className="space-y-4">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="flex gap-5 rounded-2xl border border-gray-200 bg-white p-5"
                                >
                                    <div className="h-28 w-28 shrink-0 rounded-xl bg-gray-200" />

                                    <div className="flex-1 space-y-3">
                                        <div className="h-5 w-3/4 rounded bg-gray-200" />
                                        <div className="h-4 w-1/3 rounded bg-gray-200" />
                                        <div className="h-9 w-28 rounded bg-gray-200" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary skeleton */}
                        <div className="h-72 rounded-2xl border border-gray-200 bg-white p-6">
                            <div className="mb-6 h-6 w-32 rounded bg-gray-200" />

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <div className="h-4 w-24 rounded bg-gray-200" />
                                    <div className="h-4 w-20 rounded bg-gray-200" />
                                </div>

                                <div className="flex justify-between">
                                    <div className="h-4 w-20 rounded bg-gray-200" />
                                    <div className="h-4 w-16 rounded bg-gray-200" />
                                </div>

                                <div className="h-px bg-gray-200" />

                                <div className="flex justify-between">
                                    <div className="h-5 w-24 rounded bg-gray-200" />
                                    <div className="h-5 w-24 rounded bg-gray-200" />
                                </div>

                                <div className="h-11 w-full rounded-xl bg-gray-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

    if (!cart || cart.length === 0) {
        return <CartEmpty />;
    }

    const subtotal = cart.reduce(
        (acc, item) =>
            acc + Number(item?.specialPrice || 0) * Number(item?.quantity || 0),
        0
    );

    const totalSavings = cart.reduce(
        (acc, item) =>
            acc +
            (Number(item?.price || 0) - Number(item?.specialPrice || 0)) *
                Number(item?.quantity || 0),
        0
    );

    const totalItems = cart.reduce(
        (acc, item) => acc + Number(item?.quantity || 0),
        0
    );

    return (
        <main className="min-h-screen bg-[#f8fafc]">
            <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

                {/* Breadcrumb */}
               <div className="mb-4 flex items-center gap-2 text-[13px] text-gray-500">
                    <Link
                        to="/"
                        className="transition hover:text-gray-950"
                    >
                        Home
                    </Link>

                    <span>/</span>

                    <span className="text-gray-900">
                        Cart
                    </span>
                </div>

                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>

<div className="flex items-center gap-3">
                            <h1 className="text-[32px] font-semibold tracking-[-0.035em] text-gray-950 sm:text-[38px]">
                                Your Cart
                            </h1>

                            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[12px] font-medium text-gray-600">
                                {totalItems} {totalItems === 1 ? "item" : "items"}
                            </span>
                        </div>

                        <p className="mt-2 text-[14px] text-gray-500">
                            Review your items before checkout.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="inline-flex w-fit items-center gap-2 text-[13px] font-medium text-gray-600 transition hover:text-gray-950"
                    >
                        <MdArrowBack size={17} />
                        Continue shopping
                    </Link>
                </div>

                {/* Main layout */}
                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

                    {/* Cart items */}
                    <section className="space-y-4">
                        {cart.map((item, index) => (
                            <ItemContent
                                key={item?.cartId || item?.productId || index}
                                {...item}
                            />
                        ))}
                    </section>

                    {/* Order Summary */}
                    <aside className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 lg:sticky lg:top-6">
                        <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-gray-950">
                            Order summary
                        </h2>

                        <div className="mt-5 space-y-3 text-[14px]">
                            <div className="flex justify-between gap-4 text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>

                            {totalSavings > 0 && (
                                <div className="flex justify-between gap-4 text-gray-600">
                                    <span>You save</span>
                                    <span className="font-medium text-green-600">
                                        -{formatPrice(totalSavings)}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between gap-4 text-gray-600">
                                <span>Delivery</span>
                                <span className="font-medium text-green-600">
                                    FREE
                                </span>
                            </div>
                        </div>

                        <div className="my-5 border-t border-gray-100" />

                        <div className="flex items-center justify-between gap-4">
                            <span className="text-[15px] font-semibold text-gray-950">
                                Estimated total
                            </span>

                            <span className="text-[22px] font-semibold tracking-[-0.025em] text-gray-950">
                                {formatPrice(subtotal)}
                            </span>
                        </div>

                        <p className="mt-2 text-[11px] leading-5 text-gray-400">
                            Taxes and final delivery charges, if applicable,
                            are calculated at checkout.
                        </p>

                        <Link
                            to="/checkout"
                            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0f172a] px-5 text-[14px] font-semibold text-white transition hover:bg-black"
                        >
                            <MdShoppingCart size={19} />
                            Proceed to Checkout
                        </Link>

                        {/* Trust */}
                        <div className="mt-5 border-t border-gray-100 pt-5">
                            <div className="flex items-center gap-2 text-[12px] text-gray-500">
                                <MdLockOutline size={16} />
                                Secure checkout
                            </div>

                            <div className="mt-3 space-y-2 text-[12px] text-gray-500">
                                <p>✓ Free delivery on eligible orders</p>
                                <p>✓ 30-day easy returns</p>
                                <p>✓ Secure payment</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default Cart;