import { useState, useEffect, useMemo } from "react";
import { Zap, Clock } from "lucide-react";
import { products, formatPrice } from "@/data/products";
import { useNavigate } from "react-router-dom";

const FlashSaleSection = () => {
  const navigate = useNavigate();

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

  // Flash sale products (products with flashSalePrice)
  const saleProducts = useMemo(() => {
    return products
      .filter((p) => p.flashSalePrice && p.originalPrice)
      .slice(0, 8);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  // Generate 5 days starting from today
  const timelineDates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 5 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
    });
  }, []);

  const getDiscount = (original: number, sale: number) => {
    return Math.round(((original - sale) / original) * 100);
  };

  return (
    <section className="py-4 md:py-6">
      <div className="container">
        {/* Flash Sale Red Frame Wrapper */}
        <div className="bg-[#DC2B33] rounded-2xl overflow-hidden shadow-sm">
          {/* Header Banner Image */}
          <div className="w-full">
            <img
              src="/border/dealonline.png"
              alt="Deal Online"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Products Grid Container with Thick Red Frame padding */}
          <div className="px-2 pb-2 md:px-3 md:pb-3">
            <div className="bg-white rounded-xl overflow-hidden flex flex-col">
              {/* Timeline Tabs */}
              <div className="flex items-stretch border-b border-gray-200 overflow-x-auto hide-scrollbar">
                {/* Slot 1: Active Slot */}
                <div className="flex-none w-[180px] md:flex-[1.5] py-2.5 px-2 text-center border-b-2 border-[#DC2B33] bg-red-50">
                  <div className="text-sm md:text-base font-bold text-gray-900">
                    10:00, {timelineDates[0]}
                  </div>
                  <div className="text-xs mt-1 flex items-center justify-center gap-1.5 text-gray-800">
                    <span className="font-medium text-[11px] md:text-xs">Bắt đầu sau:</span>
                    <div className="flex items-center gap-0.5">
                      <span className="bg-[#DC2B33] text-white text-[10px] md:text-[11px] font-bold px-1.5 py-0.5 rounded shadow-sm">{pad(timeLeft.hours)}</span>
                      <span className="text-[#DC2B33] font-bold text-[10px]">:</span>
                      <span className="bg-[#DC2B33] text-white text-[10px] md:text-[11px] font-bold px-1.5 py-0.5 rounded shadow-sm">{pad(timeLeft.minutes)}</span>
                      <span className="text-[#DC2B33] font-bold text-[10px]">:</span>
                      <span className="bg-[#DC2B33] text-white text-[10px] md:text-[11px] font-bold px-1.5 py-0.5 rounded shadow-sm">{pad(timeLeft.seconds)}</span>
                    </div>
                  </div>
                </div>

                {/* Other Slots */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-none w-[100px] md:flex-1 py-2.5 px-2 text-center border-b-2 border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50 cursor-pointer">
                    <div className="text-sm md:text-base font-bold text-gray-900">
                      {timelineDates[i]}
                    </div>
                    <div className="text-xs mt-1 font-medium">Sắp diễn ra</div>
                  </div>
                ))}
              </div>

              {/* Products Area */}
              <div className="p-3 md:p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {saleProducts.map((product) => {
                const discount = product.originalPrice
                  ? getDiscount(product.originalPrice, product.flashSalePrice || product.price)
                  : 0;
                const soldPercent = ((product.id % 7) + 4) * 10; // 40-100% stable per product

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-100 rounded-xl overflow-hidden group cursor-pointer card-lift hover:border-red-200"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {/* Image */}
                    <div className="relative p-3 bg-gray-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 md:h-40 object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {/* Discount badge */}
                      {discount > 0 && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          -{discount}%
                        </span>
                      )}
                      {/* Feature badges */}
                      {product.features && product.features.length > 0 && (
                        <div className="absolute bottom-2 left-2 flex gap-1">
                          <span className="bg-blue-100 text-blue-700 text-[9px] font-semibold px-1.5 py-0.5 rounded">AI</span>
                          <span className="bg-green-100 text-green-700 text-[9px] font-semibold px-1.5 py-0.5 rounded">2K</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3 className="text-xs font-medium text-gray-800 line-clamp-2 mb-2 min-h-[32px] group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h3>

                      {/* Progress bar - sold percentage */}
                      <div className="sale-progress-bar mb-2">
                        <div className="sale-progress-fill" style={{ width: `${soldPercent}%` }} />
                        <span className="sale-progress-text">
                          {soldPercent >= 70 ? '🔥 ' : ''}Đã bán {soldPercent}%
                        </span>
                      </div>

                      {/* Prices */}
                      <div className="flex items-end gap-2 flex-wrap">
                        <span className="text-red-600 font-extrabold text-base">
                          {formatPrice(product.flashSalePrice || product.price)}
                        </span>
                      </div>
                      {product.originalPrice && (
                        <div className="flex items-center gap-2 mt-0.5">
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

                      {/* Installment tag */}
                      <div className="mt-2 mb-1">
                        <span className="text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                          Trả góp 0%
                        </span>
                      </div>

                      {/* View detail */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`);
                        }}
                        className="w-full mt-2 flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg transition-colors active:scale-95"
                      >
                        Xem chi tiết →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashSaleSection;
