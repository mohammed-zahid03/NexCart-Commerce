import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/api/auth/reset-password?token=${encodeURIComponent(
          token
        )}&newPassword=${encodeURIComponent(newPassword)}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to reset password.");
      }

      toast.success(
        data.message || "Password reset successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      toast.error(error.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="min-h-[calc(100vh-88px)] bg-[#fafafa] px-4 py-16 sm:py-20">
    <div className="mx-auto w-full max-w-[520px]">

      {/* Page heading */}
      <div className="text-center mb-10">
        <p className="text-[11px] tracking-[0.28em] uppercase text-slate-500 mb-4">
          NexCart Account
        </p>

        <h1 className="text-[42px] sm:text-[48px] leading-[1.05] font-normal tracking-[-0.035em] text-[#111111]">
          Create a new password
        </h1>

        <p className="mt-4 text-[16px] leading-6 text-slate-500">
          Choose a new password for your NexCart account.
        </p>
      </div>

      {/* Form card */}
      <div className="rounded-[14px] border border-slate-200 bg-white p-7 sm:p-8 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">

        {!token ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500">
              !
            </div>

            <h2 className="text-[17px] font-medium text-slate-900">
              Invalid reset link
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This password reset link is invalid or incomplete.
            </p>

            <Link
              to="/forgot-password"
              className="mt-7 inline-flex items-center justify-center rounded-md bg-[#171717] px-5 py-3 text-sm font-medium text-white transition hover:bg-black"
            >
              Request a new link
              <span className="ml-2">→</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* New password */}
            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium text-slate-900"
              >
                New password
              </label>

              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-3.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-400"
                disabled={loading}
                required
              />
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-900"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-3.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-400"
                disabled={loading}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#171717] py-3.5 text-[15px] font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset password"}
              {!loading && <span className="ml-2">→</span>}
            </button>

            {/* Security note */}
            <p className="text-center text-xs text-slate-400">
              Your password is securely encrypted.
            </p>
          </form>
        )}

        {/* Back to login */}
        <div className="mt-7 border-t border-slate-100 pt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-slate-700 underline underline-offset-4 transition hover:text-black"
          >
            Back to sign in
            <span className="ml-2 no-underline">→</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-7 text-center text-xs text-slate-400">
        © 2026 NexCart
      </p>
    </div>
  </div>
);
};

export default ResetPassword;