import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
    Plus,
    ArrowRight,
    MapPin,
    UserRound,
    Mail,
    ShoppingBag,
    ShieldCheck,
    ChevronRight,
    Edit3,
    Trash2,
} from "lucide-react";

import AddAddressForm from "../checkout/AddAddressForm";
import AddressInfoModal from "../checkout/AddressInfoModal";
import { DeleteModal } from "../checkout/DeleteModal";

import {
    deleteUserAddress,
} from "../../store/actions";

import api from "../../api/api";

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const { btnLoader } = useSelector((state) => state.errors);

    const dispatch = useDispatch();

    const [addresses, setAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [addressError, setAddressError] = useState("");

    const [openAddressModal, setOpenAddressModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const isAdmin = user?.roles?.includes("ROLE_ADMIN");
    const isSeller = user?.roles?.includes("ROLE_SELLER");

    const accountType = isAdmin
        ? "Administrator"
        : isSeller
        ? "Seller"
        : "Customer";

    /*
     * ============================================================
     * FETCH ADDRESSES
     * ============================================================
     */

    const fetchAddresses = useCallback(async () => {
        try {
            setLoadingAddresses(true);
            setAddressError("");

            const response = await api.get("/users/addresses");

            setAddresses(
                Array.isArray(response.data) ? response.data : []
            );
        } catch (error) {
            console.error("Failed to fetch user addresses:", error);

            setAddressError(
                error?.response?.data?.message ||
                    "Unable to load your addresses."
            );
        } finally {
            setLoadingAddresses(false);
        }
    }, []);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    /*
     * ============================================================
     * ADDRESS MODAL
     * ============================================================
     */

    const openNewAddressModal = () => {
        setSelectedAddress(null);
        setOpenAddressModal(true);
    };

    const openEditAddressModal = (address) => {
        setSelectedAddress(address);
        setOpenAddressModal(true);
    };

    const closeAddressModal = (value) => {
        setOpenAddressModal(value);

        if (!value) {
            fetchAddresses();
        }
    };

    /*
     * ============================================================
     * DELETE ADDRESS
     * ============================================================
     */

    const openRemoveAddressModal = (address) => {
        setSelectedAddress(address);
        setOpenDeleteModal(true);
    };

    const closeDeleteModal = (value) => {
        setOpenDeleteModal(value);

        if (!value) {
            fetchAddresses();
        }
    };

    const deleteAddressHandler = () => {
        if (!selectedAddress?.addressId) return;

        dispatch(
            deleteUserAddress(
                toast,
                selectedAddress.addressId,
                closeDeleteModal
            )
        );
    };

    /*
     * ============================================================
     * USER GUARD
     * ============================================================
     */

    if (!user) {
        return null;
    }

    return (
        <main className="min-h-screen bg-[#faf9f6] text-[#151515]">

            <div className="mx-auto w-full max-w-[1030px] px-5 pb-16 pt-8 sm:px-7 lg:pt-9">

                {/* =====================================================
                    PROFILE HEADER
                ====================================================== */}

                <section className="border-b border-[#e6e1d8] pb-7">
                    <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

                        {/* Left */}
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#64748b]">
                                My Account
                            </p>

                            <h1 className="mt-4 font-serif text-[42px] font-normal leading-[0.98] tracking-[-0.035em] text-[#151515] sm:text-[48px]">
                                My Profile
                            </h1>

                            <p className="mt-4 text-[15px] leading-6 text-[#64748b] sm:text-[16px]">
                                Manage your account details, orders and
                                delivery addresses — all in one place.
                            </p>
                        </div>

                        {/* Right account identity */}
                        <div className="flex items-center gap-4 sm:pr-1">

                            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#ded9d0] bg-[#f0eee9]">
                                <UserRound
                                    size={22}
                                    strokeWidth={1.5}
                                    className="text-[#55514b]"
                                />
                            </div>

                            <div>
                                <p className="text-[16px] font-medium text-[#151515]">
                                    {user.username || "Account"}
                                </p>

                                <p className="mt-1 text-[14px] text-[#77736d]">
                                    {accountType}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    ACCOUNT OVERVIEW
                ====================================================== */}

                <section className="pt-7">
                    <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-[#64748b]">
                        Account Overview
                    </p>

                    <div className="overflow-hidden rounded-[16px] border border-[#e4dfd7] bg-white">

                        {/* Row 1 */}
                        <div className="grid md:grid-cols-2">

                            {/* Username */}
                            <div className="border-b border-[#e8e3db] p-6 md:border-r">
                                <div className="flex items-center gap-4">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f2f0ec]">
                                        <UserRound
                                            size={19}
                                            strokeWidth={1.5}
                                            className="text-[#55514b]"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8a867f]">
                                            Username
                                        </p>

                                        <p className="mt-2 truncate text-[16px] font-medium text-[#151515]">
                                            {user.username || "Not available"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="border-b border-[#e8e3db] p-6">
                                <div className="flex items-center gap-4">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f2f0ec]">
                                        <Mail
                                            size={19}
                                            strokeWidth={1.5}
                                            className="text-[#55514b]"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8a867f]">
                                            Email
                                        </p>

                                        <p className="mt-2 truncate text-[16px] font-medium text-[#151515]">
                                            {user.email || "Not available"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="grid md:grid-cols-2">

                            {/* User ID */}
                            <div className="border-b border-[#e8e3db] p-6 md:border-b-0 md:border-r">
                                <div className="flex items-center gap-4">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f2f0ec]">
                                        <span className="text-[17px] font-medium text-[#55514b]">
                                            #
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8a867f]">
                                            User ID
                                        </p>

                                        <p className="mt-2 text-[16px] font-medium text-[#151515]">
                                            #{user.id}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Account Type */}
                            <div className="p-6">
                                <div className="flex items-center gap-4">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f2f0ec]">
                                        <ShieldCheck
                                            size={19}
                                            strokeWidth={1.5}
                                            className="text-[#55514b]"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8a867f]">
                                            Account Type
                                        </p>

                                        <p className="mt-2 text-[16px] font-medium text-[#151515]">
                                            {accountType}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    QUICK ACCESS
                ====================================================== */}

                <section className="pt-8">
                    <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-[#64748b]">
                        Quick Access
                    </p>

                    <div className="grid gap-4 md:grid-cols-2">

                        {/* My Orders */}
                        <Link
                            to="/profile/orders"
                            className="
                                group
                                flex items-center justify-between
                                rounded-[15px]
                                border border-[#e4dfd7]
                                bg-white
                                px-6 py-5
                                transition-all duration-200
                                hover:border-[#d3cdc3]
                                hover:bg-[#fdfcf9]
                            "
                        >
                            <div className="flex items-center gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f2f0ec]">
                                    <ShoppingBag
                                        size={19}
                                        strokeWidth={1.5}
                                        className="text-[#55514b]"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-[16px] font-medium text-[#151515]">
                                        My Orders
                                    </h2>

                                    <p className="mt-1 text-[13px] text-[#77736d]">
                                        View and track your purchases.
                                    </p>
                                </div>
                            </div>

                            <ArrowRight
                                size={18}
                                strokeWidth={1.5}
                                className="text-[#76716a] transition-transform duration-200 group-hover:translate-x-1"
                            />
                        </Link>

                        {/* My Addresses */}
                        <a
                            href="#addresses"
                            className="
                                group
                                flex items-center justify-between
                                rounded-[15px]
                                border border-[#e4dfd7]
                                bg-white
                                px-6 py-5
                                transition-all duration-200
                                hover:border-[#d3cdc3]
                                hover:bg-[#fdfcf9]
                            "
                        >
                            <div className="flex items-center gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f2f0ec]">
                                    <MapPin
                                        size={19}
                                        strokeWidth={1.5}
                                        className="text-[#55514b]"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-[16px] font-medium text-[#151515]">
                                        My Addresses
                                    </h2>

                                    <p className="mt-1 text-[13px] text-[#77736d]">
                                        Manage your saved delivery addresses.
                                    </p>
                                </div>
                            </div>

                            <ChevronRight
                                size={18}
                                strokeWidth={1.5}
                                className="text-[#76716a] transition-transform duration-200 group-hover:translate-x-1"
                            />
                        </a>
                    </div>
                </section>

                {/* =====================================================
                    SAVED ADDRESSES
                ====================================================== */}

                <section id="addresses" className="pt-9">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#64748b]">
                                Delivery
                            </p>

                            <h2 className="mt-3 font-serif text-[32px] font-normal tracking-[-0.03em] text-[#151515] sm:text-[34px]">
                                Saved Addresses
                            </h2>

                            <p className="mt-2 text-[14px] text-[#77736d]">
                                Manage your delivery locations.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">

                            <span className="text-[13px] text-[#8a867f]">
                                {addresses.length}{" "}
                                {addresses.length === 1
                                    ? "address"
                                    : "addresses"}
                            </span>

                            <button
                                type="button"
                                onClick={openNewAddressModal}
                                className="
                                    inline-flex items-center gap-2
                                    rounded-full
                                    bg-[#151515]
                                    px-5 py-2.5
                                    text-[13px] font-medium text-white
                                    transition-colors duration-200
                                    hover:bg-[#2a2a2a]
                                "
                            >
                                <Plus size={16} strokeWidth={2} />
                                Add Address
                            </button>
                        </div>
                    </div>

                    {/* Address content */}

                    <div className="mt-5">

                        {loadingAddresses ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="h-[160px] animate-pulse rounded-[15px] bg-[#f0eee9]" />
                                <div className="h-[160px] animate-pulse rounded-[15px] bg-[#f0eee9]" />
                            </div>
                        ) : addressError ? (
                            <div className="rounded-[15px] border border-[#ead7d4] bg-[#fffaf9] px-6 py-10 text-center">
                                <p className="text-[14px] text-[#8c5b55]">
                                    {addressError}
                                </p>
                            </div>
                        ) : addresses.length === 0 ? (
                            <div className="rounded-[15px] border border-dashed border-[#d8d2ca] bg-[#fcfbf8] px-6 py-12 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f0eee9]">
                                    <MapPin
                                        size={20}
                                        strokeWidth={1.5}
                                        className="text-[#77736d]"
                                    />
                                </div>

                                <h3 className="mt-4 text-[16px] font-medium text-[#151515]">
                                    No saved addresses
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-[13px] leading-6 text-[#77736d]">
                                    Add a delivery address to make checkout
                                    faster.
                                </p>

                                <button
                                    type="button"
                                    onClick={openNewAddressModal}
                                    className="mt-5 rounded-full bg-[#151515] px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#2a2a2a]"
                                >
                                    Add Address
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">

                                {addresses.map((address, index) => (
                                    <div
                                        key={address.addressId || index}
                                        className="
                                            group
                                            relative
                                            rounded-[15px]
                                            border border-[#e5e0d8]
                                            bg-white
                                            p-5
                                            transition-all duration-200
                                            hover:border-[#d2ccc3]
                                        "
                                    >

                                        {/* Top row */}

                                        <div className="flex items-start gap-4">

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f2f0ec]">
                                                <MapPin
                                                    size={19}
                                                    strokeWidth={1.6}
                                                    className="text-[#55514b]"
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <div className="flex flex-wrap items-center gap-2 pr-24">

                                                    <p className="text-[15px] font-medium text-[#151515]">
                                                        {address.buildingName ||
                                                            "Saved Address"}
                                                    </p>

                                                    {index === 0 && (
                                                        <span className="rounded-full bg-[#f1f0ec] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[#64605a]">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mt-2 space-y-0.5 text-[13px] leading-5 text-[#68645e]">

                                                    {address.street && (
                                                        <p>{address.street}</p>
                                                    )}

                                                    {(address.city ||
                                                        address.state) && (
                                                        <p>
                                                            {[
                                                                address.city,
                                                                address.state,
                                                            ]
                                                                .filter(Boolean)
                                                                .join(", ")}
                                                        </p>
                                                    )}

                                                    {(address.pincode ||
                                                        address.country) && (
                                                        <p>
                                                            {[
                                                                address.pincode,
                                                                address.country,
                                                            ]
                                                                .filter(Boolean)
                                                                .join(", ")}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}

                                        <div className="absolute right-5 top-5 flex items-center gap-4">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEditAddressModal(
                                                        address
                                                    )
                                                }
                                                className="inline-flex items-center gap-1.5 text-[13px] text-[#45413d] transition-colors hover:text-[#151515]"
                                            >
                                                <Edit3
                                                    size={15}
                                                    strokeWidth={1.7}
                                                />
                                                Edit
                                            </button>

                                            <span className="h-4 w-px bg-[#e0dbd3]" />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openRemoveAddressModal(
                                                        address
                                                    )
                                                }
                                                className="inline-flex items-center gap-1.5 text-[13px] text-[#45413d] transition-colors hover:text-[#151515]"
                                            >
                                                <Trash2
                                                    size={15}
                                                    strokeWidth={1.7}
                                                />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}
                    </div>
                </section>

                {/* =====================================================
                    ADD / EDIT ADDRESS MODAL
                ====================================================== */}

                <AddressInfoModal
                    open={openAddressModal}
                    setOpen={closeAddressModal}
                >
                    <AddAddressForm
                        address={selectedAddress}
                        setOpenAddressModal={closeAddressModal}
                    />
                </AddressInfoModal>

                {/* =====================================================
                    DELETE ADDRESS MODAL
                ====================================================== */}

                <DeleteModal
                    open={openDeleteModal}
                    loader={btnLoader}
                    setOpen={closeDeleteModal}
                    title="Delete Address"
                    onDeleteHandler={deleteAddressHandler}
                />

            </div>
        </main>
    );
};

export default Profile;