import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import Loader from "../../shared/Loader";
import ErrorPage from "../../shared/ErrorPage";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const { data } = await api.get("/admin/reviews");

        setReviews(data || []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);

        setErrorMessage(
          error?.response?.data?.message ||
            "Failed to fetch reviews."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

   const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/admin/reviews/${reviewId}`);

      setReviews((currentReviews) =>
        currentReviews.filter(
          (review) => review.reviewId !== reviewId
        )
      );
    } catch (error) {
      console.error("Failed to delete review:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to delete review."
      );
    }
  };

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  const filteredReviews = reviews.filter((review) => {
  const search = searchTerm.toLowerCase();

  const matchesSearch =
    review.userName?.toLowerCase().includes(search) ||
    review.comment?.toLowerCase().includes(search) ||
    review.productId?.toString().includes(search) ||
    review.userId?.toString().includes(search);

  const matchesRating =
    ratingFilter === "" ||
    review.rating?.toString() === ratingFilter;

  return matchesSearch && matchesRating;
});


  return (
    <React.Fragment>
      <div className="pt-6 pb-6">
        <h1 className="text-slate-800 text-3xl text-center font-bold uppercase">
          Reviews
        </h1>

        <p className="text-center text-slate-500 mt-2">
          Review customer feedback and ratings.
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : filteredReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-600 py-16">
          <h2 className="text-2xl font-semibold">
            No Reviews Found
          </h2>

          <p className="mt-2">
            There are currently no customer reviews.
          </p>
        </div>
      ) : (
       <div className="px-4 pb-10">

 <div className="mb-4 flex flex-wrap gap-3">
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search by customer, comment, product ID..."
    className="w-full max-w-md border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
  />

  <select
    value={ratingFilter}
    onChange={(e) => setRatingFilter(e.target.value)}
    className="border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
  >
    <option value="">All Ratings</option>
    <option value="5">5 Stars</option>
    <option value="4">4 Stars</option>
    <option value="3">3 Stars</option>
    <option value="2">2 Stars</option>
    <option value="1">1 Star</option>
  </select>
</div>

  <div className="mb-4 text-sm text-slate-500">
            Total Reviews:{" "}
            <span className="font-semibold text-slate-700">
              {reviews.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 px-4 py-3 text-center">
                    ID
                  </th>

                  <th className="border border-slate-200 px-4 py-3 text-center">
                    Product
                  </th>

                  <th className="border border-slate-200 px-4 py-3 text-left">
                    Customer
                  </th>

                  <th className="border border-slate-200 px-4 py-3 text-center">
                    Rating
                  </th>

                  <th className="border border-slate-200 px-4 py-3 text-left">
                    Comment
                  </th>

                  <th className="border border-slate-200 px-4 py-3 text-center">
                    Date
                  </th>
                  <th className="border border-slate-200 px-4 py-3 text-center">
  Actions
</th>
                </tr>
              </thead>

              <tbody>
                {filteredReviews.map((review) => (
                  <tr
                    key={review.reviewId}
                    className="hover:bg-slate-50"
                  >
                    <td className="border border-slate-200 px-4 py-3 text-center">
                      {review.reviewId}
                    </td>

                    <td className="border border-slate-200 px-4 py-3 text-center">
                      #{review.productId}
                    </td>

                    <td className="border border-slate-200 px-4 py-3">
                      <div className="font-medium">
                        {review.userName}
                      </div>

                      <div className="text-sm text-slate-500">
                        User ID: {review.userId}
                      </div>
                    </td>

                    <td className="border border-slate-200 px-4 py-3 text-center">
                      <span className="font-semibold text-yellow-600">
                        {review.rating}/5
                      </span>
                    </td>

                    <td className="border border-slate-200 px-4 py-3 max-w-md">
                      {review.comment}
                    </td>

                    <td className="border border-slate-200 px-4 py-3 text-center">
                      {formatDate(review.createdAt)}
                    </td>
                    <td className="border border-slate-200 px-4 py-3 text-center">
  <button
    onClick={() =>
      handleDeleteReview(review.reviewId)
    }
    className="px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
  >
    Delete
  </button>
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

export default Reviews;