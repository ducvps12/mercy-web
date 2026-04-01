import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturesBar from "@/components/FeaturesBar";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import CartDrawer from "@/components/CartDrawer";
import SEOHead from "@/components/SEOHead";
import { useShop } from "@/context/ShopContext";
import { products, formatPrice } from "@/data/products";
import { Heart, RefreshCw, ShoppingCart, Minus, Plus, ChevronRight, Truck, ShieldCheck, RotateCcw, Star } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const { addToCart, toggleWishlist, toggleCompare, isInWishlist, isInCompare } = useShop();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Sản phẩm không tồn tại</h1>
            <Link to="/shop" className="text-primary hover:underline">← Quay lại cửa hàng</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`, { description: product.name });
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead
        title={product.name}
        description={product.description}
        canonical={`https://mercy.vn/product/${product.id}`}
        ogType="product"
        jsonLd={productJsonLd}
      />

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container py-3 flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto">
          <Link to="/" className="hover:text-primary transition-colors shrink-0">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link to="/shop" className="hover:text-primary transition-colors shrink-0">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-foreground truncate">{product.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted/30 border border-border">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    i === selectedImage ? "border-primary shadow-md" : "border-border hover:border-primary/50"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-primary font-medium mb-2">{product.category}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < 4 ? "text-primary fill-primary" : "text-border"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(12 đánh giá)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
              {product.originalPrice && (
                <span className="bg-destructive/10 text-destructive text-xs font-bold px-2 py-1 rounded-md">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Quantity + Add to cart */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-foreground">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-[0.98]"
              >
                <ShoppingCart className="w-5 h-5" />
                Thêm vào giỏ hàng
              </button>
            </div>

            {/* Wishlist + Compare */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => {
                  toggleWishlist(product);
                  toast(isInWishlist(product.id) ? "Đã xoá khỏi yêu thích" : "Đã thêm vào yêu thích");
                }}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isInWishlist(product.id) ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                }`}
              >
                <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                {isInWishlist(product.id) ? "Đã yêu thích" : "Thêm vào yêu thích"}
              </button>
              <span className="text-border">|</span>
              <button
                onClick={() => {
                  toggleCompare(product);
                  toast(isInCompare(product.id) ? "Đã xoá khỏi so sánh" : "Đã thêm vào so sánh");
                }}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isInCompare(product.id) ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                {isInCompare(product.id) ? "Đang so sánh" : "So sánh"}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
              {[
                { icon: Truck, text: "Miễn phí vận chuyển" },
                { icon: ShieldCheck, text: "Bảo hành 12 tháng" },
                { icon: RotateCcw, text: "Đổi trả 30 ngày" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 md:mt-16">
          <div className="flex border-b border-border">
            {[
              { key: "desc" as const, label: "Mô tả" },
              { key: "specs" as const, label: "Thông số kỹ thuật" },
              { key: "reviews" as const, label: "Đánh giá (12)" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 text-sm font-semibold transition-colors relative ${
                  activeTab === tab.key ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === "desc" && (
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                <p>{product.description}</p>
                <p className="mt-4">
                  Sản phẩm được thiết kế với chất liệu cao cấp, phù hợp sử dụng hàng ngày. 
                  Kết nối Bluetooth ổn định, âm thanh rõ ràng, micro tích hợp cho phép nghe gọi rảnh tay. 
                  Tương thích với mọi thiết bị iOS và Android.
                </p>
              </div>
            )}
            {activeTab === "specs" && (
              <div className="max-w-lg">
                {product.specs.map((spec, i) => (
                  <div
                    key={i}
                    className={`flex justify-between py-3 text-sm ${i < product.specs.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <span className="font-medium text-foreground">{spec.label}</span>
                    <span className="text-muted-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="text-center py-12 text-muted-foreground">
                <Star className="w-10 h-10 mx-auto mb-3 text-border" />
                <p className="font-medium">Chưa có đánh giá nào</p>
                <p className="text-sm mt-1">Hãy là người đầu tiên đánh giá sản phẩm này</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-foreground mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group bg-background rounded-xl border border-border overflow-hidden hover:shadow-xl hover:shadow-foreground/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-square overflow-hidden bg-muted/30">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">{p.name}</h3>
                  <p className="text-primary font-bold text-base mt-2">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <FeaturesBar />
      <Footer />
      <BottomNav />
      <ScrollToTop />
      <CartDrawer />
    </div>
  );
};

export default ProductDetail;
