import { useState, useEffect, useMemo } from "react";
import { Menu, Search, ShoppingCart, User, X, ChevronDown, ChevronRight, Zap, Shield, Smartphone, Gift, Store, Package, Heart, Settings, LogOut } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LanguageSwitcher from "./LanguageSwitcher";
import { apiGet } from "@/lib/api";
import type { ProductData } from "@/data/products";
import { categories, productDropdown } from "@/data/navigation";

const mainMenu = [
  { name: "Trang chủ", hasSubmenu: false, href: "/" },
  { name: "Sản phẩm", hasSubmenu: false, href: "/shop" },
  { name: "Giới thiệu", hasSubmenu: false, href: "/about" },
];


// const trendingKeywords = ["Kính AI", "MCK 5.1", "Dịch thuật", "Camera POV 2K", "Robot AI"];

const promoLinks = [
  { icon: Zap, text: "Sản phẩm đang giảm giá", color: "text-amber-500 fill-amber-500 animate-zap", href: "/flash-sale" },
  { icon: Shield, text: "Bảo hành lên đến 12 tháng", color: "text-blue-600", href: "/#" },
  { icon: Smartphone, text: "Trả góp 0%", color: "text-green-600", href: "/#" },
  { icon: Gift, text: "Quà tặng hấp dẫn", color: "text-orange-500", href: "/chinh-sach/khach-hang-than-thiet" },
];

