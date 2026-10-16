import Hero from "./Hero";
import FeatureIcons from "./FeatureIcons";
import CuratedCollections from "./CuratedCollections";
import FeaturedProducts from "./FeaturedProducts";
import MainPromoBanner from "./MainPromoBanner";
import TrendingNow from "./TrendingNow";
import TrustedBrands from "./TrustedBrands";
import Testimonials from "../Testimonials";
import Footer from "./Footer";


const Home = () => {
  return (
    <>
      <Hero />

      <FeatureIcons />

      <CuratedCollections />

    <FeaturedProducts />


<MainPromoBanner />

<TrendingNow />

<TrustedBrands />

      <Testimonials />

      <Footer />

    </>
  );
};

export default Home;