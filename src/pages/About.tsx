import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { SITE_URL, makeSiteUrl } from "@/lib/config";
import { Glasses, Mic, Camera, Globe, Headphones, Sparkles } from "lucide-react";

const features = [
  { icon: Camera, title: "Quay chụp 2K", desc: "Ghi lại mọi khoảnh khắc sắc nét" },
  { icon: Mic, title: "Ghi âm thông minh", desc: "Ghi âm rõ ràng mọi lúc mọi nơi" },
  { icon: Headphones, title: "Nghe gọi Bluetooth", desc: "Kết nối không dây tiện lợi" },
  { icon: Sparkles, title: "Trợ lý AI tiếng Việt", desc: "Hỗ trợ thông minh bằng tiếng Việt" },
  { icon: Globe, title: "Phiên dịch realtime", desc: "Dịch ngôn ngữ theo thời gian thực" },
  { icon: Glasses, title: "Thiết kế thời trang", desc: "Nhẹ gọn, phong cách hiện đại" },
];

const About = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mercy",
    url: SITE_URL,
    description: "Thương hiệu kính thông minh tiên phong tại Việt Nam",
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead
        title="Giới thiệu"
        description="Mercy - Thương hiệu tiên phong trong lĩnh vực kính thông minh tại Việt Nam, mang công nghệ hiện đại đến gần hơn với đời sống hằng ngày."
        canonical={makeSiteUrl("/about")}
        jsonLd={jsonLd}
      />
      <Header />

      <main>
        {/* Hero Banner */}
        <section className="relative bg-secondary text-secondary-foreground overflow-hidden">
          <div className="absolute inset-0 bg-[#1a1a2e]" />
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-[120px]" />
          </div>
          <div className="relative container mx-auto px-4 py-20 md:py-32 text-center">
            <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-4">Về chúng tôi</p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Mercy
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Thương hiệu tiên phong trong lĩnh vực kính thông minh tại Việt Nam
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6 text-foreground/90 leading-relaxed text-[15px] md:text-base">
              <p>
                Mercy là thương hiệu tiên phong trong lĩnh vực kính thông minh tại Việt Nam, với sứ mệnh mang công nghệ hiện đại đến gần hơn với đời sống hằng ngày của mọi người. Chúng tôi tin rằng một chiếc kính không chỉ là phụ kiện thời trang, mà còn có thể trở thành trợ lý cá nhân đa năng, hỗ trợ công việc, học tập và giải trí mọi lúc mọi nơi.
              </p>
              <p>
                Sản phẩm chủ lực hiện tại – <strong className="text-primary">Kính Thông Minh Mercy MCK 5.0</strong> – tích hợp hàng loạt tính năng tiên tiến như quay chụp 2K, ghi âm, nghe gọi qua Bluetooth, trợ lý AI tiếng Việt, phiên dịch realtime… Đây là lựa chọn tối ưu cho người trẻ năng động, dân văn phòng, nhà sáng tạo nội dung và bất kỳ ai muốn nâng cao trải nghiệm sống bằng công nghệ.
              </p>
              <p>
                Mercy cam kết mang đến chất lượng sản phẩm tốt, giá cả hợp lý và dịch vụ hậu mãi tận tâm, để mỗi khách hàng không chỉ mua một chiếc kính, mà còn nhận được một giải pháp công nghệ đồng hành trong cuộc sống.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Tính năng nổi bật</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              Kính Thông Minh Mercy MCK 5.0 – người bạn đồng hành đa năng
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl p-6 text-center border border-border/60 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                  <p className="text-muted-foreground text-xs">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-24 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Vì sao chọn chúng tôi</h2>
            <div className="max-w-3xl mx-auto space-y-6 text-secondary-foreground/80 leading-relaxed text-[15px] md:text-base">
              <p>
                Trong một thế giới ngày càng bận rộn và số hóa, chúng tôi tin rằng công nghệ nên trở nên gần gũi, dễ dùng và thực sự giúp ích cho con người – chứ không chỉ là thứ hào nhoáng, đắt đỏ.
              </p>
              <blockquote className="border-l-4 border-primary pl-6 py-3 my-8 text-lg italic text-secondary-foreground/90">
                "Đưa công nghệ thông minh vào đời sống hàng ngày – thông qua một chiếc kính thời trang, nhẹ gọn nhưng đầy sức mạnh."
              </blockquote>
              <p>Chúng tôi không tạo ra một món đồ công nghệ để trưng bày, mà tạo ra một người bạn đồng hành thực thụ:</p>
              <ul className="space-y-3 pl-2">
                {[
                  "Hỗ trợ bạn ghi lại khoảnh khắc",
                  "Giúp bạn làm việc hiệu quả hơn",
                  "Tự tin giao tiếp hơn",
                  "Và tự do thể hiện chính mình",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                <strong>Kính Thông Minh Mercy</strong> không chỉ dành cho những người rành công nghệ, mà dành cho tất cả mọi người – từ học sinh, sinh viên, dân văn phòng, người sáng tạo nội dung, cho đến những ai yêu thích sự tiện lợi và hiện đại.
              </p>
            </div>
          </div>
        </section>

        {/* Contact / CTA */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Liên hệ & Hợp tác</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed text-[15px]">
              Chúng tôi luôn mở rộng cơ hội hợp tác cùng các cá nhân, doanh nghiệp, đại lý và cộng đồng sáng tạo nội dung để đưa sản phẩm kính thông minh Mercy đến gần hơn với người dùng Việt Nam.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:mercytechglobal@gmail.com"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Email liên hệ
              </a>
              <a
                href="tel:0898273899"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors"
              >
                Gọi: 0898 273 899
              </a>
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

export default About;
