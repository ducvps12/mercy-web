import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { makeSiteUrl } from "@/lib/config";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead
        title="Liên hệ hợp tác"
        description="Liên hệ và hợp tác cùng Mercy để phát triển kinh doanh."
        canonical={makeSiteUrl("/lien-he")}
      />
      <Header />

      <main>
        <section className="relative bg-secondary text-secondary-foreground overflow-hidden py-16">
          <div className="container mx-auto px-4 text-center">
             <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Liên Hệ Hợp Tác
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trở thành đối tác của Mercy để mang sản phẩm công nghệ tiên tiến tới nhiều khách hàng hơn.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="flex flex-col items-center p-6 bg-card border border-border rounded-xl text-center hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-2">Gọi ngay cho chúng tôi</h3>
                  <a href="tel:0898273899" className="text-primary hover:underline font-semibold">0898 273 899</a>
               </div>

               <div className="flex flex-col items-center p-6 bg-card border border-border rounded-xl text-center hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-2">Gửi email</h3>
                  <a href="mailto:mercytechglobal@gmail.com" className="text-primary hover:underline font-semibold">mercytechglobal@gmail.com</a>
               </div>
            </div>

            <div className="mt-16 bg-muted/50 p-8 rounded-xl border border-border">
                <h2 className="text-2xl font-bold text-center mb-6">Gửi tin nhắn cho chúng tôi</h2>
                <form className="space-y-4 max-w-2xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" placeholder="Họ và tên" className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                        <input type="tel" placeholder="Số điện thoại" className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    </div>
                    <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    <textarea placeholder="Nội dung tin nhắn" rows={4} className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"></textarea>
                    <button type="button" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors">
                        Gửi Yêu Cầu
                    </button>
                </form>
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

export default Contact;
