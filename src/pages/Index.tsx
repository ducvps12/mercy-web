import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsCounter from "@/components/StatsCounter";
import FlashSaleSection from "@/components/FlashSaleSection";
import FeaturesBar from "@/components/FeaturesBar";
import CategorySuggestions from "@/components/CategorySuggestions";
import TestimonialsSection from "@/components/TestimonialsSection";
import ReviewSection from "@/components/ReviewSection";

import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingContact from "@/components/FloatingContact";
import SEOHead from "@/components/SEOHead";
import { SITE_URL, makeSiteUrl } from "@/lib/config";

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mercy",
    url: SITE_URL,
    description: "Thương hiệu kính mắt thông minh, phụ kiện công nghệ độc quyền tại Việt Nam",
    potentialAction: {
      "@type": "SearchAction",
      target: makeSiteUrl("/shop?q={search_term_string}"),
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="min-h-screen bg-[#f0f3f8] pb-16 md:pb-0">
      <SEOHead
        title="Trang chủ"
        description="Mercy - Thương hiệu kính mắt thông minh, balo thông minh, phụ kiện công nghệ độc quyền tại Việt Nam. Sale đến 18%."
        canonical={makeSiteUrl("/")}
        jsonLd={jsonLd}
      />
      <Header />
      <main>
        <HeroSection />
        <StatsCounter />
        <FlashSaleSection />
        <CategorySuggestions />
        <FeaturesBar />
        <TestimonialsSection />
        <ReviewSection />

        <NewsSection />
      </main>
      <Footer />
      <FloatingContact />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default Index;
