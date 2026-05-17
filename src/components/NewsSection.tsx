import { useState, useEffect } from "react";
import { Eye, MessageCircle, ArrowRight, Share2 } from "lucide-react";
import { useScrollReveal, useCountUp } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import { apiGet } from "@/lib/api";
import type { Article } from "@/data/articles";

const NewsCard = ({ article, index, isVisible }: { article: Article; index: number; isVisible: boolean }) => {
  const viewCount = useCountUp(article.views || 0, 1200, isVisible);

  return (
    <article
      className={`bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer group card-lift hover:border-red-100 transition-all duration-600 ${
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
            className="w-full h-44 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            width={800}
            height={600}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition-all duration-300" />

          {/* Date badge with pop animation */}
          {article.date && (
            <div className={`absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-center rounded-lg px-3 py-2 shadow-md transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
              style={{ transitionDelay: `${400 + index * 120}ms` }}
            >
              <span className="block text-2xl font-extrabold text-gray-900 leading-none">{article.date}</span>
              <span className="block text-[9px] uppercase text-gray-500 tracking-wide mt-0.5">{article.month}</span>
            </div>
          )}

          {/* Share icon appears on hover */}
          <button className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-red-600 hover:text-white active:scale-90">
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-4 text-gray-400 text-xs mb-2.5">
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {article.comments}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {viewCount} views
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2.5 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
          {article.title}
        </h3>

        <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
          {article.excerpt}
        </p>

        <Link
          to={`/news/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-red-600 font-semibold text-xs hover:text-red-700 transition-all duration-200 group/link"
        >
          Đọc Thêm
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </article>
  );
};

const NewsSection = () => {
  const { ref, isVisible } = useScrollReveal(0.05);
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await apiGet('/articles?limit=4');
        if (data && Array.isArray(data)) {
          setArticlesList(data);
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (isLoading || articlesList.length === 0) return null;

  return (
    <section ref={ref} className="py-4 md:py-6 overflow-hidden">
      <div className="container">
        {/* FPT-style white card wrapper */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
          {/* Section header */}
          <div className={`flex items-center justify-between mb-5 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Tin tức & Cộng đồng
            </h2>
            <Link to="/news" className="text-sm font-semibold text-red-600 hover:underline">
              Xem tất cả →
            </Link>
          </div>

          {/* Articles grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {articlesList.map((article, i) => (
              <NewsCard key={article.slug || i} article={article} index={i} isVisible={isVisible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
