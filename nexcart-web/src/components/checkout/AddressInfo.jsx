import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import AddressInfoModal from "./AddressInfoModal";
import AddAddressForm from "./AddAddressForm";
import AddressList from "./AddressList";
import { DeleteModal } from "./DeleteModal";

import { deleteUserAddress } from "../../store/actions";

const AddressInfo = ({ address }) => {

    const [openAddressModal, setOpenAddressModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");

    const dispatch = useDispatch();

    const { isLoading, btnLoader } = useSelector(
        (state) => state.errors
    );

    const addNewAddressHandler = () => {
        setSelectedAddress("");
        setOpenAddressModal(true);
    };

    const deleteAddressHandler = () => {
        dispatch(
            deleteUserAddress(
                toast,
                selectedAddress?.addressId,
                setOpenDeleteModal
            )
        );
    };

    const noAddressExist =
        !address || address.length === 0;

    return (
        <>
            <section className="rounded-2xl border border-[#e3dfd8] bg-[#fffefa] p-7 sm:p-8">

                {/* Header */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                    <div>
                        <h2 className="font-serif text-3xl tracking-[-0.03em]">
                            Delivery address
                        </h2>

                        <p className="mt-2 text-sm text-[#77736c]">
                            Choose a delivery address for your order.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={addNewAddressHandler}
                        className="inline-flex w-fit items-center gap-2 rounded-full bg-[#151515] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2b2b2b] hover:shadow-md"
                    >
                        <Plus size={16} strokeWidth={2} />
                        Add new address
                    </button>

                </div>


                {/* Divider */}
                <div className="my-7 h-px bg-[#e8e4dd]" />


                {/* Loading */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-16">

                        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#ddd9d2] border-t-[#151515]" />

                        <p className="mt-4 text-sm text-[#77736c]">
                            Loading your addresses...
                        </p>

                    </div>
                )}


                {/* No address */}
                {!isLoading && noAddressExist && (

                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#d9d5ce] bg-[#faf9f6] px-6 py-14 text-center">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eeece7]">

                            <span className="text-xl text-[#625e57]">
                                +
                            </span>

                        </div>

                        <h3 className="mt-5 font-serif text-xl">
                            No delivery address yet
                        </h3>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-[#77736c]">
                            Add an address to continue with your purchase.
                        </p>

                        <button
                            type="button"
                            onClick={addNewAddressHandler}
                            className="mt-6 rounded-full bg-[#151515] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2b2b2b]"
                        >
                            Add address
                        </button>

                    </div>

                )}


                {/* Address list */}
                {!isLoading && !noAddressExist && (
                    <AddressList
                        addresses={address}
                        setSelectedAddress={setSelectedAddress}
                        setOpenAddressModal={setOpenAddressModal}
                        setOpenDeleteModal={setOpenDeleteModal}
                    />
                )}

            </section>


            {/* Add / edit modal */}
            <AddressInfoModal
                open={openAddressModal}
                setOpen={setOpenAddressModal}
            >
                <AddAddressForm
                    address={selectedAddress}
                    setOpenAddressModal={setOpenAddressModal}
                />
            </AddressInfoModal>


            {/* Delete modal */}
            <DeleteModal
                open={openDeleteModal}
                loader={btnLoader}
                setOpen={setOpenDeleteModal}
                title="Delete Address"
                onDeleteHandler={deleteAddressHandler}
            />
        </>
    );
};

export default AddressInfo;