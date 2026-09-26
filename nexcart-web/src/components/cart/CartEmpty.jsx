import { MdArrowForward, MdShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";

const CartEmpty = () => {
    return (
        <main className="min-h-screen bg-[#f8fafc]">
            <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">

                <div className="mb-8 flex items-center gap-2 text-[13px] text-gray-500">
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

                <section className="flex min-h-[420px] items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-16">
                    <div className="max-w-md text-center">

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
                            <MdShoppingCart
                                size={32}
                                className="text-gray-400"
                            />
                        </div>

                        <h1 className="mt-6 text-[24px] font-semibold tracking-[-0.025em] text-gray-950">
                            Your cart is empty
                        </h1>

                        <p className="mt-2 text-[14px] leading-6 text-gray-500">
                            Looks like you haven't added anything to your cart yet.
                            Explore our products and find something you love.
                        </p>

                        <Link
                            to="/products"
                            className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0f172a] px-6 text-[13px] font-semibold text-white transition hover:bg-black"
                        >
                            Continue shopping
                            <MdArrowForward size={16} />
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default CartEmpty;