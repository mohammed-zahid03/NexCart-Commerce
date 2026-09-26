import chair from "../../assets/newsletter/chair.png";
import { useState } from "react";
import api from "../../api/api";

const Newsletter = () => {
const [email, setEmail] = useState("");
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [error, setError] = useState("");

const handleSubscribe = async (e) => {
  e.preventDefault();

  setMessage("");
  setError("");

  if (!email.trim()) {
    setError("Please enter your email address.");
    return;
  }

  try {
    setLoading(true);

    const response = await api.post("/newsletter/subscribe", {
      email: email.trim(),
    });

    setMessage(response.data);
    setEmail("");
  } catch (err) {
    setError(
      err?.response?.data?.message ||
      err?.response?.data ||
      "Unable to subscribe. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    
      <div
        className="
          relative
          h-[170px]
          overflow-hidden
          rounded-t-[28px]
          rounded-b-none
          bg-[#141414]
        "
      >
        <div className="relative flex h-full items-center">

          {/* LEFT */}
         <div className="w-[24%] pl-8 pr-6">

            <h2
              className="
                cormorant
                text-[34px]
                font-semibold
                leading-[0.95]
                tracking-[-0.03em]
                text-white
              "
            >
              Stay inspired.
            </h2>

            <p
              className="
                mt-5
                max-w-[340px]
                text-[17px]
                leading-[1.65]
                text-[#B9B9B9]
              "
            >
             Be the first to know about new arrivals,
exclusive offers, and the latest tech stories that matter.
            </p>

          </div>

          {/* CENTER */}
<div className="w-[63%] px-6 z-20">

  <form
  onSubmit={handleSubscribe}
  className="
    flex
    h-[62px]
    w-full
    overflow-hidden
    rounded-[6px]
    border
    border-[#474747]
    bg-white
    shadow-[0_0_0_1px_rgba(255,255,255,0.03)]
  "
>

    <input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter your email"
      className="
        flex-1
        bg-white
        px-10
        text-[16px]
        text-[#1B1B1B]
        outline-none
        placeholder:text-[#9D9D9D]
      "
    />

    <button
  type="submit"
  disabled={loading}
      className="
        w-[175px]
        border-l
        border-[#474747]
        bg-[#141414]
        text-[17px]
        font-semibold
        text-white
        transition
        duration-300
        hover:bg-[#1A1A1A]
      "
    >
      {loading ? "Subscribing..." : "Subscribe"}
        </button>

  </form>

  {message && (
    <p className="mt-3 text-sm text-green-400">
      {message}
    </p>
  )}

  {error && (
    <p className="mt-3 text-sm text-red-400">
      {error}
    </p>
  )}

</div>
          {/* RIGHT IMAGE */}
          <div className="absolute right-0 top-0 h-full w-[22%] overflow-hidden">

            {/* Gradient Fade */}
            <div
              className="
                absolute
                inset-0
                z-10
                bg-gradient-to-r
from-[#141414]
via-[#141414]/15
to-transparent
              "
            />

            <img
              src={chair}
              alt="Luxury Interior"
              className="
                h-full
                w-full
                object-cover
                object-right
                brightness-[0.95]
                contrast-[1.05]
                saturate-[0.95]
              "
            />

          </div>
          </div>

        </div>
  );
};

export default Newsletter;