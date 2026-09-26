import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, ArrowRight, LockKeyhole, UserRound } from "lucide-react";

import { authenticateSignInUser } from "../../store/actions";
import toast from "react-hot-toast";
import Spinners from "../shared/Spinners";

const LogIn = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [loader, setLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
    });

    const loginHandler = async (data) => {
        const redirectTo = location.state?.from
            ? `${location.state.from.pathname}${location.state.from.search || ""}`
            : "/";

        dispatch(
            authenticateSignInUser(
                data,
                toast,
                reset,
                navigate,
                setLoader,
                redirectTo
            )
        );
    };

    return (
        <main className="min-h-[calc(100vh-64px)] bg-[#FAFAF8]">

            <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-3xl items-center justify-center px-5 py-10 sm:px-6">

               <div className="w-full max-w-[420px]">

                    {/* Heading */}
                    <div className="mb-7 text-center">

                        <p className="
                            mb-3
                            text-[11px]
                            font-medium
                            uppercase
                            tracking-[0.22em]
                            text-slate-500
                        ">
                            NexCart account
                        </p>

                        <h1 className="
    text-[38px]
    font-medium
    leading-none
    tracking-[-0.035em]
    text-[#161616]
    sm:text-[42px]
">
    Welcome back
</h1>

                        <p className="
                            mt-3
                            text-[15px]
                            leading-6
                            text-slate-500
                        ">
                            Sign in to continue to your NexCart account.
                        </p>

                    </div>

                    {/* Form */}
                   <form
    onSubmit={handleSubmit(loginHandler)}
    className="
        rounded-[10px]
        border
        border-[#E1E0DC]
        bg-white
        px-6
        py-6
        shadow-[0_8px_28px_rgba(15,23,42,0.05)]
        sm:px-7
        sm:py-7
    "
>

                        {/* Username */}
                        <div className="mb-5">

                            <label
                                htmlFor="username"
                                className="
                                    mb-2
                                    block
                                    text-[13px]
                                    font-medium
                                    text-[#222]
                                "
                            >
                                Username
                            </label>

                            <div className="relative">

                                <UserRound
                                    size={17}
                                    strokeWidth={1.6}
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />

                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                    className={`
                                        h-12
                                        w-full
                                        rounded-[6px]
                                        border
                                        bg-white
                                        pl-11
                                        pr-4
                                        text-[14px]
                                        text-slate-900
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-slate-500
                                        focus:ring-2
                                        focus:ring-slate-900/5
                                        ${
                                            errors.username
                                                ? "border-red-500"
                                                : "border-[#D4D2CD]"
                                        }
                                    `}
                                    {...register("username", {
                                        required: {
                                            value: true,
                                            message: "Username is required",
                                        },
                                    })}
                                />

                            </div>

                            {errors.username?.message && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.username.message}
                                </p>
                            )}

                        </div>

                        {/* Password */}
                        <div>

                            <div className="mb-2 flex items-center justify-between">

                                <label
                                    htmlFor="password"
                                    className="
                                        text-[13px]
                                        font-medium
                                        text-[#222]
                                    "
                                >
                                    Password
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="
                                        text-[13px]
                                        font-medium
                                        text-[#333]
                                        underline
                                        underline-offset-4
                                        transition-colors
                                        hover:text-slate-500
                                    "
                                >
                                    Forgot password?
                                </Link>

                            </div>

                            <div className="relative">

                                <LockKeyhole
                                    size={17}
                                    strokeWidth={1.6}
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />

                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className={`
                                        h-12
                                        w-full
                                        rounded-[6px]
                                        border
                                        bg-white
                                        pl-11
                                        pr-11
                                        text-[14px]
                                        text-slate-900
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-slate-500
                                        focus:ring-2
                                        focus:ring-slate-900/5
                                        ${
                                            errors.password
                                                ? "border-red-500"
                                                : "border-[#D4D2CD]"
                                        }
                                    `}
                                    {...register("password", {
                                        required: {
                                            value: true,
                                            message: "Password is required",
                                        },
                                    })}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((previous) => !previous)
                                    }
                                    className="
                                        absolute
                                        right-3.5
                                        top-1/2
                                        -translate-y-1/2
                                        p-1
                                        text-slate-400
                                        transition-colors
                                        hover:text-slate-700
                                    "
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} strokeWidth={1.6} />
                                    ) : (
                                        <Eye size={18} strokeWidth={1.6} />
                                    )}
                                </button>

                            </div>

                            {errors.password?.message && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.password.message}
                                </p>
                            )}

                        </div>

                        {/* Sign in */}
                        <button
                            disabled={loader}
                            type="submit"
                            className="
                                mt-6
                                flex
                                h-12
                                w-full
                                items-center
                                justify-center
                                gap-2.5
                                rounded-[6px]
                                bg-[#171717]
                                px-5
                                text-[14px]
                                font-medium
                                text-white
                                transition-all
                                duration-200
                                hover:bg-[#292929]
                                hover:shadow-[0_7px_18px_rgba(0,0,0,0.10)]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            {loader ? (
                                <>
                                    <Spinners />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight size={16} strokeWidth={1.7} />
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="my-7 flex items-center gap-3">

                            <div className="h-px flex-1 bg-[#DDDBD6]" />

                            <span className="
                                whitespace-nowrap
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-[0.18em]
                                text-slate-400
                            ">
                                New to NexCart?
                            </span>

                            <div className="h-px flex-1 bg-[#DDDBD6]" />

                        </div>

                        {/* Register */}
                       <div className="flex justify-center translate-x-2">

                            <Link
                                to="/register"
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    text-[14px]
                                    font-medium
                                    text-[#222]
                                    underline
                                    underline-offset-4
                                    transition-colors
                                    hover:text-slate-500
                                "
                            >
                                Create an account
                                <ArrowRight
                                    size={15}
                                    strokeWidth={1.7}
                                />
                            </Link>

                        </div>

                    </form>

                    {/* Footer */}
                    <p className="
                        mt-6
                        text-center
                        text-[10px]
                        tracking-wide
                        text-slate-400
                    ">
                        © {new Date().getFullYear()} NexCart
                    </p>

                </div>

            </div>

        </main>
    );
};

export default LogIn;