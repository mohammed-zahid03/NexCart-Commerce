import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { getMySellerApplication } from "../../store/actions";

const SellerApplicationStatus = () => {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                setLoading(true);

                const data = await dispatch(
                    getMySellerApplication()
                );

                setApplication(data);
            } catch (error) {
                console.log(error);

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch seller application"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [dispatch]);

    const getStatusStyles = (status) => {
        switch (status) {
            case "APPROVED":
                return "bg-green-100 text-green-700";

            case "REJECTED":
                return "bg-red-100 text-red-700";

            case "PENDING":
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <p className="text-slate-600 font-semibold">
                    Loading application status...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">

                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                        Seller Application Status
                    </h1>

                    <p className="text-slate-600 mt-2">
                        Check the current status of your seller application.
                    </p>
                </div>

                {!application ? (
                    <div className="text-center py-10">
                        <h2 className="text-xl font-semibold text-slate-800">
                            No Application Found
                        </h2>

                        <p className="text-slate-600 mt-2 mb-6">
                            You have not submitted a seller application yet.
                        </p>

                        <Link
                            to="/seller-application"
                            className="inline-block px-5 py-3 bg-button-gradient text-white rounded-lg font-semibold hover:opacity-90 transition"
                        >
                            Become a Seller
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">

                            <h2 className="text-xl font-semibold text-slate-800">
                                {application.storeName}
                            </h2>

                            <span
                                className={`w-fit px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyles(
                                    application.status
                                )}`}
                            >
                                {application.status}
                            </span>

                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-700 mb-2">
                                Business Description
                            </h3>

                            <p className="text-slate-600 leading-relaxed">
                                {application.businessDescription}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-700 mb-2">
                                Submitted On
                            </h3>

                            <p className="text-slate-600">
                                {application.createdAt
                                    ? new Date(
                                        application.createdAt
                                    ).toLocaleString()
                                    : "N/A"}
                            </p>
                        </div>

                        {application.reviewedAt && (
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                                    Reviewed On
                                </h3>

                                <p className="text-slate-600">
                                    {new Date(
                                        application.reviewedAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                        )}

                        {application.status === "PENDING" && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-yellow-800">
                                    Your application is currently being
                                    reviewed by an administrator.
                                </p>
                            </div>
                        )}

                        {application.status === "APPROVED" && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-green-800">
                                    Congratulations! Your seller application
                                    has been approved.
                                </p>

                                <Link
                                    to="/seller"
                                    className="inline-block mt-4 px-5 py-3 bg-button-gradient text-white rounded-lg font-semibold hover:opacity-90 transition"
                                >
                                    Go to Seller Dashboard
                                </Link>
                            </div>
                        )}

                        {application.status === "REJECTED" && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-800 font-semibold">
                                    Your seller application was rejected.
                                </p>

                                {application.adminNote && (
                                    <p className="text-red-700 mt-2">
                                        Admin Note: {application.adminNote}
                                    </p>
                                )}

                                <Link
                                    to="/seller-application"
                                    className="inline-block mt-4 px-5 py-3 border border-red-300 text-red-700 rounded-lg font-semibold hover:bg-red-50 transition"
                                >
                                    Submit New Application
                                </Link>
                            </div>
                        )}

                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-200">
                    <Link
                        to="/"
                        className="text-slate-600 hover:text-slate-800 font-semibold"
                    >
                        ← Back to Home
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default SellerApplicationStatus;