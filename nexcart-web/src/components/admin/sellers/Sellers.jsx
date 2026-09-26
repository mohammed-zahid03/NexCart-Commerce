import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdPersonAdd } from "react-icons/md";

import SellerTable from "./SellerTable";
import ErrorPage from "../../shared/ErrorPage";
import Loader from "../../shared/Loader";
import Modal from "../../shared/Modal";
import AddSellerForm from "./AddSellerForm";
import useSellerFilter from "./useSellerFilter";

import toast from "react-hot-toast";
import { DeleteModal } from "../../../components/shared/DeleteModal";
import { deleteSellerDashboardAction } from "../../../store/actions";
import api from "../../../api/api";

const Sellers = () => {
   const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  const { sellers, pagination } = useSelector((state) => state.seller);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);

  // Calling the `useSellerFilter` custom hook to fetch sellers and pagination based on the current URL parameters.
  useSellerFilter();

 const emptySellers = !sellers || sellers?.length === 0;

const handleDelete = (seller) => {
  setSelectedSeller(seller);
  setOpenDeleteModal(true);
};

const handleSellerStatus = async (seller, active) => {
  try {
    await api.put(
      `/auth/sellers/${seller.id}/status`,
      null,
      {
        params: {
          active,
        },
      }
    );

    toast.success(
      active
        ? "Seller activated successfully!"
        : "Seller suspended successfully!"
    );

  } catch (error) {
    console.error("Failed to update seller status:", error);

    toast.error(
      error?.response?.data?.message ||
      "Failed to update seller status."
    );
  }
};

const onDeleteHandler = () => {
  dispatch(
    deleteSellerDashboardAction(
      setOpenDeleteModal,
      selectedSeller?.id,
      toast
    )
  );
};

if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <React.Fragment>
      <div className="pt-6 pb-10 flex justify-end">
        <button
          onClick={() => setOpenModal(true)}
          className="bg-custom-blue hover:bg-blue-800 text-white font-semibold py-2 px-4 flex items-center gap-2 rounded-md shadow-md transition-colors hover:text-slate-300 duration-300"
        >
          <MdPersonAdd className="text-xl" />
          Add Seller
        </button>
      </div>

      {!emptySellers && (
        <h1 className="text-slate-800 text-3xl text-center font-bold pb-6 uppercase">
          All Sellers
        </h1>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {emptySellers ? (
            <>
              <div className="flex flex-col items-center justify-center text-gray-600 py-10">
                <h2 className="text-2xl font-semibold">
                  No Seller Created Yet
                </h2>
              </div>
            </>
          ) : (
            <SellerTable
  sellers={sellers}
  pagination={pagination}
  handleDelete={handleDelete}
  handleSellerStatus={handleSellerStatus}
/>
          )}
        </>
      )}

      <Modal open={openModal} setOpen={setOpenModal} title="Add New Seller">
        <AddSellerForm setOpen={setOpenModal} />
      </Modal>

      <DeleteModal
  open={openDeleteModal}
  loader={isLoading}
  setOpen={setOpenDeleteModal}
  title="Are you want to delete this seller"
  onDeleteHandler={onDeleteHandler}
/>

    </React.Fragment>
  );
};

export default Sellers;