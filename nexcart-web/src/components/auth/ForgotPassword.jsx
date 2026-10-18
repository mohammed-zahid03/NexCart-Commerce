import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

     
const response = await api.post(
  `/auth/forgot-password?email=${encodeURIComponent(email.trim())}`
);

const data = response.data;


      toast.success(
        data.message || "If an account exists, a reset link has been sent."
      );
    } catch (error) {
      toast.error(error.message || "Unable to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#fafaf9] flex flex-col items-center px-5 pt-16 pb-10">

      {/* Page Heading */}
      <div className="w-full max-w-[520px] text-center mb-9">
        <p className="text-[11px] tracking-[0.25em] font-medium text-slate-500 uppercase mb-4">
          NexCart Account
        </p>

        <h1 className="text-[40px] sm:text-[46px] leading-none font-normal tracking-[-0.035em] text-[#171717]">
          Forgot your password?
        </h1>

        <p className="mt-4 text-[15px] text-slate-500 leading-6">
          Enter your email address and we'll send you a secure
          <br className="hidden sm:block" />
          password reset link.
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-[470px] bg-white border border-slate-200/90 rounded-xl shadow-[0_8px_30px_rgba(15,23,42,0.04)] px-8 sm:px-10 py-9">

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-[14px] font-medium text-slate-900 mb-2.5"
            >
              Email address
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                @
              </span>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-[54px] pl-11 pr-4 rounded-lg border border-slate-300 bg-white text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-200"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full h-[54px] rounded-lg bg-[#181818] text-white text-[15px] font-medium tracking-[-0.01em] transition-all duration-200 hover:bg-black hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-7">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-[10px] tracking-[0.2em] text-slate-400 uppercase whitespace-nowrap">
            Remember your password?
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-slate-900 underline underline-offset-4 hover:text-slate-500 transition-colors"
          >
            Back to sign in
            <span className="text-[17px] leading-none">→</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-[11px] text-slate-400">
        © 2026 NexCart
      </p>
    </div>
  );
};

export default ForgotPassword;