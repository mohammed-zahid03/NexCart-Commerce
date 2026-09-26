import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../../shared/Loader";
import ErrorPage from "../../shared/ErrorPage";
import {
    getAllSellerApplications,
    approveSellerApplication,
    rejectSellerApplication,
} from "../../../store/actions";

const SellerApplications = () => {
    const dispatch = useDispatch();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [actionLoading, setActionLoading] = useState(null);
    const [adminNotes, setAdminNotes] = useState({});

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const data = await dispatch(
                getAllSellerApplications()
            );

            setApplications(
                Array.isArray(data)
                    ? data
                    : data?.content || []
            );
        } catch (error) {
            console.log(error);

            const message =
                error?.response?.data?.message ||
                "Failed to fetch seller applications";

            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleNoteChange = (applicationId, value) => {
        setAdminNotes((prev) => ({
            ...prev,
            [applicationId]: value,
        }));
    };

    const handleApprove = async (applicationId) => {
        try {
            setActionLoading(applicationId);

            await dispatch(
                approveSellerApplication(
                    applicationId,
                    adminNotes[applicationId] || "",
                    toast
                )
            );

            await fetchApplications();
        } catch (error) {
            console.log(error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (applicationId) => {
        try {
            setActionLoading(applicationId);

            await dispatch(
                rejectSellerApplication(
                    applicationId,
                    adminNotes[applicationId] || "",
                    toast
                )
            );

            await fetchApplications();
        } catch (error) {
            console.log(error);
        } finally {
            setActionLoading(null);
        }
    };

    if (errorMessage) {
        return <ErrorPage message={errorMessage} />;
    }

    return (
        <React.Fragment>

            <div className="pt-6 pb-6">
                <h1 className="text-slate-800 text-3xl text-center font-bold uppercase">
                    Seller Applications
                </h1>

                <p className="text-center text-slate-500 mt-2">
                    Review and manage seller applications.
                </p>
            </div>

            {loading ? (
                <Loader />
            ) : applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-gray-600 py-10">
                    <h2 className="text-2xl font-semibold">
                        No Seller Applications
                    </h2>

                    <p className="mt-2">
                        There are currently no seller applications to review.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <div className="min-w-[1200px]">

                        <table className="w-full border-collapse border border-slate-200">

                            <thead>
                                <tr className="bg-slate-100">

                                    <th className="border border-slate-200 px-4 py-3 text-left">
                                        Store Name
                                    </th>

                                    <th className="border border-slate-200 px-4 py-3 text-left">
                                        Username
                                    </th>

                                    <th className="border border-slate-200 px-4 py-3 text-left">
                                        Email
                                    </th>

                                    <th className="border border-slate-200 px-4 py-3 text-left">
                                        Description
                                    </th>

                                    <th className="border border-slate-200 px-4 py-3 text-left">
                                        Status
                                    </th>

                                    <th className="border border-slate-200 px-4 py-3 text-left">
                                        Submitted
                                    </th>

                                    <th className="border border-slate-200 px-4 py-3 text-left">
                                        Admin Note
                                    </th>

                                    <th className="border border-slate-200 px-4 py-3 text-left">
                                        Actions
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {applications.map((application) => (

                                    <tr
                                        key={application.applicationId}
                                        className="hover:bg-slate-50"
                                    >

                                        <td className="border border-slate-200 px-4 py-3 font-semibold">
                                            {application.storeName}
                                        </td>

                                        <td className="border border-slate-200 px-4 py-3">
                                            {application.username}
                                        </td>

                                        <td className="border border-slate-200 px-4 py-3">
                                            {application.email || "N/A"}
                                        </td>

                                        <td className="border border-slate-200 px-4 py-3 max-w-xs">
                                            {application.businessDescription}
                                        </td>

                                        <td className="border border-slate-200 px-4 py-3">
                                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                                                {application.status}
                                            </span>
                                        </td>

                                        <td className="border border-slate-200 px-4 py-3">
                                            {application.createdAt
                                                ? new Date(
                                                    application.createdAt
                                                ).toLocaleString()
                                                : "N/A"}
                                        </td>

                                        <td className="border border-slate-200 px-4 py-3">
                                            <textarea
                                                value={
                                                    adminNotes[
                                                        application.applicationId
                                                    ] || ""
                                                }
                                                onChange={(e) =>
                                                    handleNoteChange(
                                                        application.applicationId,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Optional note"
                                                rows="2"
                                                className="w-48 border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-400"
                                                disabled={
                                                    actionLoading ===
                                                    application.applicationId
                                                }
                                            />
                                        </td>

                                        <td className="border border-slate-200 px-4 py-3">

                                            <div className="flex flex-col gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleApprove(
                                                            application.applicationId
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading ===
                                                        application.applicationId
                                                    }
                                                    className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {actionLoading ===
                                                    application.applicationId
                                                        ? "Processing..."
                                                        : "Approve"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleReject(
                                                            application.applicationId
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading ===
                                                        application.applicationId
                                                    }
                                                    className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Reject
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                </div>
            )}

        </React.Fragment>
    );
};

export default SellerApplications;