import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { makeSiteUrl } from "@/lib/config";

const Recruitment = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead
        title="Thông tin tuyển dụng"
        description="Thông tin tuyển dụng và cơ hội việc làm tại Mercy."
        canonical={makeSiteUrl("/tuyen-dung")}
      />
      <Header />

      <main>
        <section className="relative bg-secondary text-secondary-foreground overflow-hidden py-16">
          <div className="container mx-auto px-4 text-center">
             <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Tuyển Dụng
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gia nhập đội ngũ Mercy - Cùng chúng tôi kiến tạo các sản phẩm công nghệ tiên phong.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-card rounded-xl border border-border p-8 text-center text-foreground/90">
                <p className="mb-4">Hiện tại chúng tôi chưa có vị trí tuyển dụng nào đang mở.</p>
                <p>Hãy theo dõi trang này hoặc Fanpage của chúng tôi để cập nhật những thông tin tuyển dụng mới nhất trong tương lai.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default Recruitment;
