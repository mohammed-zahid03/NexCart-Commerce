const PromoBanner = () => {
  return (
    <section className="my-16">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl px-10 py-16 text-center shadow-xl">
        
        <span className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
          🔥 Limited Time Offer
        </span>

        <h2 className="text-white text-4xl font-bold mb-4">
          Summer Sale 2026
        </h2>

        <p className="text-white/90 text-lg mb-8">
          Up to 50% OFF on Electronics, Fashion & More
        </p>

        <button className="bg-white text-slate-800 px-8 py-3 rounded-full font-semibold hover:scale-105 transition">
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default PromoBanner;