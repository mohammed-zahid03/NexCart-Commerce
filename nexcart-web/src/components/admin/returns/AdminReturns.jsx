import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllReturnRequests,
    updateReturnRequestStatus,
} from "../../../store/actions";
import toast from "react-hot-toast";

const AdminReturns = () => {
    const dispatch = useDispatch();

    const { adminReturns } = useSelector((state) => state.order);

    const [loader, setLoader] = useState(false);

    useEffect(() => {
        dispatch(getAllReturnRequests());
    }, [dispatch]);

    const handleStatusUpdate = async (returnId, status) => {
        setLoader(true);

        await dispatch(
            updateReturnRequestStatus(
                returnId,
                status,
                toast
            )
        );

        setLoader(false);
    };

    const emptyReturns =
        !adminReturns || adminReturns.length === 0;

    const tableRecords = adminReturns?.map((item) => ({
        id: item.returnId,
        returnId: item.returnId,
        orderId: item.orderId,
        reason: item.reason,
        status: item.status,
        requestedAt: item.requestedAt,
        processedAt: item.processedAt || "-",
    }));

    const columns = [
        {
            field: "returnId",
            headerName: "Return ID",
            flex: 1,
            minWidth: 100,
        },
        {
            field: "orderId",
            headerName: "Order ID",
            flex: 1,
            minWidth: 100,
        },
        {
            field: "reason",
            headerName: "Reason",
            flex: 2,
            minWidth: 200,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            minWidth: 130,
        },
        {
            field: "requestedAt",
            headerName: "Requested At",
            flex: 1.5,
            minWidth: 180,
        },
        {
            field: "processedAt",
            headerName: "Processed At",
            flex: 1.5,
            minWidth: 180,
        },
        {
            field: "action",
            headerName: "Action",
            flex: 1.5,
            minWidth: 220,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const status = params.row.status?.toLowerCase();

                if (status !== "requested") {
                    return (
                        <span className="text-gray-500">
                            No Action
                        </span>
                    );
                }

                return (
                    <div className="flex gap-2 items-center">
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            disabled={loader}
                            onClick={() =>
                                handleStatusUpdate(
                                    params.row.returnId,
                                    "Approved"
                                )
                            }
                        >
                            Approve
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            disabled={loader}
                            onClick={() =>
                                handleStatusUpdate(
                                    params.row.returnId,
                                    "Rejected"
                                )
                            }
                        >
                            Reject
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="pb-6 pt-20">
            {emptyReturns ? (
                <div className="flex flex-col items-center justify-center text-gray-600 py-10">
                    <h2 className="text-2xl font-semibold">
                        No Return Requests
                    </h2>
                </div>
            ) : (
                <div>
                    <h1 className="text-slate-800 text-3xl text-center font-bold pb-6 uppercase">
                        All Return Requests
                    </h1>

                    <div className="w-full">
                        <DataGrid
                            className="w-full"
                            rows={tableRecords}
                            columns={columns}
                            disableRowSelectionOnClick
                            disableColumnResize
                            pageSizeOptions={[10]}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                        page: 0,
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReturns;