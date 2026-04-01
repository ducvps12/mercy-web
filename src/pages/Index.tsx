import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesBar from "@/components/FeaturesBar";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mercy",
    url: "https://mercy.vn",
    description: "Thương hiệu kính mắt thông minh, phụ kiện công nghệ độc quyền tại Việt Nam",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://mercy.vn/shop?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead
        title="Trang chủ"
        description="Mercy - Thương hiệu kính mắt thông minh, balo thông minh, phụ kiện công nghệ độc quyền tại Việt Nam. Sale đến 30%."
        canonical="https://mercy.vn/"
        jsonLd={jsonLd}
      />
      <Header />
      <main>
        <HeroSection />
        <FeaturesBar />
        <NewsSection />
      </main>
      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default Index;
