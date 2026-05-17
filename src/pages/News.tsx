import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import FloatingContact from "@/components/FloatingContact";
import { Search, Eye, ArrowRight, Newspaper, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { Article } from "@/data/articles";
import { makeSiteUrl } from "@/lib/config";

const PAGE_SIZE = 9;

const News = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Tất cả");
  const [page, setPage] = useState(1);

  useEffect(() => {
    apiGet<Article[]>("/articles")
      .then((data) => { if (Array.isArray(data)) setArticles(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Distinct categories from data
  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => { if (a.category) set.add(a.category); });
    return ["Tất cả", ...Array.from(set)];
  }, [articles]);

  // Featured article = newest one
  const featured = articles[0];
  const rest = articles.slice(1);

  const filtered = useMemo(() => {
    return rest.filter((a) => {
      const matchCategory = activeCategory === "Tất cả" || a.category === activeCategory;
      const q = search.trim().toLowerCase();
      const matchSearch = !q || a.title.toLowerCase().includes(q) || (a.excerpt || "").toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [rest, activeCategory, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Tin tức & Bài viết Mercy"
        description="Cập nhật tin tức công nghệ, hướng dẫn sử dụng, đánh giá và ưu đãi mới nhất từ Mercy — thương hiệu kính thông minh hàng đầu Việt Nam."
        canonical={makeSiteUrl("/news")}
      />
      <Header />

      <main className="container py-6 md:py-10">
        {/* Page header */}
        <div className="mb-6 md:mb-8">
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
              <li><Link to="/" className="hover:text-red-600 transition-colors">Trang chủ</Link></li>
              <li className="text-gray-300">/</li>
              <li className="text-gray-900 font-semibold">Tin tức</li>
            </ol>
          </nav>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-50 ring-1 ring-inset ring-red-100 flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-red-600" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">Tin tức Mercy</h1>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">Cập nhật sản phẩm mới, ưu đãi, hướng dẫn và đánh giá</p>
            </div>
          </div>
        </div>

        {/* Featured */}
        {featured && (
          <Link
            to={`/news/${featured.slug}`}
            className="block mb-6 md:mb-8 bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group"
          >
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-3 aspect-[16/10] md:aspect-auto md:min-h-[320px] overflow-hidden bg-gray-100">
                {featured.image && (
                  <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
              </div>
              <div className="md:col-span-2 p-5 md:p-7 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  {featured.category && (
                    <span className="bg-red-50 text-red-600 font-semibold px-2.5 py-1 rounded-full">{featured.category}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {(featured as any).fullDate || featured.date}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-snug mb-3 group-hover:text-red-600 transition-colors line-clamp-3">
                  {featured.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-red-600 font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                  Đọc bài viết
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === c
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm bài viết..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
            />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="py-20 text-center text-sm text-gray-500">Đang tải bài viết...</div>
        ) : paginated.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-500 bg-white rounded-2xl">
            Không tìm thấy bài viết phù hợp.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {paginated.map((a) => (
                <Link
                  key={a.slug}
                  to={`/news/${a.slug}`}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                    {a.image && (
                      <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-2">
                      {a.category && (
                        <span className="bg-red-50 text-red-600 font-semibold px-2 py-0.5 rounded-full">{a.category}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {a.views || 0}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-red-600 transition-colors mb-2">
                      {a.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{a.excerpt}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-red-600 font-semibold mt-3 group-hover:gap-1.5 transition-all">
                      Đọc thêm <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-red-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                      p === page ? "bg-red-600 text-white shadow-md" : "border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-red-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-red-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
      <FloatingContact />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default News;
