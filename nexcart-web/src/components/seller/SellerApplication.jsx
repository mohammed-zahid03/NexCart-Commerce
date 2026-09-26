import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { submitSellerApplication } from "../../store/actions";

const SellerApplication = () => {
    const [storeName, setStoreName] = useState("");
    const [businessDescription, setBusinessDescription] = useState("");
    const [loader, setLoader] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (storeName.trim().length < 2) {
            toast.error("Store name must be at least 2 characters");
            return;
        }

        if (businessDescription.trim().length < 10) {
            toast.error(
                "Business description must be at least 10 characters"
            );
            return;
        }

        await dispatch(
            submitSellerApplication(
                {
                    storeName: storeName.trim(),
                    businessDescription: businessDescription.trim(),
                },
                toast,
                navigate,
                setLoader
            )
        );
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">

                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                        Become a Seller
                    </h1>

                    <p className="text-slate-600 mt-2">
                        Submit your seller application. An admin will review
                        your application before you can start selling.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label
                            htmlFor="storeName"
                            className="block text-sm font-semibold text-slate-700 mb-2"
                        >
                            Store Name
                        </label>

                        <input
                            id="storeName"
                            type="text"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            placeholder="Enter your store name"
                            minLength={2}
                            maxLength={100}
                            required
                            disabled={loader}
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-slate-500 transition disabled:bg-slate-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="businessDescription"
                            className="block text-sm font-semibold text-slate-700 mb-2"
                        >
                            Business Description
                        </label>

                        <textarea
                            id="businessDescription"
                            value={businessDescription}
                            onChange={(e) =>
                                setBusinessDescription(e.target.value)
                            }
                            placeholder="Tell us about your business..."
                            minLength={10}
                            maxLength={1000}
                            required
                            rows={6}
                            disabled={loader}
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-slate-500 transition resize-none disabled:bg-slate-100"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">

                        <Link
                            to="/"
                            className="px-5 py-3 text-center border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={loader}
                            className="px-5 py-3 bg-button-gradient text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loader
                                ? "Submitting..."
                                : "Submit Application"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default SellerApplication;