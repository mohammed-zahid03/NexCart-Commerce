import React from "react";
import {
    Building2,
    Check,
    Circle,
    Home,
    MapPin,
    Pencil,
    Trash2,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { selectUserCheckoutAddress } from "../../store/actions";

const AddressList = ({
    addresses,
    setSelectedAddress,
    setOpenAddressModal,
    setOpenDeleteModal,
}) => {

    const dispatch = useDispatch();

    const {
        selectedUserCheckoutAddress,
    } = useSelector((state) => state.auth);

    const onEditButtonHandler = (event, address) => {
        event.stopPropagation();

        setSelectedAddress(address);
        setOpenAddressModal(true);
    };

    const onDeleteButtonHandler = (event, address) => {
        event.stopPropagation();

        setSelectedAddress(address);
        setOpenDeleteModal(true);
    };

    const handleAddressSelection = (address) => {
        dispatch(selectUserCheckoutAddress(address));
    };

    return (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

            {addresses.map((address, index) => {

                const isSelected =
                    selectedUserCheckoutAddress?.addressId ===
                    address.addressId;

                const isFirst = index === 0;

                return (
                    <div
                        key={address.addressId}
                        onClick={() =>
                            handleAddressSelection(address)
                        }
                        className={`
                            group relative cursor-pointer rounded-2xl
                            border p-6 transition-all duration-200
                            ${
                                isSelected
                                    ? "border-[#151515] bg-[#fcfaf5] shadow-[0_8px_25px_rgba(20,20,20,0.04)]"
                                    : "border-[#e3dfd8] bg-white hover:border-[#cfcac1] hover:shadow-[0_8px_25px_rgba(20,20,20,0.04)]"
                            }
                        `}
                    >

                        {/* Top */}
                        <div className="flex items-start justify-between gap-4">

                            <div className="flex items-start gap-4">

                                {/* Radio */}
                                <div
                                    className={`
                                        mt-0.5 flex h-5 w-5 shrink-0
                                        items-center justify-center
                                        rounded-full border
                                        ${
                                            isSelected
                                                ? "border-[#151515]"
                                                : "border-[#aaa59d]"
                                        }
                                    `}
                                >
                                    {isSelected && (
                                        <div className="h-2.5 w-2.5 rounded-full bg-[#151515]" />
                                    )}
                                </div>


                                {/* Address icon */}
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0eee9]">

                                    {isFirst ? (
                                        <Home
                                            size={18}
                                            strokeWidth={1.7}
                                            className="text-[#4e4a45]"
                                        />
                                    ) : (
                                        <Building2
                                            size={18}
                                            strokeWidth={1.7}
                                            className="text-[#4e4a45]"
                                        />
                                    )}

                                </div>


                                {/* Address */}
                                <div className="min-w-0">

                                    <div className="flex flex-wrap items-center gap-2">

                                        <h3 className="text-sm font-semibold text-[#151515]">
                                            {isFirst
                                                ? "Home"
                                                : "Work"}
                                        </h3>

                                        {isSelected && (
                                            <span className="rounded-full bg-[#e6f3e9] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#3d7650]">
                                                Selected
                                            </span>
                                        )}

                                    </div>


                                    <div className="mt-3 space-y-1 text-sm leading-5 text-[#67625b]">

                                        <p className="text-[#34312d]">
                                            {address.buildingName}
                                        </p>

                                        <p>
                                            {address.street}
                                        </p>

                                        <p>
                                            {address.city},{" "}
                                            {address.state}
                                        </p>

                                        <p>
                                            {address.pincode},{" "}
                                            {address.country}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* Bottom actions */}
                        <div className="mt-7 flex items-center border-t border-[#e8e4dd] pt-4">

                            <button
                                type="button"
                                onClick={(event) =>
                                    onEditButtonHandler(
                                        event,
                                        address
                                    )
                                }
                                className="inline-flex items-center gap-2 text-xs font-medium text-[#4e4a45] transition hover:text-[#151515]"
                            >
                                <Pencil size={14} strokeWidth={1.8} />
                                Edit
                            </button>


                            <div className="mx-4 h-4 w-px bg-[#ddd9d2]" />


                            <button
                                type="button"
                                onClick={(event) =>
                                    onDeleteButtonHandler(
                                        event,
                                        address
                                    )
                                }
                                className="inline-flex items-center gap-2 text-xs font-medium text-[#6b6760] transition hover:text-[#b33d3d]"
                            >
                                <Trash2 size={14} strokeWidth={1.8} />
                                Remove
                            </button>

                        </div>

                    </div>
                );
            })}

        </div>
    );
};

export default AddressList;