import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [allProducts, setAllProducts] = useState<ProductData[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [contactMenuOpen, setContactMenuOpen] = useState(false);
  const [mobileContactMenuOpen, setMobileContactMenuOpen] = useState(false);
  const { cartCount, wishlist, compare } = useShop();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Prefetch products for search functionality
    const fetchProducts = async () => {
      try {
        const data = await apiGet('/products');
        if (data && Array.isArray(data)) setAllProducts(data);
      } catch (err) { }
    };
    fetchProducts();
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allProducts.filter(p => 
      p.name?.toLowerCase().includes(q) || 
      p.shortName?.toLowerCase().includes(q) || 
      p.sku?.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery, allProducts]);

  const handleSearchSelect = (id: number) => {
    setSearchQuery("");
    setSearchFocused(false);
    navigate(`/product/${id}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchFocused(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50">
      {/* ═══ Main Red Header Bar ═══
      <div className="fpt-header-gradient">
       */}
      <div className="bg-[#cb1c22]">
        <div className="container flex items-center gap-3 md:gap-5 h-[72px] md:h-[88px]">
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-white active:scale-90 transition-transform"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <a href="/" className="relative flex items-center justify-center shrink-0 group mr-2 md:mr-4 h-full min-w-[100px] md:min-w-[120px]">
            <span className="flex items-center justify-center h-16 md:h-20">
              <img src="/src/assets/logo/logowhite.png" alt="MERCY" className="h-full w-auto object-contain dark:hidden" />
              <img src="/src/assets/logo/logoBlack.png" alt="MERCY" className="h-full w-auto object-contain hidden dark:block" />
            </span>
            <span className="absolute bottom-1.5 md:bottom-2 text-[6px] md:text-[8px] text-white/90 tracking-[0.15em] font-semibold whitespace-nowrap">
              SMART VISION • SMART LIFE
            </span>
          </a>

          {/* Category Button (desktop) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-95 backdrop-blur-sm"
            >
              <Menu className="w-4 h-4" />
              <span>Danh mục</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            {catOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setCatOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-[580px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 p-5">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    {productDropdown.map((group, gi) => (
                      <div key={gi}>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 px-1 border-b border-gray-100 pb-2">
                          {group.title}
                        </h4>
                        <div className="flex flex-col gap-1">
                          {group.items.map((item, ii) => (
                            <button
                              key={ii}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-all duration-150 group/item text-left font-medium"
                              onClick={() => { setCatOpen(false); navigate(item.href); }}
                            >
                              <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover/item:text-red-500 transition-colors" />
                              <span className="group-hover/item:translate-x-1 transition-transform">{item.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 mt-5 pt-4">
                    <button
                      className="flex items-center justify-center gap-2 w-full text-sm font-bold text-red-600 hover:text-red-700 py-2.5 hover:bg-red-50 rounded-lg transition-all"
                      onClick={() => { setCatOpen(false); navigate("/shop"); }}
                    >
                      Xem tất cả danh mục →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-white rounded-lg overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên sản phẩm, kính thông minh... cần tìm"
                className="flex-1 px-4 py-2.5 text-sm bg-white outline-none text-gray-800 placeholder:text-gray-400"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} className="px-2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button type="submit" className="bg-[#d70018] hover:bg-[#b5001a] text-white px-4 h-[42px] flex items-center justify-center transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </form>
            {/* Search Results */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-100 z-50 overflow-hidden">
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    onMouseDown={() => handleSearchSelect(p.id)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-red-50 transition-colors"
                  >
                    <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-red-600 font-bold">{p.price.toLocaleString("vi-VN")}₫</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {searchFocused && searchQuery.trim() && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border z-50 p-4 text-center text-sm text-gray-500">
                Không tìm thấy sản phẩm nào
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* User icon / dropdown */}
            <div className="relative hidden md:block">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-white hover:bg-white/15 px-3 py-2 rounded-lg transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate">{user?.name}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={() => { setUserMenuOpen(false); navigate("/account"); }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                          >
                            <User className="w-4 h-4" /> Tài khoản của tôi
                          </button>
                          <button
                            onClick={() => { setUserMenuOpen(false); navigate("/orders"); }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                          >
                            <Package className="w-4 h-4" /> Đơn hàng của tôi
                          </button>
                          <button
                            onClick={() => { setUserMenuOpen(false); navigate("/wishlist"); }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                          >
                            <Heart className="w-4 h-4" /> Yêu thích
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => { setUserMenuOpen(false); navigate("/admin"); }}
                              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 font-semibold hover:bg-red-50 transition-colors text-left"
                            >
                              <Settings className="w-4 h-4" /> Quản trị Admin
                            </button>
                          )}
                        </div>
                        <div className="border-t border-gray-100 py-1">
                          <button
                            onClick={() => { setUserMenuOpen(false); logout(); toast.success("Đã đăng xuất"); navigate("/"); }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" /> Đăng xuất
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-1.5 text-white hover:bg-white/15 px-3 py-2 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center gap-2 bg-white text-[#d70018] px-3 py-2 rounded-lg font-bold text-sm transition-all hover:bg-gray-50 active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden md:inline">Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-[#d70018] text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Trending keywords inside red area (FPT style) */}
        {/*
        <div className={`transition-all duration-300 overflow-hidden ${scrolled ? 'max-h-0' : 'max-h-10'}`}>
          <div className="container hidden md:flex items-center gap-4 h-8 overflow-x-auto">
            {trendingKeywords.map((kw, i) => (
              <button
                key={i}
                onClick={() => navigate(`/shop?search=${encodeURIComponent(kw)}`)}
                className="text-xs text-white/70 hover:text-white whitespace-nowrap transition-colors font-medium"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
        */}
      </div>

      {/* ═══ Promo Strip + Navigation (white bar, FPT style) ═══ */}
      <div className={`hidden md:block bg-white border-b border-gray-100 transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
        <div className="container flex items-center justify-between h-11">
          {/* Left: Sản phẩm đang giảm giá */}
          <div className="flex-1 basis-0 flex justify-start">
            <a href="/flash-sale" className="group flex items-center gap-1.5 text-sm font-bold transition-all rounded-full bg-red-50/80 px-3 py-1 shadow-sm border border-red-100 hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap -ml-3">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500 animate-zap drop-shadow-sm" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500 group-hover:from-red-700 group-hover:to-red-600">Sản phẩm đang giảm giá</span>
            </a>
          </div>

          {/* Center: Bảo hành, Trả góp, Quà tặng */}
          <div className="flex-none flex justify-center items-center gap-4 lg:gap-8">
            {promoLinks.slice(1).map((link, i) => (
              <a key={i} href={link.href} className="flex items-center gap-1.5 text-xs lg:text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap">
                <link.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${link.color}`} />
                {link.text}
              </a>
            ))}
          </div>

          {/* Right links */}
          <div className="flex-1 basis-0 flex justify-end items-center gap-2 text-sm text-gray-600 shrink-0">
            <a href="/about" className="hover:text-red-600 px-2 py-1 transition-colors font-medium text-xs">Giới thiệu</a>
            <span className="text-gray-300">|</span>
            <div className="relative" onMouseEnter={() => setContactMenuOpen(true)} onMouseLeave={() => setContactMenuOpen(false)}>
              <button className="hover:text-red-600 px-2 py-1 transition-colors font-medium text-xs flex items-center gap-1">
                Liên hệ <ChevronDown className={`w-3 h-3 transition-transform ${contactMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {contactMenuOpen && (
                <div className="absolute top-full right-0 pt-2 z-50">
                  <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden w-56 py-1">
                    {["Đại Lý Nhập Hàng", "Hợp Tác Thương Hiệu", "Chăm Sóc Khách Hàng"].map(opt => (
                      <button key={opt} onClick={() => {
                        setContactMenuOpen(false);
                        const body = `Tên khách hàng: \n\nSố điện thoại: `;
                        window.location.href = `mailto:mercytechglobal@gmail.com?subject=${encodeURIComponent(opt)}&body=${encodeURIComponent(body)}`;
                      }} className="w-full text-left px-4 py-2.5 hover:bg-red-50 hover:text-red-600 text-xs font-semibold transition-colors border-b border-gray-50 last:border-0">
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="text-gray-300">|</span>
            <button onClick={() => setStoreModalOpen(true)} className="hover:text-red-600 px-2 pl-3 py-1 transition-colors font-medium text-xs">Cửa hàng</button>
            <span className="text-gray-300">|</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* ═══ Mobile Sidebar ═══ */}
      <div
        className={`md:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMenuOpen(false)}
      />
      <div
        className={`md:hidden fixed top-0 left-0 z-[70] h-full w-[85%] max-w-[340px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 fpt-header-gradient">
          <img src="/src/assets/logo/logowhite.png" alt="MERCY" className="h-14 object-contain dark:hidden" />
          <img src="/src/assets/logo/logoBlack.png" alt="MERCY" className="h-14 object-contain hidden dark:block" />
          <button
            onClick={() => setMenuOpen(false)}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Mobile Search */}
          <div className="p-4">
            <form onSubmit={(e) => { handleSearchSubmit(e); setMenuOpen(false); }} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 rounded-lg outline-none text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-red-200 border border-gray-200"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
            {searchFocused && searchResults.length > 0 && (
              <div className="mt-1 bg-white rounded-lg border shadow-lg overflow-hidden">
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    onMouseDown={() => { handleSearchSelect(p.id); setMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-red-50"
                  >
                    <img src={p.image} alt={p.name} className="w-9 h-9 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-red-600 font-bold">{p.price.toLocaleString("vi-VN")}₫</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Menu + Categories */}
          <div className="px-4 pb-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ngôn ngữ</h3>
              <LanguageSwitcher />
            </div>

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Menu</h3>
            {mainMenu.map((link, i) => (
              <a key={i} href={link.href} className="flex items-center justify-between py-3 text-[15px] font-medium text-gray-800 hover:text-red-600 border-b border-gray-100 last:border-0">
                <span>{link.name}</span>
                {link.hasSubmenu && <ChevronRight className="w-4 h-4 text-gray-300" />}
              </a>
            ))}

            {/* Promo links in mobile */}
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-6">Ưu đãi</h3>
            {promoLinks.map((link, i) => (
              <a key={i} href={link.href} className="flex items-center gap-3 py-3 text-[15px] text-gray-700 hover:text-red-600 border-b border-gray-100 last:border-0">
                <link.icon className={`w-5 h-5 ${link.color}`} />
                <span>{link.text}</span>
              </a>
            ))}

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-6">Danh mục sản phẩm</h3>
            {categories.map((cat, i) => (
              <button key={i} onClick={() => { setMenuOpen(false); navigate(cat.href); }} className="flex items-center justify-between w-full py-3 text-[15px] text-gray-700 hover:text-red-600 border-b border-gray-100 last:border-0 text-left">
                <span>{cat.name}</span>
                {cat.hasSubmenu && <ChevronRight className="w-4 h-4 text-gray-300" />}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* ═══ Store Modal ═══ */}
      {storeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={() => setStoreModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-4 md:p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 border-l-4 border-red-600 pl-3">Hệ thống cửa hàng MERCY</h3>
              <button onClick={() => setStoreModalOpen(false)} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-xl p-4 md:p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-red-100 p-2 rounded-lg"><Store className="w-5 h-5 text-red-600" /></div>
                  <h4 className="font-bold text-lg text-gray-900">Cơ sở Hồ Chí Minh</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4 pl-[42px] font-medium">36 đường số 5 KĐT Vạn Phúc, Thủ Đức, HCM</p>
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5778416037806!2d106.70807068133068!3d10.843583430406635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528700d814313%3A0x4ad6cbb135d5bf29!2zMTA5IE5ndXnhu4VuIFRo4buLIE5odW5nLCBLaHUgxJHDtCBUaOG7iyBW4bqhbiBQaMO6YywgSGnhu4dwIELDrG5oLCBI4buTIENow60gTWluaCA3MTAwMCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1776685308306!5m2!1svi!2s" className="w-full h-full border-0" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 md:p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg"><Store className="w-5 h-5 text-blue-600" /></div>
                  <h4 className="font-bold text-lg text-gray-900">Cơ sở Hà Nội</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4 pl-[42px] font-medium">S1.06 Vinsmart City, Tây Mỗ, Nam Từ Liêm, Hà Nội</p>
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6410653108037!2d105.7358738254665!3d21.00702043852441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313453f5af42dea1%3A0x5b6bfe928f51703d!2sS1.06%20Vinhomes%20Smart%20City!5e0!3m2!1svi!2s!4v1776685395548!5m2!1svi!2s" className="w-full h-full border-0" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
