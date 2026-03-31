import { Eye, MessageCircle } from "lucide-react";
import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";

const articles = [
  {
    image: news1,
    date: "06",
    month: "Tháng 11",
    title: "Công Ty TNHH Công Nghệ Mercy Đồng Hành Cùng Ngày Hội Việc Làm Phường Thủ Đức TP. HCM 2025",
    excerpt: "Mercy – Thương hiệu công nghệ Việt mở rộng cơ hội việc làm cho giới trẻ...",
    views: 217,
    comments: 0,
  },
  {
    image: news2,
    date: "30",
    month: "Tháng 10",
    title: "THƯ NGỎ TỪ GIÁM ĐỐC MERCY – VY THIÊN HÙNG",
    excerpt: "\"Công nghệ chỉ thật sự thông minh, hữu ích khi được sử dụng đúng cách, đúng pháp luật.\"",
    views: 154,
    comments: 0,
  },
  {
    image: news3,
    date: "11",
    month: "Tháng 10",
    title: "So sánh Kính Thông Minh Xiaomi AI Glasses và Kính Thông Minh Mercy",
    excerpt: "Xiaomi vừa ra mắt kính thông minh AI Glasses với nhiều tính năng cao cấp...",
    views: 469,
    comments: 0,
  },
];

const NewsSection = () => {
  return (
    <section className="py-12 md:py-16 bg-mercy-light">
      <div className="container">
        <div className="text-center mb-10">
          <p className="text-primary font-medium text-sm tracking-widest uppercase mb-2">Tin tức & Cộng đồng</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">Tin tức & Cộng đồng</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <article key={i} className="bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="relative overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={800}
                  height={600}
                />
                <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-center rounded-lg px-3 py-1.5">
                  <span className="block text-lg font-bold leading-tight">{article.date}</span>
                  <span className="block text-[10px] uppercase">{article.month}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-foreground text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed mb-3 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center gap-4 text-muted-foreground text-xs">
                  <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {article.comments}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {article.views} views</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
