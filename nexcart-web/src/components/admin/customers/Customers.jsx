import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../../api/api";
import Loader from "../../shared/Loader";
import ErrorPage from "../../shared/ErrorPage";

const Customers = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    totalPages: 0,
    totalElements: 0,
  });

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const currentPage = Number(searchParams.get("page") || 0);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const { data } = await api.get(
          `/admin/customers?pageNumber=${currentPage}`
        );

        setCustomers(data?.content || []);

        setPagination({
          pageNumber: data?.pageNumber ?? 0,
          totalPages: data?.totalPages ?? 0,
          totalElements: data?.totalElements ?? 0,
        });
      } catch (error) {
        console.error("Failed to fetch customers:", error);

        setErrorMessage(
          error?.response?.data?.message ||
            "Failed to fetch customers."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page < 0 || page >= pagination.totalPages) {
      return;
    }

    setSearchParams({
      page: page.toString(),
    });
  };

  const handleCustomerStatus = async (customer, active) => {
  try {
    await api.put(
      `/admin/customers/${customer.userId}/status`,
      null,
      {
        params: {
          active,
        },
      }
    );

    setCustomers((currentCustomers) =>
      currentCustomers.map((item) =>
        item.userId === customer.userId
          ? { ...item, accountActive: active }
          : item
      )
    );
  } catch (error) {
    console.error("Failed to update customer status:", error);

    setErrorMessage(
      error?.response?.data?.message ||
        "Failed to update customer status."
    );
  }
};

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <React.Fragment>
      <div className="pt-6 pb-6">
        <h1 className="text-slate-800 text-3xl text-center font-bold uppercase">
          Customers
        </h1>

        <p className="text-center text-slate-500 mt-2">
          Manage registered customers.
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-600 py-16">
          <h2 className="text-2xl font-semibold">
            No Customers Found
          </h2>

          <p className="mt-2">
            There are currently no registered customers.
          </p>
        </div>
      ) : (
        <div className="px-4 pb-10">
          <div className="mb-4 text-sm text-slate-500">
            Total Customers:{" "}
            <span className="font-semibold text-slate-700">
              {pagination.totalElements}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100">
               <th className="border border-slate-200 px-4 py-3 text-center">
  ID
</th>

<th className="border border-slate-200 px-4 py-3 text-left">
  Name
</th>

<th className="border border-slate-200 px-4 py-3 text-left">
  Email
</th>

<th className="border border-slate-200 px-4 py-3 text-center">
  Orders
</th>

<th className="border border-slate-200 px-4 py-3 text-right">
  Total Spent
</th>
<th className="border border-slate-200 px-4 py-3 text-center">
  Joined
</th>
<th className="border border-slate-200 px-4 py-3 text-center">
  Status
</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.userId}
                    className="hover:bg-slate-50"
                  >
                    <td className="border border-slate-200 px-4 py-3 text-center">
                      {customer.userId}
                    </td>

                    <td className="border border-slate-200 px-4 py-3">
                      {customer.username}
                    </td>

                    <td className="border border-slate-200 px-4 py-3">
                      {customer.email}
                    </td>
                    <td className="border border-slate-200 px-4 py-3 text-center">
  {customer.ordersCount ?? 0}
</td>

<td className="border border-slate-200 px-4 py-3 text-right font-medium">
  ₹{Number(customer.totalSpent ?? 0).toFixed(2)}
</td>
<td className="border border-slate-200 px-4 py-3 text-center">
  {customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-"}
</td>

<td className="border border-slate-200 px-4 py-3 text-center">
  <div className="flex flex-col items-center gap-2">
    <span
      className={`font-semibold ${
        customer.accountActive
          ? "text-green-600"
          : "text-red-600"
      }`}
    >
      {customer.accountActive ? "ACTIVE" : "BLOCKED"}
    </span>

    <button
      onClick={() =>
        handleCustomerStatus(
          customer,
          !customer.accountActive
        )
      }
      className={`px-3 py-1.5 rounded-md text-white text-sm font-medium ${
        customer.accountActive
          ? "bg-red-500 hover:bg-red-600"
          : "bg-green-500 hover:bg-green-600"
      }`}
    >
      {customer.accountActive ? "Block" : "Activate"}
    </button>
  </div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() =>
                  handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 0}
                className="px-4 py-2 rounded-md bg-slate-200 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-slate-600">
                Page {currentPage + 1} of{" "}
                {pagination.totalPages}
              </span>

              <button
                onClick={() =>
                  handlePageChange(currentPage + 1)
                }
                disabled={
                  currentPage >= pagination.totalPages - 1
                }
                className="px-4 py-2 rounded-md bg-slate-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default Customers;