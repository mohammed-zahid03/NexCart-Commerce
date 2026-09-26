import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { formatPrice } from "../../utils/formatPrice";
import toast from "react-hot-toast";

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [trackingOrder, setTrackingOrder] = useState(null);

    const [returnOrderId, setReturnOrderId] = useState(null);
const [returnReason, setReturnReason] = useState("");
const [returnReasonError, setReturnReasonError] = useState("");
   

    useEffect(() => {
        const fetchOrdersAndAddresses = async () => {
            try {
                setLoading(true);
                setError("");

                const [ordersResponse, addressesResponse] =
                    await Promise.all([
                        api.get("/order/users/orders"),
                        api.get("/addresses"),
                    ]);

                setOrders(
                    Array.isArray(ordersResponse.data)
                        ? ordersResponse.data
                        : []
                );

                setAddresses(
                    Array.isArray(addressesResponse.data)
                        ? addressesResponse.data
                        : []
                );
            } catch (error) {
                console.error(
                    "Failed to fetch orders or addresses:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                        "Unable to load your orders. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrdersAndAddresses();
    }, []);

    const formatOrderDate = (date) => {
        if (!date) return "Date unavailable";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "accepted":
            case "order accepted":
                return "border-green-200 bg-green-50 text-green-700";

            case "delivered":
                return "border-blue-200 bg-blue-50 text-blue-700";

            case "shipped":
                return "border-indigo-200 bg-indigo-50 text-indigo-700";

            case "out for delivery":
                return "border-purple-200 bg-purple-50 text-purple-700";

            case "cancelled":
            case "canceled":
                return "border-red-200 bg-red-50 text-red-700";

            case "processing":
                return "border-yellow-200 bg-yellow-50 text-yellow-700";

            default:
                return "border-gray-200 bg-gray-50 text-gray-700";
        }
    };

    /*
     * Determines how far the order has progressed.
     *
     * The current orderStatus remains the source of truth for the
     * current position. statusHistory is used to show the actual
     * recorded status changes and their timestamps.
     *
     * 1 = Order Placed
     * 2 = Payment Confirmed
     * 3 = Order Accepted
     * 4 = Shipped
     * 5 = Out for Delivery
     * 6 = Delivered
     */
    const getTrackingStep = (status) => {
        const normalizedStatus = status?.toLowerCase() || "";

        if (normalizedStatus.includes("cancel")) {
            return 0;
        }

        if (normalizedStatus.includes("delivered")) {
            return 6;
        }

        if (normalizedStatus.includes("out for delivery")) {
            return 5;
        }

        if (normalizedStatus.includes("shipped")) {
            return 4;
        }

        if (
            normalizedStatus.includes("accepted") ||
            normalizedStatus.includes("processing")
        ) {
            return 3;
        }

        if (
            normalizedStatus.includes("payment") ||
            normalizedStatus.includes("confirmed")
        ) {
            return 2;
        }

        return 1;
    };

    const getStatusHistory = (order) => {
        if (!Array.isArray(order?.statusHistory)) {
            return [];
        }

        return [...order.statusHistory]
            .filter((history) => history)
            .sort((a, b) => {
                const dateA = new Date(
                    a.changedAt || a.createdAt || a.timestamp || 0
                ).getTime();

                const dateB = new Date(
                    b.changedAt || b.createdAt || b.timestamp || 0
                ).getTime();

                return dateA - dateB;
            });
    };

    const getHistoryStatus = (history) => {
        return (
            history?.status ||
            history?.orderStatus ||
            history?.statusName ||
            ""
        );
    };

    const getHistoryDate = (history) => {
        return (
            history?.changedAt ||
            history?.createdAt ||
            history?.timestamp ||
            history?.date ||
            null
        );
    };

    const getHistoryStep = (status) => {
        const normalizedStatus = status?.toLowerCase() || "";

        if (normalizedStatus.includes("delivered")) {
            return 6;
        }

        if (normalizedStatus.includes("out for delivery")) {
            return 5;
        }

        if (normalizedStatus.includes("shipped")) {
            return 4;
        }

        if (
            normalizedStatus.includes("accepted") ||
            normalizedStatus.includes("processing")
        ) {
            return 3;
        }

        if (
            normalizedStatus.includes("payment") ||
            normalizedStatus.includes("confirmed")
        ) {
            return 2;
        }

        if (
            normalizedStatus.includes("placed") ||
            normalizedStatus.includes("pending")
        ) {
            return 1;
        }

        return null;
    };

    const getHistoryEntryForStep = (order, stepNumber) => {
        const history = getStatusHistory(order);

        for (let index = history.length - 1; index >= 0; index -= 1) {
            const historyStep = getHistoryStep(
                getHistoryStatus(history[index])
            );

            if (historyStep === stepNumber) {
                return history[index];
            }
        }

        return null;
    };

    const formatTrackingDate = (date) => {
        if (!date) return "";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }

        return parsedDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder((current) =>
            current === orderId ? null : orderId
        );
    };

    const toggleOrderTracking = (orderId) => {
        setTrackingOrder((current) =>
            current === orderId ? null : orderId
        );
    };

const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
        "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
        return;
    }

    try {
        setError("");

        await api.put(`/order/users/orders/${orderId}/cancel`);

        // Refresh orders so status, stock-related data, and
        // statusHistory come from the backend.
        const response = await api.get("/order/users/orders");

        setOrders(
            Array.isArray(response.data)
                ? response.data
                : []
        );

        // Close tracking/details for this order after cancellation.
        setTrackingOrder(null);
        setExpandedOrder(null);

    } catch (error) {
        console.error("Failed to cancel order:", error);

        setError(
            error?.response?.data?.message ||
            "Unable to cancel the order. Please try again."
        );
    }
};


