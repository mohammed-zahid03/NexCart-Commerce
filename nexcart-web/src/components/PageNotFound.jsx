import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <main className="min-h-[70vh] bg-[#f7f8fa] flex items-center justify-center px-5">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
        
        <h1 className="text-7xl font-bold text-gray-900">
          404
        </h1>

        <h2 className="mt-5 text-2xl font-semibold text-gray-900">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-500">
          The page you're looking for doesn't exist or the URL is incorrect.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
};

export default PageNotFound;