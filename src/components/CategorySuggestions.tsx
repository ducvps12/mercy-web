import { useState, useMemo } from "react";
import { formatPrice } from "@/data/products";
import { useNavigate } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import { ShoppingCart, Eye } from "lucide-react";

const categoryTabs = [
  { label: "Tất cả", value: "all" },
  { label: "Kính Thông Minh", value: "Kính Thông Minh AI" },
  { label: "Kính Dịch Thuật", value: "Kính Dịch Thuật" },
  { label: "Kính Có Camera", value: "Kính Có Camera" },
  { label: "Robot AI", value: "Robot AI" },
];

const CategorySuggestions = () => {
  const navigate = useNavigate();
  const { addToCart, products } = useShop();
  const [activeTab, setActiveTab] = useState("all");

  // Filter products based on active tab
  const displayProducts = useMemo(() => {
    const filtered = activeTab === "all"
      ? products.filter(p => p.category !== "Phụ Kiện")
      : products.filter(p => p.category === activeTab);
    return filtered.slice(0, 12);
  }, [activeTab, products]);

  return (
    <section className="py-4 md:py-6">
      <div className="container">
        {/* FPT-style white card wrapper */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Gợi ý cho bạn</h2>
            <a href="/shop" className="text-sm font-semibold text-red-600 hover:underline">
              Xem tất cả →
            </a>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {categoryTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                  activeTab === tab.value
                    ? "bg-red-600 text-white border-red-600 shadow-sm"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
            {displayProducts.map((product) => {
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden group cursor-pointer card-lift hover:border-red-200"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {/* Image */}
                  <div className="relative p-2 bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-28 md:h-32 object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {discount > 0 && (
                      <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        -{discount}%
                      </span>
                    )}

                    {/* Feature tags */}
                    {product.features && product.features.length > 0 && (
                      <div className="absolute bottom-1.5 left-1.5 flex gap-1">
                        <span className="bg-blue-100/90 text-blue-700 text-[8px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-sm">AI</span>
                        <span className="bg-green-100/90 text-green-700 text-[8px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-sm">2K</span>
                        <span className="bg-purple-100/90 text-purple-700 text-[8px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-sm">IP65</span>
                      </div>
                    )}

                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`);
                        }}
                        className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
                        }}
                        className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-2.5">
                    <h3 className="text-[11px] font-medium text-gray-700 line-clamp-2 mb-2 min-h-[28px] group-hover:text-red-600 transition-colors leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-red-600 font-extrabold text-sm">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-gray-400 text-[10px] line-through">
                        {formatPrice(product.originalPrice)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySuggestions;
