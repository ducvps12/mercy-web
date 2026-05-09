import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturesBar from "@/components/FeaturesBar";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import CheckoutPopup from "@/components/CheckoutPopup";
import { useShop } from "@/context/ShopContext";
import { formatPrice } from "@/data/products";
import { Heart, RefreshCw, ChevronRight, ChevronLeft, Truck, ShieldCheck, RotateCcw, Star, Phone, Headphones, Check, X, Loader2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { getReviewSummary, type Review } from "@/data/reviews";
import { apiGet, apiPost } from "@/lib/api";
import { makeSiteUrl } from "@/lib/config";

// Warranty packages
const warrantyPackages = [
  { name: "BH 3 Tháng", price: 550000, badge: "" },
  { name: "BH 6 Tháng", price: 650000, badge: "Phổ biến" },
  { name: "BH 12 Tháng", price: 900000, badge: "Tốt nhất" },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCartWithQuantity, toggleWishlist, toggleCompare, isInWishlist, isInCompare, products } = useShop();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedWarranty, setSelectedWarranty] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"info" | "desc" | "specs" | "reviews">("info");
  const [scrolled, setScrolled] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Review system state
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState(3);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await apiGet(`/products/${id}`);
        if (!data.images || data.images.length === 0) {
          data.images = [data.image || ""];
        }
        setProduct(data);
      } catch (err: any) {
        console.error("API failed, fallback to local:", err);
        const localProduct = products.find((p) => p.id === Number(id)) || products.find((p) => p.sku === id);
        setProduct(localProduct || null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch reviews data
  const fetchReviews = async () => {
    if (!product?.id) return;
    try {
      const data = await apiGet(`/reviews/${product.id}?limit=50`);
      if (Array.isArray(data)) setAllReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product?.id]);

  // Sticky buy bar on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 400);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Sản phẩm không tồn tại</h1>
            <Link to="/shop" className="text-red-600 hover:underline">← Quay lại cửa hàng</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);
  const upsellProducts = products.filter((p) => p.id !== product.id && p.price < product.price).slice(0, 3);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const totalPrice = product.price * quantity + (selectedWarranty !== null ? warrantyPackages[selectedWarranty].price : 0);

  // Review summaries
  const parsedReviews: Review[] = allReviews.map(r => ({
    name: r.name,
    avatar: r.avatarLetter,
    color: r.avatarColor,
    rating: r.rating,
    date: r.date,
    verified: r.verified,
    text: r.text,
    helpful: r.helpful,
    images: r.imageUrl ? [r.imageUrl] : []
  }));

  const reviewSummary = getReviewSummary(parsedReviews);
  const visibleReviews = parsedReviews.slice(0, reviewsToShow);
  const remainingReviews = parsedReviews.length - reviewsToShow;

  const handleSubmitReview = async () => {
    if (!newReviewName.trim() || !newReviewText.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setSubmittingReview(true);
    try {
      await apiPost('/reviews', {
        productId: String(product.id),
        name: newReviewName.trim(),
        rating: newReviewRating,
        text: newReviewText.trim(),
      });
      await fetchReviews();
      setShowWriteReview(false);
      setNewReviewName("");
      setNewReviewRating(5);
      setNewReviewText("");
      toast.success("Đã gửi đánh giá thành công! 🎉");
    } catch (error) {
      toast.error("Gửi đánh giá thất bại.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBuyNow = () => {
    addToCartWithQuantity(product, quantity);
    if (selectedWarranty !== null) {
      const wp = warrantyPackages[selectedWarranty];
      addToCartWithQuantity({
        id: product.id + 10000,
        name: `${wp.name} - ${product.name}`,
        price: wp.price,
        image: product.image,
        images: [product.image],
        description: `Gói bảo hành ${wp.name}`,
        specs: [],
        category: "Bảo hành",
        sku: `BH-${product.sku}`,
      }, 1);
    }
    setShowCheckout(true);
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <SEOHead
        title={product.name}
        description={product.description}
        canonical={makeSiteUrl(`/product/${product.id}`)}
        ogType="product"
        jsonLd={productJsonLd}
      />
      <Header />

      {/* ═══ Sticky Buy Bar (shows on scroll) ═══ */}
      <div className={`fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm transition-all duration-300 ${scrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
        <div className="container flex items-center justify-between h-14 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover border" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
              <p className="text-xs text-gray-500">{product.sku}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-lg font-bold text-red-600">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through hidden sm:inline">{formatPrice(product.originalPrice)}</span>
            )}
            <button
              onClick={handleBuyNow}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm active:scale-95 transition-all"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Breadcrumb ═══ */}
      <nav className="bg-white border-b border-gray-100">
        <ol className="container py-3 flex items-center gap-2 text-sm text-gray-500 list-none">
          <li><Link to="/" className="hover:text-red-600 transition-colors">Trang chủ</Link></li>
          <li><ChevronRight className="w-3.5 h-3.5" /></li>
          <li><Link to="/shop" className="hover:text-red-600 transition-colors">Cửa hàng</Link></li>
          <li><ChevronRight className="w-3.5 h-3.5" /></li>
          <li className="text-gray-800 truncate font-medium">{product.name}</li>
        </ol>
      </nav>

      {/* ═══ Product Main Section ═══ */}
      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-20">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Nav arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((selectedImage - 1 + product.images.length) % product.images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((selectedImage + 1) % product.images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
                {/* Discount badge */}
                {discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    -{discount}%
                  </span>
                )}
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2 p-3 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      i === selectedImage ? "border-red-500 shadow-md" : "border-gray-200 hover:border-red-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-7 space-y-4">
            {/* Title */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              <p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-0.5">
                  <span className="text-sm font-bold text-gray-800">{reviewSummary.avgRating}</span>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(reviewSummary.avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-400">{reviewSummary.totalReviews} đánh giá</span>
                <span className="text-xs text-gray-300">|</span>
                <span className="text-xs text-gray-400">Đã bán 156</span>
              </div>

              {/* Price Block */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-end gap-3">
                  <span className="text-2xl md:text-3xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-base text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                      <span className="text-sm text-red-600 font-bold">-{discount}%</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Warranty Packages */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-500" />
                Chọn gói bảo hành
              </h3>
              <div className="space-y-2">
                {warrantyPackages.map((wp, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedWarranty(selectedWarranty === i ? null : i)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                      selectedWarranty === i
                        ? "border-red-500 bg-red-50/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedWarranty === i ? "border-red-600 bg-red-600" : "border-gray-300"
                      }`}>
                        {selectedWarranty === i && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{wp.name}</span>
                      {wp.badge && (
                        <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">{wp.badge}</span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-red-600">+{formatPrice(wp.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badges - FPT style */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Chính sách sản phẩm</h3>
              {product.footerInfo ? (
                <div className="text-sm text-gray-600 whitespace-pre-wrap">
                  {product.footerInfo}
                </div>
              ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: ShieldCheck, text: "Hàng chính hãng - BH 15 ngày", color: "text-green-600" },
                  { icon: Truck, text: "Giao hàng miễn phí toàn quốc", color: "text-blue-600" },
                  { icon: RotateCcw, text: "Hỗ trợ kỹ thuật từ xa 24/7", color: "text-orange-500" },
                  { icon: Headphones, text: "Kỹ thuật viên hỗ trợ trực tuyến", color: "text-purple-600" },
                ].map(({ icon: Icon, text, color }, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Icon className={`w-4 h-4 mt-0.5 ${color} flex-shrink-0`} />
                    <span className="text-xs text-gray-600">{text}</span>
                  </div>
                ))}
              </div>
              )}
            </div>

            {/* Quantity Selector + Price Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-800">Số lượng</span>
                <div className="flex items-center gap-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <div className="w-12 h-9 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                    <span className="text-sm font-bold text-gray-900">{quantity}</span>
                  </div>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                    className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Price summary */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sản phẩm ({quantity}x)</span>
                  <span className="font-semibold text-gray-800">{formatPrice(product.price * quantity)}</span>
                </div>
                {selectedWarranty !== null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{warrantyPackages[selectedWarranty].name} (1x)</span>
                    <span className="font-semibold text-gray-800">{formatPrice(warrantyPackages[selectedWarranty].price)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-1.5 flex justify-between">
                  <span className="text-sm font-bold text-gray-800">Tạm tính</span>
                  <span className="text-lg font-extrabold text-red-600">{formatPrice(product.price * quantity + (selectedWarranty !== null ? warrantyPackages[selectedWarranty].price : 0))}</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <button
                onClick={handleBuyNow}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl text-base active:scale-[0.98] transition-all"
              >
                Mua ngay
              </button>
              <a
                href="tel:0898273899"
                className="w-full flex items-center justify-center gap-2 border-2 border-red-600 text-red-600 font-bold py-3.5 rounded-xl text-sm hover:bg-red-50 transition-all active:scale-[0.98]"
              >
                <Phone className="w-4 h-4" />
                Gọi tư vấn: 0898 273 899
              </a>

              {/* Wishlist + Compare */}
              <div className="flex items-center justify-center gap-6 pt-2">
                <button
                  onClick={() => {
                    toggleWishlist(product);
                    toast(isInWishlist(product.id) ? "Đã xoá khỏi yêu thích" : "Đã thêm vào yêu thích");
                  }}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    isInWishlist(product.id) ? "text-red-500" : "text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                  Yêu thích
                </button>
                <button
                  onClick={() => {
                    toggleCompare(product);
                    toast(isInCompare(product.id) ? "Đã xoá khỏi so sánh" : "Đã thêm vào so sánh");
                  }}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    isInCompare(product.id) ? "text-red-600" : "text-gray-400 hover:text-red-600"
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  So sánh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Tabs Section ═══ */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {[
              { key: "info" as const, label: "⭐ Thông tin sản phẩm" },
              { key: "desc" as const, label: "Mô tả sản phẩm" },
              { key: "specs" as const, label: "Thông số kỹ thuật" },
              { key: "reviews" as const, label: `Đánh giá (${reviewSummary.totalReviews})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors relative ${
                  activeTab === tab.key
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900" />
                )}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === "info" && (
              <div className="space-y-4">
                {/* Quick specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {product.specs.slice(0, 4).map((spec, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">{spec.label}</p>
                      <p className="text-sm font-bold text-gray-800">{spec.value}</p>
                    </div>
                  ))}
                </div>
                {/* Features (VN & EN) */}
                {(product.featuresVn || product.featuresEn) && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-2">Tính năng nổi bật</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.featuresVn && (
                        <div className="space-y-2 relative p-4 rounded-xl border border-gray-100 bg-white">
                          <span className="absolute -top-2.5 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">Vietnamese</span>
                          {product.featuresVn.split('\n').filter(Boolean).map((f: string, i: number) => (
                            <div key={i} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{f}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {product.featuresEn && (
                        <div className="space-y-2 relative p-4 rounded-xl border border-gray-100 bg-gray-50">
                          <span className="absolute -top-2.5 left-4 bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded">English</span>
                          {product.featuresEn.split('\n').filter(Boolean).map((f: string, i: number) => (
                            <div key={i} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{f}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "desc" && (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
            )}
            {activeTab === "specs" && (
              <div className="max-w-lg">
                {product.specs.map((spec, i) => (
                  <div
                    key={i}
                    className={`flex justify-between py-3 text-sm ${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } px-4 rounded-lg`}
                  >
                    <span className="font-medium text-gray-500">{spec.label}</span>
                    <span className="font-semibold text-gray-800">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Rating Summary */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Overall score */}
                  <div className="text-center px-6 py-4 bg-gray-50 rounded-xl border border-gray-100 min-w-[160px]">
                    <div className="text-4xl font-extrabold text-gray-900">{reviewSummary.avgRating}</div>
                    <div className="flex items-center justify-center gap-0.5 mt-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(reviewSummary.avgRating) ? "text-amber-400 fill-amber-400" : "text-amber-400 fill-amber-400/30"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 font-medium">{reviewSummary.totalReviews} đánh giá</p>
                  </div>
                  {/* Star distribution */}
                  <div className="flex-1 space-y-1.5 min-w-[200px]">
                    {reviewSummary.distribution.map(row => (
                      <div key={row.stars} className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500 w-8 text-right">{row.stars} ★</span>
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${row.pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-6">{row.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {visibleReviews.map((review, idx) => (
                    <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-full ${review.color} text-white text-sm font-bold flex items-center justify-center shrink-0`}>
                          {review.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* Name + badge + date */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-gray-900">{review.name}</span>
                            {review.verified && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full border border-green-200">
                                <Check className="w-2.5 h-2.5" /> Đã mua hàng
                              </span>
                            )}
                            <span className="text-[11px] text-gray-400 ml-auto">{review.date}</span>
                          </div>
                          {/* Stars */}
                          <div className="flex items-center gap-0.5 mt-1">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                            ))}
                          </div>
                          {/* Text */}
                          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.text}</p>
                          {/* Images */}
                          {review.images.length > 0 && (
                            <div className="flex gap-2 mt-2.5">
                              {review.images.map((img, i) => (
                                <img key={i} src={img} alt="Review" className="w-16 h-16 rounded-lg object-cover border border-gray-100 hover:scale-105 transition-transform cursor-pointer" />
                              ))}
                            </div>
                          )}
                          {/* Helpful */}
                          <div className="flex items-center gap-4 mt-3">
                            <button className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
                              👍 Hữu ích ({review.helpful})
                            </button>
                            <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                              Trả lời
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load more + write review */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  {remainingReviews > 0 && (
                    <button
                      onClick={() => setReviewsToShow(prev => prev + 5)}
                      className="flex-1 sm:flex-none px-6 py-2.5 border-2 border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-all"
                    >
                      Xem thêm {remainingReviews} đánh giá
                    </button>
                  )}
                  <button
                    onClick={() => setShowWriteReview(true)}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
                  >
                    ✍️ Viết đánh giá
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ Upsell Section ═══ */}
        {upsellProducts.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              🔥 Giảm thêm khi mua kèm
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {upsellProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-red-300 hover:shadow-md transition-all group"
                >
                  <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-700 line-clamp-2 group-hover:text-red-600 transition-colors">{p.name}</p>
                    <p className="text-sm font-bold text-red-600 mt-1">{formatPrice(p.price)}</p>
                    {p.originalPrice && (
                      <p className="text-[10px] text-gray-400 line-through">{formatPrice(p.originalPrice)}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ═══ Related Products ═══ */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="aspect-square overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-medium text-gray-700 line-clamp-2 group-hover:text-red-600 transition-colors">{p.name}</h3>
                  <p className="text-red-600 font-bold text-sm mt-1.5">{formatPrice(p.price)}</p>
                  {p.originalPrice && (
                    <p className="text-[10px] text-gray-400 line-through">{formatPrice(p.originalPrice)}</p>
                  )}
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

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutPopup
          total={totalPrice}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {/* Write Review Modal */}
      {showWriteReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowWriteReview(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-red-600 text-white px-5 py-3.5 flex items-center justify-between">
              <h2 className="font-bold text-lg">✍️ Viết đánh giá</h2>
              <button onClick={() => setShowWriteReview(false)} className="text-white/80 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              {/* Product preview */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover border" />
                <p className="text-sm font-medium text-gray-700 line-clamp-2">{product.name}</p>
              </div>
              
              {/* Rating */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Đánh giá của bạn</label>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewReviewRating(s)}
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      <Star className={`w-7 h-7 transition-colors ${s <= (hoverRating || newReviewRating) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    {newReviewRating === 5 ? "Cực kỳ hài lòng" :
                     newReviewRating === 4 ? "Hài lòng" :
                     newReviewRating === 3 ? "Bình thường" :
                     newReviewRating === 2 ? "Không hài lòng" : "Rất tệ"}
                  </span>
                </div>
              </div>
              
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tên hiển thị <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 focus:bg-white transition-all"
                />
              </div>
              
              {/* Review text */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nội dung đánh giá <span className="text-red-500">*</span></label>
                <textarea
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 focus:bg-white transition-all resize-none"
                />
              </div>
              
              {/* Submit */}
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview || !newReviewName.trim() || !newReviewText.trim()}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
