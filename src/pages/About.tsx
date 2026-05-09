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
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-4 text-gray-900">Tính năng nổi bật</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto text-base md:text-lg font-medium">
              Kính Thông Minh Mercy MCK 5.0 – người bạn đồng hành đa năng
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 md:p-7 text-center border border-gray-200 hover:border-red-300 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <f.icon className="w-7 h-7 md:w-9 md:h-9 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-sm md:text-base mb-2 text-gray-900">{f.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{f.desc}</p>
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
                href="mailto:mercyglobalstore@gmail.com"
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
