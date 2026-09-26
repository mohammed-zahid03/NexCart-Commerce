import { ArrowRight, Clock3, Mail, PackageOpen, CircleHelp, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";


const values = [
  {
    number: "01",
    title: "Curated Selection",
    description:
      "We handpick products that combine quality, innovation and real-world value.",
  },
  {
    number: "02",
    title: "Seamless Experience",
    description:
      "From browsing to delivery, we keep things simple, secure and stress-free.",
  },
  {
    number: "03",
    title: "Customer First",
    description:
      "Your trust means everything. We’re here to help, whenever you need us.",
  },
];

const About = () => {
  return (
    <main className="bg-[#fbfaf7] text-[#151515]">
      {/* HERO */}
     <section className="border-b border-[#e5e1d8] bg-[#f5f2eb]">
<div className="mx-auto max-w-[1400px] px-6 py-6 sm:px-8 lg:px-12 lg:py-[32px]">
<div className="grid items-start gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
            <div className="max-w-[700px]">
              <p className="text-[11px] font-medium uppercase tracking-[0.17em] text-[#66707a]">
                About NexCart
              </p>

             <h1 className="mt-4 max-w-[650px] font-serif text-[47px] font-normal leading-[1.02] tracking-[-0.04em] sm:text-[55px] lg:text-[60px]">
                Technology, thoughtfully curated.
              </h1>

          <p className="mt-5 max-w-[900px] text-[15px] leading-[1.73] text-[#68727c] sm:text-[16px]">
               At NexCart, we believe technology and everyday essentials should be easy to find, enjoyable to use, and built to make life a little better. We carefully curate products from trusted brands, so you can shop with confidence and focus on what matters most. From everyday essentials to the latest technology, we bring thoughtfully selected products together in one simple, seamless experience. Our goal is to make discovering the right products feel effortless, with clear information, dependable service, and a shopping experience designed around you.
              </p>
            </div>

            {/* Transparent editorial hero image */}
         <div className="relative min-h-[300px] overflow-hidden bg-[#f5f2eb] sm:min-h-[340px] lg:min-h-[375px]">
              <img
                src="/about-hero.png"
                alt="NexCart technology collection"
                className="absolute inset-0 h-full w-full object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STORY + VALUES */}
      <section className="bg-[#fbfaf7]">
        <div className="mx-auto max-w-[1400px] px-6 py-14 sm:px-8 lg:px-12 lg:py-[62px]">
          <div className="grid lg:grid-cols-2">
            <div className="pb-12 lg:border-r lg:border-[#e5e1d8] lg:pb-0 lg:pr-14 xl:pr-20">
              <p className="text-[11px] font-medium uppercase tracking-[0.17em] text-[#66707a]">
                Our Story
              </p>

              <h2 className="mt-4 font-serif text-[40px] font-normal leading-[1.03] tracking-[-0.04em] sm:text-[44px]">
                Built for how you live.
              </h2>

              <div className="mt-7 max-w-[520px] space-y-6 text-[14px] leading-[1.65] text-[#68727c] sm:text-[16px]">
                <p>
                  NexCart started with a simple idea — to bring together the
                  best in technology and everyday essentials, all in one place.
                  We’re a team of product lovers, designers and problem
                  solvers, united by a shared belief that great products can
                  make everyday life simpler, easier and more enjoyable.
                </p>

                <p>
                  Today, we’re proud to serve a growing community of customers
                  around the world, helping them discover and use the products
                  that fit their lives.
                </p>
              </div>
            </div>

            <div className="pt-12 lg:pt-0 lg:pl-14 xl:pl-20">
              <p className="text-[11px] font-medium uppercase tracking-[0.17em] text-[#66707a]">
                Our Values
              </p>

              <h2 className="mt-4 font-serif text-[40px] font-normal leading-[1.03] tracking-[-0.04em] sm:text-[44px]">
                Quality. Simplicity. You.
              </h2>

              <div className="mt-7">
                {values.map((value) => (
                  <div
                    key={value.number}
                    className="grid grid-cols-[36px_1fr] gap-4 border-b border-[#e5e1d8] py-5 first:pt-0 last:border-b-0"
                  >
                    <span className="pt-1 text-[11px] text-[#737b84]">
                      {value.number}
                    </span>

                    <div>
                      <h3 className="font-serif text-[19px] leading-tight text-[#23262b]">
                        {value.title}
                      </h3>
                      <p className="mt-1.5 max-w-[480px] text-[13px] leading-5 text-[#727b84]">
                        {value.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GET IN TOUCH */}
      <section className="px-6 pb-14 sm:px-8 lg:px-12 lg:pb-[62px]">
        <div className="mx-auto grid max-w-[1328px] overflow-hidden rounded-[10px] border border-[#e7e2d9] bg-[#f7f5ef]/90 lg:grid-cols-[1.08fr_1.18fr_1fr]">
          <div className="px-7 py-8 sm:px-10 sm:py-9 lg:px-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.17em] text-[#66707a]">
              Get in touch
            </p>

            <h2 className="mt-4 max-w-[350px] font-serif text-[38px] font-normal leading-[1.03] tracking-[-0.038em] sm:text-[42px]">
              Have a question?
              <br />
              We’re here to help.
            </h2>
          </div>

          <div className="border-t border-[#e5e0d7] px-7 py-8 sm:px-10 sm:py-9 lg:border-l lg:border-t-0 lg:px-10">
            <p className="max-w-[385px] text-[14px] leading-6 text-[#68727c]">
              Whether you need help with an order, product information, or
              just want to say hello — get in touch with our team. We’d love
              to hear from you.
            </p>

            <Link
              to="/contact"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-[#151515] px-5 text-sm font-medium text-white transition-colors hover:bg-[#2b2e33]"
            >
              Contact Us
              <ArrowRight size={14} strokeWidth={1.8} />
            </Link>
          </div>

          <div className="space-y-0">
  {/* Customer Support */}
  <div className="flex items-center gap-5 py-5 border-b border-[#ddd9d0]">
    <Mail className="w-6 h-6 text-[#151515] shrink-0" strokeWidth={1.5} />

    <div>
      <h4 className="text-[15px] font-medium text-[#151515]">
        Customer Support
      </h4>
     <a
  href="mailto:support@nexcart.com"
  className="text-[14px] text-[#151515] hover:underline underline-offset-4 transition-all cursor-pointer"
>
  support@nexcart.com
</a>
    </div>
  </div>

  {/* Order Support */}
  <div className="flex items-center gap-5 py-5 border-b border-[#ddd9d0]">
    <PackageOpen
      className="w-6 h-6 text-[#151515] shrink-0"
      strokeWidth={1.5}
    />

    <div>
      <h4 className="text-[15px] font-medium text-[#151515]">
        Order Support
      </h4>
<Link
  to="/profile/orders"
  className="text-[14px] text-[#151515] hover:underline underline-offset-4 transition-all"
>
  Get help with an existing order
</Link>
    </div>
  </div>

  {/* Help Center */}
  <div className="flex items-center gap-5 py-5">
    <CircleHelp
      className="w-6 h-6 text-[#151515] shrink-0"
      strokeWidth={1.5}
    />

    <div>
      <h4 className="text-[15px] font-medium text-[#151515]">
        Help Center
      </h4>
<Link
  to="/contact"
  className="text-[14px] text-[#151515] hover:underline underline-offset-4 transition-all cursor-pointer"
>
  Answers to common questions
</Link>
    </div>
  </div>
</div>
        </div>
      </section>
    </main>
  );
};

export default About;
