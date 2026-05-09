import { useState, useEffect, useMemo } from "react";
import { Zap, Clock, Filter } from "lucide-react";
import { formatPrice } from "@/data/products";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { makeSiteUrl } from "@/lib/config";
import { useShop } from "@/context/ShopContext";

const FlashSale = () => {
  const navigate = useNavigate();
  const { products } = useShop();
  const [filter, setFilter] = useState("all");

  // Countdown to end of day
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
      return {
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    };
    setTimeLeft(calc());
    const timer = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(timer);
  }, []);

  const saleProducts = useMemo(() => {
    const items = products.filter((p: any) => p.isFlashSale);
    if (filter === "all") return items;
    return items.filter((p) => p.category === filter);
  }, [filter, products]);

  const categories = useMemo(() => {
    const cats = new Set(
      products.filter((p: any) => p.isFlashSale).map((p) => p.category)
    );
    return ["all", ...Array.from(cats)];
  }, [products]);

  const getDiscount = (original: number, sale: number) =>
    Math.round(((original - sale) / original) * 100);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead
        title="Flash Sale"
        description="Flash Sale giảm giá sốc tại Mercy - Kính thông minh và phụ kiện công nghệ giá tốt nhất"
        canonical={makeSiteUrl("/flash-sale")}
      />
      <Header />

      <main>
        {/* Compact Flash Sale Header */}
        <section className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-5 md:py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-red-600 fill-red-600" />
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Flash Sale</h1>
                <span className="text-sm text-gray-500 font-medium hidden md:inline">– Deal Online Giảm Kịch Sàn</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-gray-600">Kết thúc trong</span>
                <div className="flex items-center gap-1.5">
                  {[
                    { val: pad(timeLeft.hours), label: "h" },
                    { val: pad(timeLeft.minutes), label: "m" },
                    { val: pad(timeLeft.seconds), label: "s" },
                  ].map((item, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      <span className="bg-red-600 text-white font-bold text-sm px-2 py-1 rounded-md min-w-[32px] text-center">{item.val}</span>
                      {i < 2 && <span className="text-gray-400 font-bold">:</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Products */}
        <section className="py-8 md:py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* Category Filter */}
            <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    filter === cat
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200"
                  }`}
                >
                  {cat === "all" ? "Tất cả" : cat}
                </button>
              ))}
            </div>

            {/* Products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {saleProducts.map((product: any) => {
                const discount = product.originalPrice
                  ? getDiscount(product.originalPrice, product.price)
                  : product.flashSalePercent || 0;
                const soldPercent = ((product.id % 7) + 4) * 10;

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden group cursor-pointer card-lift hover:border-red-200 hover:shadow-lg transition-all duration-300"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="relative p-4 bg-gray-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-36 md:h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {discount > 0 && (
                        <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                          -{discount}%
                        </span>
                      )}
                      {product.features && product.features.length > 0 && (
                        <div className="absolute bottom-3 left-3 flex gap-1">
                          <span className="bg-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded">AI</span>
                          <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded">2K</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-3 min-h-[40px] group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h3>

                      <div className="sale-progress-bar mb-3">
                        <div className="sale-progress-fill" style={{ width: `${soldPercent}%` }} />
                        <span className="sale-progress-text">
                          {soldPercent >= 70 ? "🔥 " : ""}Đã bán {soldPercent}%
                        </span>
                      </div>

                      <div className="flex items-end gap-2 flex-wrap">
                        <span className="text-red-600 font-extrabold text-lg">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      {product.originalPrice && (
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-gray-400 text-xs line-through">
                            {formatPrice(product.originalPrice)}
                          </p>
                          {discount > 0 && (
                            <span className="text-red-500 text-[10px] font-bold bg-red-50 px-1.5 py-0.5 rounded">
                              -{discount}%
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-2 mb-1">
                        <span className="text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                          Trả góp 0%
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`);
                        }}
                        className="w-full mt-3 flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 rounded-lg transition-colors active:scale-95"
                      >
                        Xem chi tiết →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {saleProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">Không có sản phẩm Flash Sale trong danh mục này</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default FlashSale;
