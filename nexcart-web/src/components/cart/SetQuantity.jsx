const SetQuantity = ({
    quantity,
    cardCounter,
    handeQtyIncrease,
    handleQtyDecrease,
}) => {
    return (
        <div className="flex items-center gap-3">
            {!cardCounter && (
                <span className="text-sm font-semibold text-gray-900">
                    Quantity
                </span>
            )}

            <div className="flex h-9 items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={handleQtyDecrease}
                    className="flex h-full w-9 items-center justify-center text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                    aria-label="Decrease quantity"
                >
                    −
                </button>

                <span className="flex h-full w-9 items-center justify-center border-x border-gray-200 text-[13px] font-semibold text-gray-900">
                    {quantity}
                </span>

                <button
                    type="button"
                    onClick={handeQtyIncrease}
                    className="flex h-full w-9 items-center justify-center text-gray-500 transition hover:bg-gray-50"
                    aria-label="Increase quantity"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default SetQuantity;