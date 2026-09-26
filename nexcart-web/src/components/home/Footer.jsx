import Newsletter from "../home/Newsletter";

import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";
import { ChevronDown } from "lucide-react";

import FooterColumn from "./FooterColumn";
import footerData from "./footerData";

import logo from "../../assets/logo/logo-white.png";

import appStore from "../../assets/footer/app-store.svg";
import googlePlay from "../../assets/footer/google-play.png";

import stripe from "../../assets/footer/stripe.png";

const Footer = () => {
  return (
    <footer className="bg-[#181818] text-white">

  <div className="mx-auto max-w-[1600px]">

    <Newsletter />

    <div className="border-t border-white/10" />

    <div className="px-6 pt-7 pb-8">

       <div className="grid grid-cols-[1.9fr_1fr_1fr_1fr_1fr_1.15fr] gap-8">

          {/* LEFT */}
          <div>

            <img
              src={logo}
              alt="NexCart"
              className="h-[46px] w-auto object-contain"
            />

            <p
              className="
                mt-7
                max-w-[260px]
                text-[17px]
                leading-[1.65]
                text-[#B8B8B8]
              "
            >
              Technology, thoughtfully curated
              <br />
              for people who create, work,
              <br />
              and live better.
            </p>

          <div className="mt-7 flex items-center gap-8">

  <a
    href="https://www.instagram.com/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
  >
    <FaInstagram
      size={30}
      className="text-[#ECECEC] transition hover:text-white"
    />
  </a>

  <a
    href="https://www.facebook.com/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook"
  >
    <FaFacebookF
      size={28}
      className="text-[#ECECEC] transition hover:text-white"
    />
  </a>

  <a
    href="https://x.com/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="X"
  >
    <FaXTwitter
      size={29}
      className="text-[#ECECEC] transition hover:text-white"
    />
  </a>

  <a
    href="https://www.youtube.com/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="YouTube"
  >
    <FaYoutube
      size={30}
      className="text-[#ECECEC] transition hover:text-white"
    />
  </a>

</div>

          </div>

          <FooterColumn title="Shop" items={footerData.shop} />

          <FooterColumn
            title="Customer Service"
            items={footerData.customerService}
          />

          <FooterColumn
            title="Company"
            items={footerData.company}
          />

          <FooterColumn
            title="Legal"
            items={footerData.legal}
          />

          {/* DOWNLOAD */}
          <div>

           <h3 className="mb-5 text-[17px] font-medium">
              Download the App
            </h3>

            <div className="space-y-3">

              <img
                src={appStore}
                alt="App Store"
                className="w-[190px] cursor-pointer transition duration-300 hover:scale-[1.02]"
              />

              <img
                src={googlePlay}
                alt="Google Play"
                className="w-[190px] cursor-pointer transition duration-300 hover:scale-[1.02]"
              />

            </div>

          </div>

        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Bottom */}
    <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 pt-4 pb-4 sm:px-10 lg:px-14">

<p className="text-[13px] text-[#888888]">
  © {new Date().getFullYear()} NexCart. All rights reserved.
</p>

        <div className="flex items-center gap-4">

          

         

      <div className="ml-6 flex items-center gap-2 text-[12px] text-[#777777]">
  <span>🔒 Secure payments ·</span>

  <img
    src={stripe}
    alt="Powered by Stripe"
    className="h-11 w-auto object-contain opacity-50"
  />
</div>

        </div>

      </div>

    </div>

    </footer>
  );
};

export default Footer;