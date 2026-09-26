import { useEffect, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import SetQuantity from "./SetQuantity";
import {
    decreaseCartQuantity,
    increaseCartQuantity,
    removeFromCart,
} from "../../store/actions";
import toast from "react-hot-toast";
import { formatPrice } from "../../utils/formatPrice";
import { getImageUrl } from "../../utils/imageUrl";

const ItemContent = ({
    productId,
    productName,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice,
}) => {
    const [currentQuantity, setCurrentQuantity] = useState(quantity);
    const dispatch = useDispatch();

    useEffect(() => {
        setCurrentQuantity(quantity);
    }, [quantity]);

    const handleQtyIncrease = () => {
        dispatch(
            increaseCartQuantity(
                {
                    image,
                    productName,
                    description,
                    specialPrice,
                    price,
                    productId,
                    quantity: currentQuantity,
                },
                toast,
                currentQuantity,
                setCurrentQuantity
            )
        );
    };

    const handleQtyDecrease = () => {
        if (currentQuantity <= 1) return;

        const newQuantity = currentQuantity - 1;

        setCurrentQuantity(newQuantity);

        dispatch(
            decreaseCartQuantity(
                {
                    image,
                    productName,
                    description,
                    specialPrice,
                    price,
                    productId,
                    quantity: currentQuantity,
                },
                newQuantity
            )
        );
    };

    const removeItemFromCart = () => {
        dispatch(
            removeFromCart(
                {
                    image,
                    productName,
                    description,
                    specialPrice,
                    price,
                    productId,
                    quantity: currentQuantity,
                },
                toast
            )
        );
    };

    const originalPrice = Number(price || 0);
    const salePrice = Number(specialPrice || 0);
    const savings = Math.max(originalPrice - salePrice, 0);
    const itemTotal = salePrice * currentQuantity;

    return (
        <article className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex gap-4 sm:gap-5">

                {/* Product image */}
                <Link
                    to={`/product/${productId}`}
                    className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#f7f7f5] sm:h-32 sm:w-32"
                >
                    <img
                        src={getImageUrl(image)}
                        alt={productName}
                        className="h-full w-full object-contain p-2 transition duration-300 hover:scale-[1.03]"
                    />
                </Link>

                {/* Product information */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <Link
                                to={`/product/${productId}`}
                                className="block truncate text-[15px] font-semibold text-gray-950 transition hover:text-gray-600 sm:text-[17px]"
                            >
                                {productName}
                            </Link>

                            <p className="mt-1 line-clamp-1 text-[12px] text-gray-500">
                                {description}
                            </p>
                        </div>

                        {discount > 0 && (
                            <span className="shrink-0 rounded-md bg-green-50 px-2 py-1 text-[10px] font-bold text-green-600">
                                {Math.round(discount)}% OFF
                            </span>
                        )}
                    </div>

                    {/* Price */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-[17px] font-semibold text-gray-950">
                            {formatPrice(salePrice)}
                        </span>

                        {originalPrice > salePrice && (
                            <>
                                <span className="text-[12px] text-gray-400 line-through">
                                    {formatPrice(originalPrice)}
                                </span>

                                <span className="text-[12px] font-medium text-green-600">
                                    Save {formatPrice(savings)}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Bottom controls */}
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <SetQuantity
                            quantity={currentQuantity}
                            cardCounter={true}
                            handeQtyIncrease={handleQtyIncrease}
                            handleQtyDecrease={handleQtyDecrease}
                        />

                        <div className="flex items-center justify-between gap-10 sm:justify-end">
                            <button
                                type="button"
                                onClick={removeItemFromCart}
                                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-400 transition hover:text-red-500"
                            >
                                <HiOutlineTrash size={15} />
                                Remove
                            </button>

                            <span className="text-[16px] font-semibold text-gray-950">
                                {formatPrice(itemTotal)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ItemContent;