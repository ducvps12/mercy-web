import { useState, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturesBar from "@/components/FeaturesBar";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import CartDrawer from "@/components/CartDrawer";
import CompareBar from "@/components/CompareBar";
import { useShop } from "@/context/ShopContext";
import { Heart, RefreshCw, ShoppingCart, ChevronDown, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { products, formatPrice } from "@/data/products";

const sortOptions = [
  { value: "default", label: "Sắp xếp mặc định" },
  { value: "price-asc", label: "Giá: Thấp đến Cao" },
  { value: "price-desc", label: "Giá: Cao đến Thấp" },
  { value: "name", label: "Theo tên A-Z" },
];

const priceRanges = [
  { label: "Tất cả", min: 0, max: Infinity },
  { label: "Dưới 3 triệu", min: 0, max: 3000000 },
  { label: "3 - 5 triệu", min: 3000000, max: 5000000 },
  { label: "Trên 5 triệu", min: 5000000, max: Infinity },
];

const Shop = () => {
  const [sortBy, setSortBy] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;
  const { addToCart, toggleWishlist, toggleCompare, isInWishlist, isInCompare } = useShop();

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return cats.map((c) => ({ name: c, count: products.filter((p) => p.category === c).length }));
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    const range = priceRanges[selectedPrice];
    result = result.filter((p) => p.price >= range.min && p.price < range.max);
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [selectedCategory, selectedPrice, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Reset page when filters change
  const handleCategoryChange = (cat: string | null) => { setSelectedCategory(cat); setCurrentPage(1); };
  const handlePriceChange = (i: number) => { setSelectedPrice(i); setCurrentPage(1); };
  const handleSortChange = (val: string) => { setSortBy(val); setCurrentPage(1); };

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
    toast(wasIn ? "Đã xoá khỏi so sánh" : "Đã thêm vào so sánh", { description: product.name });
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedPrice(0);
    setCurrentPage(1);
  };

  const hasFilters = selectedCategory !== null || selectedPrice !== 0;

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Danh mục</h3>
        <div className="space-y-1">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
              !selectedCategory ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            Tất cả ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryChange(cat.name)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                selectedCategory === cat.name ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Khoảng giá</h3>
        <div className="space-y-1">
          {priceRanges.map((range, i) => (
            <button
              key={i}
              onClick={() => handlePriceChange(i)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                selectedPrice === i ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/5 transition-colors"
        >
          <X className="w-4 h-4" />
          Xoá bộ lọc
        </button>
      )}
    </div>
  );

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
        <div className="flex items-center justify-between gap-4">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center gap-2 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground hover:border-primary/50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Bộ lọc
            {hasFilters && <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">!</span>}
          </button>
          <div className="hidden md:block" />

          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-background border border-border rounded-lg px-4 py-2.5 pr-10 text-sm text-foreground cursor-pointer hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <span className="text-sm text-muted-foreground border border-border rounded-lg px-4 py-2.5 hidden sm:block">
              {filteredProducts.length} kết quả
            </span>
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar + Grid */}
      <div className="container pb-12">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-60 shrink-0">
            <div className="sticky top-24">
              <SidebarContent />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">Không tìm thấy sản phẩm phù hợp</p>
                <button onClick={clearFilters} className="mt-3 text-primary hover:underline text-sm font-medium">
                  Xoá bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {paginatedProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className="group bg-background rounded-xl border border-border overflow-hidden hover:shadow-xl hover:shadow-foreground/5 transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted/30">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        width={800}
                        height={800}
                      />
                    </Link>

                    <Link to={`/product/${product.id}`} className="block p-4">
                      <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors duration-200">
                        {product.name}
                      </h3>
                      <p className="text-primary font-bold text-base mt-2">
                        {formatPrice(product.price)}
                      </p>
                    </Link>

                    <div className="flex items-center border-t border-border">
                      <button
                        onClick={() => handleToggleCompare(product)}
                        className={`flex-none p-3 transition-all duration-200 ${
                          isInCompare(product.id) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
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
                          isInWishlist(product.id) ? "text-red-500 bg-red-50" : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
                        }`}
                        title="Yêu thích"
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/40" onClick={() => setSidebarOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-[80%] max-w-[320px] bg-background shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Bộ lọc</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

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
