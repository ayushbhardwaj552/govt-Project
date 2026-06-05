import HeroSection from "./HeroSection.jsx";
import FeaturesSection from "./FeatureSection.jsx";
import HowItWorksSection from "./HowItWorks.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import ImageSlider from "./ImageSlider.jsx";
import MlaProfile from "./MlaProfile.jsx";
import OurGovernment from "./OurGovernment.jsx";
import AgraHighlightsSlider from './AgraHighlightsSlider.jsx';
import PartnerLogos from "./PartnerLogos.jsx";
import NewsAndUpdates from "./NewsAndUpdates.jsx";
const Homepage = () => {
  return (
    <div className="bg-white">
      <Header />
      <ImageSlider/>
      <NewsAndUpdates/>
      <MlaProfile/>
      <AgraHighlightsSlider/>
      <main>
        {/* <HeroSection /> */}
        <FeaturesSection />
        <HowItWorksSection />
              <OurGovernment/>

      </main>
      <PartnerLogos/>
      <Footer />
    </div>
  );
};
export default Homepage;