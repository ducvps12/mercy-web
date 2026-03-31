import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesBar from "@/components/FeaturesBar";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      <HeroSection />
      <FeaturesBar />
      <NewsSection />
      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default Index;
