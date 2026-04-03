import { Eye, MessageCircle, ArrowRight, Share2 } from "lucide-react";
import { useScrollReveal, useCountUp } from "@/hooks/useScrollReveal";
import { articles } from "@/data/articles";
import { Link } from "react-router-dom";

const articles = [
  {
    image: news1,
    date: "6",
    month: "THÁNG MƯỜI MỘT",
    title: "Công Ty TNHH Công Nghệ Mercy Đồng Hành Cùng Ngày Hội Việc Làm Phường Thủ Đức TP. HCM 2025",
    excerpt: "Mercy – Thương hiệu công nghệ Việt mở rộng cơ hội việc làm cho giới trẻ Sáng ngày 06/11/2025, Công ty TNHH Công Nghệ Mercy – thương hiệu tiên phong…",
    views: 217,
    comments: 0,
  },
  {
    image: news2,
    date: "30",
    month: "THÁNG 10",
    title: "THƯ NGỎ TỪ GIÁM ĐỐC MERCY – VY THIÊN HÙNG",
    excerpt: "\"Công nghệ chỉ thật sự thông minh, hữu ích khi được sử dụng đúng cách, đúng pháp luật.\" — Vy Thiên Hùng, Giám đốc Công Ty TNHH Công Nghệ Mercy…",
    views: 154,
    comments: 0,
  },
  {
    image: null,
    date: "",
    month: "",
    title: "HƯỚNG DẪN SỬ DỤNG KÍNH THÔNG MINH MERCY MCK 5.0",
    excerpt: "Hướng dẫn sử dụng Kính thông minh Mercy MCK 5.0 – Chi tiết A-Z cho người mới bắt đầu…",
    views: 254,
    comments: 0,
  },
  {
    image: news3,
    date: "11",
    month: "THÁNG 10",
    title: "So sánh Kính Thông Minh Xiaomi AI Glasses và Kính Thông Minh Mercy",
    excerpt: "Xiaomi vừa ra mắt kính thông minh AI Glasses với nhiều tính năng cao cấp. Tuy nhiên, Kính Thông Minh Mercy MCK 5.0 lại là lựa chọn thực tế hơn…",
    views: 469,
    comments: 0,
  },
];

const NewsCard = ({ article, index, isVisible }: { article: typeof articles[0]; index: number; isVisible: boolean }) => {
  const viewCount = useCountUp(article.views, 1200, isVisible);

  return (
    <article
      className={`bg-background rounded-xl border border-border overflow-hidden mercy-card-hover cursor-pointer group transition-all duration-600 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${250 + index * 120}ms` }}
    >
      {/* Image with overlay effects */}
      {article.image && (
        <div className="relative overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-48 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            width={800}
            height={600}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-300" />

          {/* Date badge with pop animation */}
          {article.date && (
            <div className={`absolute top-3 left-3 bg-background/95 backdrop-blur-sm text-center rounded-lg px-3 py-2 shadow-md transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
              style={{ transitionDelay: `${400 + index * 120}ms` }}
            >
              <span className="block text-2xl font-extrabold text-foreground leading-none">{article.date}</span>
              <span className="block text-[9px] uppercase text-muted-foreground tracking-wide mt-0.5">{article.month}</span>
            </div>
          )}

          {/* Share icon appears on hover */}
          <button className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-primary-foreground active:scale-90">
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-4 text-muted-foreground text-xs mb-3">
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {article.comments}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {viewCount} views
          </span>
        </div>

        <h3 className="font-bold text-foreground text-sm leading-snug mb-3 line-clamp-3 group-hover:text-primary transition-colors duration-300">
          {article.title}
        </h3>

        <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-foreground font-semibold text-xs hover:text-primary transition-all duration-200 group/link underline-animate py-0.5"
        >
          Đọc Thêm
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-2" />
        </a>
      </div>
    </article>
  );
};

const NewsSection = () => {
  const { ref, isVisible } = useScrollReveal(0.05);

  return (
    <section ref={ref} className="py-14 md:py-20 overflow-hidden">
      <div className="container">
        {/* Section header */}
        <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className={`text-primary font-semibold text-sm tracking-widest uppercase mb-2 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '100ms' }}
          >
            Tin tức & Cộng đồng
          </p>
          <h2 className={`text-2xl md:text-4xl font-extrabold text-foreground transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '200ms' }}
          >
            Tin tức & Cộng đồng
          </h2>
          {/* Decorative underline */}
          <div className={`mx-auto mt-3 h-1 rounded-full bg-primary transition-all duration-800 ${isVisible ? 'w-16 opacity-100' : 'w-0 opacity-0'}`}
            style={{ transitionDelay: '400ms' }}
          />
        </div>

        {/* Articles grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, i) => (
            <NewsCard key={i} article={article} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
