import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import KolSection from "@/components/KolSection";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSlider />
      <KolSection />
      <NewsSection />
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
