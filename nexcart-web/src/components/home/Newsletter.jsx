const Newsletter = () => {
  return (
    <section className="my-16">
      <div className="bg-slate-900 rounded-2xl py-12 px-8 text-center text-white">

        <h2 className="text-4xl font-bold mb-4">
           Join the NexCart Community
        </h2>

        <p className="mb-8 text-lg">
          Get exclusive deals, early access to new arrivals, and special member offers.        
          </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-white text-black px-4 py-3 rounded-lg flex-1 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;