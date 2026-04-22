import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";

const faqs = [
  {
    question: "Kính thông minh Mercy hoạt động như thế nào?",
    answer: "Kính tương tác với các ứng dụng di động qua kết nối Bluetooth, với các tính năng như nghe gọi, hỗ trợ trợ lý AI bằng giọng nói, quay video trực tiếp và rất nhiều tiện ích khác theo từng dòng sản phẩm."
  },
  {
    question: "Kính Mercy có hỗ trợ tiếng Việt không?",
    answer: "Có, các dòng sản phẩm hiện đại của Mercy đều hỗ trợ Trợ lý AI và tính năng nhận diện, phiên dịch trực tiếp bằng tiếng Việt, giúp người dùng sử dụng thuận tiện nhất."
  },
  {
    question: "Thời lượng pin của kính thông minh là bao lâu?",
    answer: "Tuỳ thuộc vào cách sử dụng, thời gian hoạt động của pin thường kéo dài từ 4 - 8 tiếng liên tục sau một lần sạc đầy (khoảng 2 tiếng)."
  },
  {
    question: "Khi mua có được bảo hành không?",
    answer: "Tất cả kính Mercy đều được bảo hành chính hãng 12 tháng, cùng với chính sách dùng thử tuỳ theo từng chương trình."
  },
  {
    question: "Tôi có thể mua sản phẩm ở đâu?",
    answer: "Quý khách có thể đặt hàng trực tiếp trên website này, qua Fanpage của Mercy, hoặc trực tiếp ghé thăm các chi nhánh ở TP.HCM và Hà Nội."
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead
        title="Câu hỏi thường gặp"
        description="Giải đáp các thắc mắc về kính thông minh và sản phẩm công nghệ tại Mercy."
        canonical="https://mercy.vn/faq"
      />
      <Header />

      <main>
        <section className="relative bg-secondary text-secondary-foreground overflow-hidden py-16">
          <div className="container mx-auto px-4 text-center">
             <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Câu Hỏi Thường Gặp
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tìm câu trả lời nhanh chóng cho thắc mắc của bạn về sản phẩm và dịch vụ của Mercy.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
             <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <details key={index} className="group border border-border rounded-lg bg-card overflow-hidden">
                        <summary className="font-semibold text-foreground px-6 py-4 cursor-pointer list-none flex justify-between items-center hover:bg-muted/50 transition-colors">
                            {faq.question}
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <div className="px-6 pb-4 text-muted-foreground border-t border-border mt-2 pt-4">
                            {faq.answer}
                        </div>
                    </details>
                ))}
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

export default FAQ;