const handleReturnOrder = (orderId) => {
    setReturnOrderId(orderId);
    setReturnReason("");
    setReturnReasonError("");
};

const handleSubmitReturn = async () => {
    if (!returnReason.trim()) {
        setReturnReasonError("Please enter a return reason.");
        return;
    }

    try {
        setError("");
        setReturnReasonError("");

        await api.post(
            `/order/users/orders/${returnOrderId}/return`,
            {
                reason: returnReason.trim(),
            }
        );

        // Refresh orders so the latest backend data is displayed.
        const response = await api.get("/order/users/orders");

        setOrders(
            Array.isArray(response.data)
                ? response.data
                : []
        );

      // Close the return modal.
setReturnOrderId(null);
setReturnReason("");
setReturnReasonError("");

toast.success("Return request submitted successfully.");

// Close tracking/details after submitting the return request.
        setTrackingOrder(null);
        setExpandedOrder(null);

    } catch (error) {
        console.error("Failed to request return:", error);

        setError(
            error?.response?.data?.message ||
            "Unable to request a return. Please try again."
        );
    }
};

    // ==================== LOADING ====================

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 px-6 py-12">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8">
                        <div className="h-9 w-48 animate-pulse rounded bg-gray-200"></div>

                        <div className="mt-3 h-5 w-72 animate-pulse rounded bg-gray-200"></div>
                    </div>

                    <div className="space-y-5">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-gray-200 bg-white p-6"
                            >
                                <div className="animate-pulse space-y-5">
                                    <div className="flex justify-between">
                                        <div className="h-5 w-40 rounded bg-gray-200"></div>

                                        <div className="h-6 w-24 rounded-full bg-gray-200"></div>
                                    </div>

                                    <div className="h-px bg-gray-200"></div>

                                    <div className="space-y-3">
                                        <div className="h-5 w-64 rounded bg-gray-200"></div>

                                        <div className="h-5 w-32 rounded bg-gray-200"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ==================== ERROR ====================

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 px-6 py-12">
                <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-10 text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
                        !
                    </div>

                    <h1 className="text-2xl font-semibold text-gray-900">
                        Unable to load orders
                    </h1>

                    <p className="mt-2 text-gray-600">
                        {error}
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // ==================== MAIN PAGE ====================

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">

                {/* ==================== HEADER ==================== */}

                <div className="mb-8">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="mb-2 text-sm font-medium text-blue-600">
                                My Account
                            </p>

                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                My Orders
                            </h1>

                            <p className="mt-2 text-gray-600">
                                View and track your recent purchases.
                            </p>
                        </div>

                        <Link
                            to="/"
                            className="inline-flex w-fit items-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>

                {/* ==================== EMPTY STATE ==================== */}

                {orders.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                            🛍
                        </div>

                        <h2 className="mt-5 text-2xl font-semibold text-gray-900">
                            No orders yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-gray-600">
                            You haven't placed any orders yet. Start shopping
                            and your orders will appear here.
                        </p>

                        <Link
                            to="/"
                            className="mt-6 inline-flex rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">

                        {/* ==================== ORDERS ==================== */}

                        {orders.map((order) => {
                            const isExpanded =
                                expandedOrder === order.orderId;

                            const isTracking =
                                trackingOrder === order.orderId;

                            const orderAddress = addresses.find(
                                (address) =>
                                    address.addressId === order.addressId
                            );

                            return (
                                <div
                                    key={order.orderId}
                                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                                >

                                    {/* ==================== ORDER HEADER ==================== */}

                                    <div className="bg-gray-50 px-5 py-5 sm:px-6">
                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                            {/* Order information */}

                                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:flex sm:gap-10">

                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                                        Order
                                                    </p>

                                                    <p className="mt-1 font-semibold text-gray-900">
                                                        #{order.orderId}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                                        Placed on
                                                    </p>

                                                    <p className="mt-1 font-medium text-gray-900">
                                                        {formatOrderDate(
                                                            order.orderDate
                                                        )}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                                        Total
                                                    </p>

                                                    <p className="mt-1 font-semibold text-gray-900">
                                                        {formatPrice(
                                                            order.totalAmount
                                                        )}
                                                    </p>
                                                </div>

                                            </div>

                                            {/* Status + buttons */}

                                            <div className="flex flex-wrap items-center gap-3">

                                                <span
                                                    className={`rounded-full border px-3 py-1.5 text-sm font-medium ${getStatusClass(
                                                        order.orderStatus
                                                    )}`}
                                                >
                                                    {order.orderStatus ||
                                                        "Processing"}
                                                </span>

                                                {order.orderStatus?.toLowerCase() === "accepted" && (
    <button
        type="button"
        onClick={() => handleCancelOrder(order.orderId)}
        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
    >
        Cancel Order
    </button>
)}

{order.orderStatus?.toLowerCase() === "delivered" && (
    !order.returnRequest ? (
        <button
            type="button"
            onClick={() => handleReturnOrder(order.orderId)}
            className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-100"
        >
            Return Order
        </button>
    ) : order.returnRequest.status?.toLowerCase() === "requested" ? (
        <button
            type="button"
            disabled
            className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 cursor-default"
        >
            Return Requested
        </button>
    ) : order.returnRequest.status?.toLowerCase() === "approved" ? (
        <button
            type="button"
            disabled
            className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 cursor-default"
        >
            Return Approved
        </button>
    ) : order.returnRequest.status?.toLowerCase() === "rejected" ? (
        <button
            type="button"
            disabled
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 cursor-default"
        >
            Return Rejected
        </button>
    ) : null
)}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleOrderTracking(
                                                            order.orderId
                                                        )
                                                    }
                                                    className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                                >
                                                    {isTracking
                                                        ? "Hide Tracking"
                                                        : "Track Order"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleOrderDetails(
                                                            order.orderId
                                                        )
                                                    }
                                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                                                >
                                                    {isExpanded
                                                        ? "Hide Details"
                                                        : "View Details"}
                                                </button>

                                            </div>

                                        </div>
                                    </div>

                                {/* ==================== ORDER TRACKING ==================== */}

                                {isTracking && (
                                    <div className="border-t border-gray-200 bg-white px-5 py-5 sm:px-6">
                                        <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-5">

                                            {/* Tracking Header */}

                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Track Order
                                                    </h3>

                                                    <p className="text-sm text-gray-500">
                                                        Order #{order.orderId}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                                                        order.orderStatus
                                                    )}`}
                                                >
                                                    {order.orderStatus || "Processing"}
                                                </span>
                                            </div>

                                            {/* Tracking Timeline */}

                                            {order.orderStatus
                                                ?.toLowerCase()
                                                .includes("cancel") ? (
                                                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
                                                    <p className="font-medium text-red-700">
                                                        Order Cancelled
                                                    </p>

                                                    <p className="mt-1 text-sm text-red-600">
                                                        This order is no longer being processed.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="mt-7 overflow-x-auto pb-2">
                                                    <div className="min-w-[720px]">

                                                        <div className="relative">

                                                            {/* Connecting line */}

                                                            <div className="absolute left-[8.33%] right-[8.33%] top-4 h-0.5 bg-gray-300" />

                                                            <div
                                                                className="absolute left-[8.33%] top-4 h-0.5 bg-green-500 transition-all duration-300"
                                                                style={{
                                                                    width: `${Math.max(
                                                                        0,
                                                                        ((getTrackingStep(
                                                                            order.orderStatus
                                                                        ) -
                                                                            1) /
                                                                            5) *
                                                                            83.34
                                                                    )}%`,
                                                                }}
                                                            />

                                                            {/* Step columns */}

                                                            <div className="relative grid grid-cols-6">

                                                                {[
                                                                    "Order Placed",
                                                                    "Payment Confirmed",
                                                                    "Order Accepted",
                                                                    "Shipped",
                                                                    "Out for Delivery",
                                                                    "Delivered",
                                                                ].map((step, index) => {
                                                                    const currentStep =
                                                                        getTrackingStep(
                                                                            order.orderStatus
                                                                        );

                                                                    const stepNumber =
                                                                        index + 1;

                                                                    const historyEntry =
                                                                        getHistoryEntryForStep(
                                                                            order,
                                                                            stepNumber
                                                                        );

                                                                    /*
                                                                     * The first two steps are based on data already
                                                                     * available outside statusHistory. Order-status
                                                                     * changes after that use the real backend history.
                                                                     */
                                                                    const hasRecordedStep =
                                                                        stepNumber === 1
                                                                            ? Boolean(order.orderDate)
                                                                            : stepNumber === 2
                                                                            ? Boolean(
                                                                                  order.payment?.pgStatus &&
                                                                                      order.payment.pgStatus.toLowerCase() ===
                                                                                          "succeeded"
                                                                              )
                                                                            : Boolean(historyEntry);

                                                                    const isCompleted =
                                                                        stepNumber <= currentStep ||
                                                                        hasRecordedStep;

                                                                    const isCurrent =
                                                                        stepNumber === currentStep;

                                                                    const historyDate =
                                                                        stepNumber === 1
                                                                            ? order.orderDate
                                                                            : getHistoryDate(
                                                                                  historyEntry
                                                                              );

                                                                    return (
                                                                        <div
                                                                            key={step}
                                                                            className="flex flex-col items-center text-center"
                                                                        >

                                                                            {/* Circle */}

                                                                            <div
                                                                                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                                                                                    isCompleted
                                                                                        ? "bg-green-600 text-white"
                                                                                        : "border-2 border-gray-300 bg-white text-gray-400"
                                                                                }`}
                                                                            >
                                                                                {isCompleted
                                                                                    ? "✓"
                                                                                    : stepNumber}
                                                                            </div>

                                                                            {/* Label */}

                                                                            <p
                                                                                className={`mt-3 max-w-[110px] text-xs font-medium leading-5 ${
                                                                                    isCompleted
                                                                                        ? "text-gray-900"
                                                                                        : "text-gray-400"
                                                                                }`}
                                                                            >
                                                                                {step}
                                                                            </p>

                                                                            {/* Recorded date */}

                                                                            {historyDate && (
                                                                                <p className="mt-1 max-w-[130px] text-[10px] leading-4 text-gray-500">
                                                                                    {formatTrackingDate(
                                                                                        historyDate
                                                                                    )}
                                                                                </p>
                                                                            )}

                                                                            {/* Current status */}

                                                                            {isCurrent && (
                                                                                <p className="mt-1 text-[11px] font-medium text-green-600">
                                                                                    Current status
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}

                                                            </div>
                                                        </div>

                                                        {/* Backend status history */}

                                                        {getStatusHistory(order).length > 0 && (
                                                            <div className="mt-8 border-t border-gray-200 pt-5">
                                                                <h4 className="text-sm font-semibold text-gray-900">
                                                                    Status History
                                                                </h4>

                                                                <p className="mt-1 text-xs text-gray-500">
                                                                    Updates recorded for this order.
                                                                </p>

                                                                <div className="mt-4 space-y-3">
                                                                    {getStatusHistory(order)
                                                                        .slice()
                                                                        .reverse()
                                                                        .map((history, index) => {
                                                                            const historyStatus =
                                                                                getHistoryStatus(
                                                                                    history
                                                                                );

                                                                            const historyDate =
                                                                                getHistoryDate(
                                                                                    history
                                                                                );

                                                                            return (
                                                                                <div
                                                                                    key={
                                                                                        history?.id ||
                                                                                        history?.statusHistoryId ||
                                                                                        `${historyStatus}-${historyDate}-${index}`
                                                                                    }
                                                                                    className="flex items-start gap-3"
                                                                                >
                                                                                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-green-600" />

                                                                                    <div className="min-w-0 flex-1">
                                                                                        <p className="text-sm font-medium text-gray-900">
                                                                                            {historyStatus ||
                                                                                                "Status updated"}
                                                                                        </p>

                                                                                        {historyDate && (
                                                                                            <p className="mt-0.5 text-xs text-gray-500">
                                                                                                {formatTrackingDate(
                                                                                                    historyDate
                                                                                                )}
                                                                                            </p>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                )}

                                    {/* ==================== PRODUCTS ==================== */}

                                    <div className="divide-y divide-gray-100">

                                        {order.orderItems?.map((item) => {
                                            const product = item.product;

                                            const itemPrice =
                                                item.orderedProductPrice ??
                                                item.specialPrice ??
                                                item.price ??
                                                0;

                                            const quantity =
                                                item.quantity || 1;

                                            return (
                                                <div
                                                    key={item.orderItemId}
                                                    className="flex gap-4 px-5 py-5 sm:px-6"
                                                >

                                                    {/* Product image */}

                                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 sm:h-24 sm:w-24">

                                                        {product?.image ? (
                                                            <img
                                                                src={`${import.meta.env.VITE_BACK_END_URL}/images/${product.image}`}
                                                                alt={
                                                                    product.productName
                                                                }
                                                                className="h-full w-full object-contain"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    e.currentTarget.style.display =
                                                                        "none";
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="text-xs text-gray-400">
                                                                No image
                                                            </span>
                                                        )}

                                                    </div>

                                                    {/* Product information */}

                                                    <div className="min-w-0 flex-1">

                                                        <h3 className="font-semibold text-gray-900">
                                                            {product?.productName ||
                                                                "Product"}
                                                        </h3>

                                                        <p className="mt-1 text-sm text-gray-500">
                                                            Quantity:{" "}
                                                            {quantity}
                                                        </p>

                                                        <p className="mt-1 text-sm text-gray-500">
                                                            Price:{" "}
                                                            {formatPrice(
                                                                itemPrice
                                                            )}
                                                        </p>

                                                    </div>

                                                    {/* Item total */}

                                                    <div className="text-right">

                                                        <p className="font-semibold text-gray-900">
                                                            {formatPrice(
                                                                itemPrice *
                                                                    quantity
                                                            )}
                                                        </p>

                                                        {item.discount > 0 && (
                                                            <p className="mt-1 text-sm text-green-600">
                                                                Save{" "}
                                                                {formatPrice(
                                                                    item.discount
                                                                )}
                                                            </p>
                                                        )}

                                                    </div>

                                                </div>
                                            );
                                        })}

                                    </div>

                                    {/* ==================== PAYMENT / TOTAL ==================== */}

                                    <div className="border-t border-gray-200 px-5 py-5 sm:px-6">
                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                                            {/* Payment */}

                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Payment
                                                </p>

                                                <p className="mt-1 font-medium text-gray-900">
                                                    {order.payment?.pgName ||
                                                        order.payment
                                                            ?.paymentMethod ||
                                                        "Online"}
                                                </p>

                                                {order.payment?.pgStatus && (
                                                    <p className="mt-1 text-sm font-medium text-green-600">
                                                        {order.payment.pgStatus}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Total */}

                                            <div className="text-left sm:text-right">
                                                <p className="text-sm text-gray-500">
                                                    Order total
                                                </p>

                                                <p className="mt-1 text-xl font-bold text-gray-900">
                                                    {formatPrice(
                                                        order.totalAmount
                                                    )}
                                                </p>
                                            </div>

                                        </div>
                                    </div>

                                    {/* ==================== EXPANDED DETAILS ==================== */}

                                    {isExpanded && (
                                        <div className="border-t border-gray-200 bg-gray-50 px-5 py-6 sm:px-6">

                                            {/* ==================== ORDER + PAYMENT ==================== */}

                                            <div className="grid gap-6 md:grid-cols-2">

                                                {/* Order Information */}

                                                <div className="rounded-xl border border-gray-200 bg-white p-5">

                                                    <h3 className="text-base font-semibold text-gray-900">
                                                        Order Information
                                                    </h3>

                                                    <div className="mt-4 space-y-3 text-sm">

                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-gray-500">
                                                                Order ID
                                                            </span>

                                                            <span className="font-medium text-gray-900">
                                                                #{order.orderId}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-gray-500">
                                                                Order date
                                                            </span>

                                                            <span className="font-medium text-gray-900">
                                                                {formatOrderDate(
                                                                    order.orderDate
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-gray-500">
                                                                Status
                                                            </span>

                                                            <span className="font-medium text-gray-900">
                                                                {order.orderStatus ||
                                                                    "Processing"}
                                                            </span>
                                                        </div>

                                                    </div>

                                                </div>

                                                {/* Payment Information */}

                                                <div className="rounded-xl border border-gray-200 bg-white p-5">

                                                    <h3 className="text-base font-semibold text-gray-900">
                                                        Payment Information
                                                    </h3>

                                                    <div className="mt-4 space-y-3 text-sm">

                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-gray-500">
                                                                Method
                                                            </span>

                                                            <span className="font-medium text-gray-900">
                                                                {order.payment?.pgName ||
                                                                    order.payment
                                                                        ?.paymentMethod ||
                                                                    "Online"}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-gray-500">
                                                                Status
                                                            </span>

                                                            <span className="font-medium text-green-600">
                                                                {order.payment
                                                                    ?.pgStatus ||
                                                                    "Unavailable"}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-gray-500">
                                                                Amount paid
                                                            </span>

                                                            <span className="font-semibold text-gray-900">
                                                                {formatPrice(
                                                                    order.totalAmount
                                                                )}
                                                            </span>
                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                            {/* ==================== DELIVERY ==================== */}

                                            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">

                                                <h3 className="text-base font-semibold text-gray-900">
                                                    Delivery
                                                </h3>

                                                {orderAddress ? (
                                                    <div className="mt-4 text-sm leading-6 text-gray-700">

                                                        {orderAddress.buildingName && (
                                                            <p>
                                                                {
                                                                    orderAddress.buildingName
                                                                }
                                                            </p>
                                                        )}

                                                        {orderAddress.street && (
                                                            <p>
                                                                {
                                                                    orderAddress.street
                                                                }
                                                            </p>
                                                        )}

                                                        {(orderAddress.city ||
                                                            orderAddress.state) && (
                                                            <p>
                                                                {[
                                                                    orderAddress.city,
                                                                    orderAddress.state,
                                                                ]
                                                                    .filter(
                                                                        Boolean
                                                                    )
                                                                    .join(", ")}
                                                            </p>
                                                        )}

                                                        {(orderAddress.pincode ||
                                                            orderAddress.country) && (
                                                            <p>
                                                                {[
                                                                    orderAddress.pincode,
                                                                    orderAddress.country,
                                                                ]
                                                                    .filter(
                                                                        Boolean
                                                                    )
                                                                    .join(", ")}
                                                            </p>
                                                        )}

                                                    </div>
                                                ) : (
                                                    <p className="mt-4 text-sm text-gray-500">
                                                        Delivery address
                                                        unavailable.
                                                    </p>
                                                )}

                                            </div>

                                            {/* ==================== ORDER TOTAL ==================== */}

                                            <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4">

                                                <span className="font-semibold text-gray-900">
                                                    Order Total
                                                </span>

                                                <span className="text-lg font-bold text-gray-900">
                                                    {formatPrice(
                                                        order.totalAmount
                                                    )}
                                                </span>

                                            </div>

                                        </div>
                                    )}

                                </div>
                            );
                        })}

                    </div>
                )}

                      </div>

            {/* ==================== RETURN ORDER MODAL ==================== */}

            {returnOrderId && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    onClick={() => {
                        setReturnOrderId(null);
                        setReturnReason("");
                        setReturnReasonError("");
                    }}
                >
                    <div
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* Header */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Return Order
                            </h2>

                            <p className="mt-2 text-sm leading-5 text-gray-600">
                                Please tell us why you want to return this
                                order.
                            </p>
                        </div>

                        {/* Reason field */}
                        <div className="mt-6">
                            <label
                                htmlFor="return-reason"
                                className="mb-2 block text-sm font-medium text-gray-900"
                            >
                                Return reason
                            </label>

                            <textarea
                                id="return-reason"
                                value={returnReason}
                                onChange={(event) => {
                                    setReturnReason(event.target.value);

                                    if (event.target.value.trim()) {
                                        setReturnReasonError("");
                                    }
                                }}
                                placeholder="Please enter your return reason..."
                                rows={4}
                                className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                                    returnReasonError
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                        : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                                }`}
                                autoFocus
                            />

                            {returnReasonError && (
                                <p className="mt-2 text-sm text-red-600">
                                    {returnReasonError}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setReturnOrderId(null);
                                    setReturnReason("");
                                    setReturnReasonError("");
                                }}
                                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmitReturn}
                                className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                            >
                                Submit Return
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserOrders;