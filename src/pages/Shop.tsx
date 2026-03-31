import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturesBar from "@/components/FeaturesBar";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import CartDrawer from "@/components/CartDrawer";
import CompareBar from "@/components/CompareBar";
import { useShop } from "@/context/ShopContext";
import { Heart, RefreshCw, ShoppingCart, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { products, formatPrice } from "@/data/products";

const products = [
  { id: 1, name: "Kính Nghe Nhạc Thông Minh Bluetooth Mercy KNNT5.0", price: 2990000, image: glasses1 },
  { id: 2, name: "Kính Râm Nghe Nhạc Thông Minh Bluetooth Mercy KNND5.0", price: 3490000, image: glasses2 },
  { id: 3, name: "Kính Thông Minh Bluetooth Mercy 6.0 – Camera Quay Video/Chụp Hình", price: 5990000, image: glasses3 },
  { id: 4, name: "Kính Thông Minh Mercy MCK5.0 [Bản Black]", price: 4990000, image: glasses4 },
  { id: 5, name: "Kính Thông Minh Mercy MCK5.0 [Bản White]", price: 4990000, image: glasses5 },
  { id: 6, name: "Kính Thông Minh Mercy MCK5.1 [Bản Black]", price: 5990000, image: glasses7 },
  { id: 7, name: "Kính Thông Minh Mercy MCK5.1 [Bản White]", price: 5990000, image: glasses1 },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN").format(price) + "đ";

const sortOptions = [
  { value: "default", label: "Sắp xếp mặc định" },
  { value: "price-asc", label: "Giá: Thấp đến Cao" },
  { value: "price-desc", label: "Giá: Cao đến Thấp" },
  { value: "name", label: "Theo tên A-Z" },
];

const Shop = () => {
  const [sortBy, setSortBy] = useState("default");
  const { addToCart, toggleWishlist, toggleCompare, isInWishlist, isInCompare } = useShop();

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product);
    toast.success("Đã thêm vào giỏ hàng", { description: product.name });
  };

  const handleToggleWishlist = (product: typeof products[0]) => {
    const wasIn = isInWishlist(product.id);
    toggleWishlist(product);
    toast(wasIn ? "Đã xoá khỏi yêu thích" : "Đã thêm vào yêu thích", { description: product.name });
  };

  const handleToggleCompare = (product: typeof products[0]) => {
    const wasIn = isInCompare(product.id);
    toggleCompare(product);
    if (wasIn) {
      toast("Đã xoá khỏi so sánh", { description: product.name });
    } else {
      toast.success("Đã thêm vào so sánh", { description: product.name });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />

      {/* Page Header */}
      <section className="bg-mercy-warm-bg border-b border-border">
        <div className="container py-10 md:py-14 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground italic" style={{ fontFamily: "Georgia, serif" }}>
            Shop
          </h1>
          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span>—</span>
            <span className="text-foreground">Sản phẩm</span>
          </div>
        </div>
      </section>

      {/* Sort Bar */}
      <div className="container py-6">
        <div className="flex items-center justify-end gap-4">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-background border border-border rounded-lg px-4 py-2.5 pr-10 text-sm text-foreground cursor-pointer hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <span className="text-sm text-muted-foreground border border-border rounded-lg px-4 py-2.5">
            Hiển thị tất cả {products.length} kết quả
          </span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {sortedProducts.map((product, i) => (
            <div
              key={product.id}
              className="group bg-background rounded-xl border border-border overflow-hidden hover:shadow-xl hover:shadow-foreground/5 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-muted/30">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  width={800}
                  height={800}
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors duration-200">
                  {product.name}
                </h3>
                <p className="text-primary font-bold text-base mt-2">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center border-t border-border">
                <button
                  onClick={() => handleToggleCompare(product)}
                  className={`flex-none p-3 transition-all duration-200 ${
                    isInCompare(product.id)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                  title="So sánh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 border-x border-border"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={() => handleToggleWishlist(product)}
                  className={`flex-none p-3 transition-all duration-200 ${
                    isInWishlist(product.id)
                      ? "text-red-500 bg-red-50"
                      : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
                  }`}
                  title="Yêu thích"
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FeaturesBar />
      <Footer />
      <BottomNav />
      <ScrollToTop />
      <CartDrawer />
      <CompareBar />
    </div>
  );
};

export default Shop;
