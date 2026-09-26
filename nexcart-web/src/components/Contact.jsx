import { useState } from "react";
import { FaEnvelope, FaMapMarkedAlt, FaPhone } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../api/api";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await api.post("/contact", {
                name: formData.name.trim(),
                email: formData.email.trim(),
                message: formData.message.trim(),
            });

            toast.success("Message sent successfully!");

            setFormData({
                name: "",
                email: "",
                message: "",
            });
        } catch (err) {
            const errorData = err?.response?.data;

            if (typeof errorData === "object" && errorData !== null) {
                const firstError = Object.values(errorData)[0];

                toast.error(
                    firstError || "Unable to send message. Please try again."
                );
            } else {
                toast.error(
                    errorData || "Unable to send message. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

   return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#171717]">

        {/* HERO */}
        <section className="mx-auto max-w-[1020px] px-6 pb-8 pt-10 sm:px-8 lg:pt-11">

            <div className="max-w-[700px]">

                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#6F7780]">
                    Contact NexCart
                </p>

                <h1
                    className="
                        mt-3
                        font-serif
                        text-[42px]
                        font-normal
                        leading-[1.05]
                        tracking-[-0.045em]
                        text-[#171717]
                        sm:text-[48px]
                    "
                >
                    We're here to help.
                </h1>

                <p
                    className="
                        mt-3
                        max-w-[610px]
                        text-[14px]
                        leading-[1.55]
                        text-[#596575]
                        sm:text-[15px]
                    "
                >
                    Questions about an order, a product, or anything else?
                    Reach out to the NexCart team and we'll help you find the
                    right answer.
                </p>

            </div>

        </section>


        {/* CONTACT CARD */}
        <section className="mx-auto max-w-[1020px] px-6 pb-16 sm:px-8">

            <div
                className="
                    grid
                    overflow-hidden
                    rounded-[14px]
                    border
                    border-[#E1DED8]
                    bg-white
                    lg:grid-cols-[0.88fr_1.12fr]
                "
            >

                {/* LEFT PANEL */}
                <div
                    className="
                        bg-[#202020]
                        px-8
                        py-8
                        text-white
                        sm:px-10
                        sm:py-9
                    "
                >

                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#B8B8B8]">
                        Customer Support
                    </p>

                    <h2
                        className="
                            mt-4
                            max-w-[390px]
                            font-serif
                            text-[30px]
                            font-normal
                            leading-[1.08]
                            tracking-[-0.035em]
                            text-white
                            sm:text-[32px]
                        "
                    >
                        Let's make your NexCart
                        <br />
                        experience simple.
                    </h2>

                    <p className="mt-3 max-w-[385px] text-[14px] leading-[1.55] text-[#D1D1D1]">
                        Whether you need help with an order, a product,
                        delivery, or something else, our team is here to
                        assist you.
                    </p>


                    {/* DIVIDER */}
                    <div className="my-5 h-px bg-white/15" />


                    {/* PHONE */}
                    <div className="flex items-start gap-4">

                        <FaPhone className="mt-[3px] shrink-0 text-[19px] text-white" />

                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#AFAFAF]">
                                Call us
                            </p>

                            <p className="mt-1 text-[14px] text-white">
                               Online support available
                            </p>
                        </div>

                    </div>


                    {/* EMAIL */}
                    <div className="mt-5 flex items-start gap-4">

                        <FaEnvelope className="mt-[3px] shrink-0 text-[18px] text-white" />

                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#AFAFAF]">
                                Email us
                            </p>

                            <p className="mt-1 break-all text-[14px] text-white">
                               nexcart.support@gmail.com
                            </p>
                        </div>

                    </div>


                    {/* ADDRESS */}
                    <div className="mt-5 flex items-start gap-4">

                        <FaMapMarkedAlt className="mt-[2px] shrink-0 text-[19px] text-white" />

                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#AFAFAF]">
                                Visit us
                            </p>

                            <p className="mt-1 text-[14px] text-white">
                               Online store — serving customers across India
                            </p>
                        </div>

                    </div>


                    {/* SUPPORT HOURS */}
                    <div
                        className="
                            mt-5
                            rounded-[8px]
                            border
                            border-white/20
                            px-4
                            py-3
                        "
                    >

                        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#AFAFAF]">
                            Support hours
                        </p>

                        <p className="mt-1 text-[14px] leading-[1.35] text-white">
                            Monday – Saturday
                            <br />
                            9:00 AM – 6:00 PM
                        </p>

                    </div>

                </div>


                {/* RIGHT FORM */}
                <div className="bg-white px-8 py-8 sm:px-10 sm:py-9">

                    <div className="max-w-[560px]">

                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#737B85]">
                            Send a message
                        </p>

                        <h2
                            className="
                                mt-3
                                font-serif
                                text-[30px]
                                font-normal
                                leading-tight
                                tracking-[-0.035em]
                                text-[#171717]
                                sm:text-[32px]
                            "
                        >
                            How can we help?
                        </h2>

                        <p className="mt-2 text-[13px] leading-6 text-[#737B85]">
                            Fill in the details below and our team will get
                            back to you.
                        </p>


                        <form
                            onSubmit={handleSubmit}
                            className="mt-6"
                        >

                            {/* NAME */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="
                                        mb-1.5
                                        block
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.12em]
                                        text-[#303030]
                                    "
                                >
                                    Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your name"
                                    className="
                                        h-[40px]
                                        w-full
                                        rounded-[6px]
                                        border
                                        border-[#D8D5D0]
                                        bg-white
                                        px-3.5
                                        text-[13px]
                                        text-[#171717]
                                        outline-none
                                        transition
                                        placeholder:text-[#9A9A9A]
                                        focus:border-[#171717]
                                    "
                                />
                            </div>


                            {/* EMAIL */}
                            <div className="mt-4">

                                <label
                                    htmlFor="email"
                                    className="
                                        mb-1.5
                                        block
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.12em]
                                        text-[#303030]
                                    "
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                    className="
                                        h-[40px]
                                        w-full
                                        rounded-[6px]
                                        border
                                        border-[#D8D5D0]
                                        bg-white
                                        px-3.5
                                        text-[13px]
                                        text-[#171717]
                                        outline-none
                                        transition
                                        placeholder:text-[#9A9A9A]
                                        focus:border-[#171717]
                                    "
                                />

                            </div>


                            {/* MESSAGE */}
                            <div className="mt-4">

                                <label
                                    htmlFor="message"
                                    className="
                                        mb-1.5
                                        block
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.12em]
                                        text-[#303030]
                                    "
                                >
                                    Message
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5"
                                    required
                                    placeholder="Tell us how we can help..."
                                    className="
                                        h-[90px]
                                        w-full
                                        resize-none
                                        rounded-[6px]
                                        border
                                        border-[#D8D5D0]
                                        bg-white
                                        px-3.5
                                        py-3
                                        text-[13px]
                                        leading-5
                                        text-[#171717]
                                        outline-none
                                        transition
                                        placeholder:text-[#9A9A9A]
                                        focus:border-[#171717]
                                    "
                                />

                            </div>


                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    group
                                    mt-4
                                    flex
                                    h-[44px]
                                    w-full
                                    items-center
                                    justify-center
                                    gap-3
                                    rounded-[6px]
                                    bg-[#202020]
                                    text-[13px]
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-[#111111]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                {loading ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        Send Message

                                        <span className="text-[17px] transition-transform duration-200 group-hover:translate-x-1">
                                            →
                                        </span>
                                    </>
                                )}
                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </section>

    </main>
);
};

export default Contact;