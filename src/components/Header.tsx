import { useState, useEffect } from "react";
import { Menu, X, Search, ShoppingCart, User, Heart, Phone, Zap, ChevronDown, ChevronRight, Minus } from "lucide-react";

const categories = [
  { name: "Kính Mắt Thông Minh", hasSubmenu: true },
  { name: "Balo Thông Minh", hasSubmenu: false },
  { name: "Bút Thông Minh", hasSubmenu: false },
  { name: "Đồng Hồ, Vòng Đeo Tay Thông Minh", hasSubmenu: false },
  { name: "Flash Sale", hasSubmenu: false },
  { name: "Tai Nghe Bluetooth", hasSubmenu: true },
];

const mainMenu = [
  { name: "Trang chủ", hasSubmenu: false },
  { name: "Sản phẩm", hasSubmenu: true },
  { name: "Giới thiệu", hasSubmenu: false },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      {/* Top bar */}
      <div className="bg-background border-b border-border">
        <div className="container flex items-center justify-between h-14 md:h-20 gap-3 md:gap-4">
          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <a href="/" className="flex flex-col items-center shrink-0 group">
            <span className="text-2xl md:text-3xl font-extrabold tracking-tight transition-transform duration-300 group-hover:scale-105">
              <span className="text-secondary">M</span>
              <span className="text-primary">e</span>
              <span className="text-secondary">rcy</span>
            </span>
            <span className="text-[8px] md:text-[10px] text-muted-foreground tracking-[0.15em] -mt-1">Smart Vision • Smart Life</span>
          </a>

          {/* Search bar - desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-6">
            <div className={`flex items-center w-full rounded-lg border-2 transition-all duration-300 ${searchFocused ? 'border-primary shadow-md' : 'border-border'}`}>
              <input
                type="text"
                placeholder="Search for product..."
                className="flex-1 px-4 py-2.5 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <button className="bg-primary hover:bg-mercy-orange-light text-primary-foreground px-4 py-2.5 rounded-r-md transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hotline */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center animate-pulse-glow">
              <Phone className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hotline</p>
              <p className="text-sm font-bold text-foreground">0898 273 899</p>
            </div>
          </div>

          {/* Flash Sale button */}
          <a
            href="#"
            className="hidden sm:flex items-center gap-2 bg-primary hover:bg-mercy-orange-light text-primary-foreground px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 group"
          >
            <Zap className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
            Flash Sale
          </a>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-1">
            <button className="p-2 text-muted-foreground hover:text-primary transition-colors relative group">
              <User className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-primary transition-colors relative group">
              <ShoppingCart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="absolute -top-0 right-0 bg-primary text-primary-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">0</span>
            </button>
            <button className="p-2 text-muted-foreground hover:text-primary transition-colors relative group">
              <Heart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="absolute -top-0 right-0 bg-primary text-primary-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">0</span>
            </button>
          </div>

          {/* Mobile: only collapse button on right */}
          <div className="md:hidden" />
        </div>
      </div>

      {/* Desktop Navigation bar */}
      <div className="hidden md:block bg-background border-b border-border">
        <div className="container flex items-center gap-6 h-12">
          <div className="relative">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2 rounded-lg font-semibold text-sm hover:bg-secondary/90 transition-colors"
            >
              <Menu className="w-4 h-4" />
              DANH MỤC SẢN PHẨM
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-background rounded-lg shadow-xl border border-border animate-slide-down z-50">
                {categories.map((cat, i) => (
                  <a key={i} href="#" className="flex items-center justify-between px-4 py-3 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors first:rounded-t-lg last:rounded-b-lg group">
                    <span>{cat.name}</span>
                    {cat.hasSubmenu && <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform duration-200 group-hover:translate-x-1" />}
                  </a>
                ))}
              </div>
            )}
          </div>
          <nav className="flex items-center gap-6">
            {mainMenu.map((link, i) => (
              <a
                key={i}
                href="#"
                className={`text-sm font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left ${
                  i === 0 ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
                {link.hasSubmenu && <ChevronDown className="inline w-3.5 h-3.5 ml-0.5" />}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* ===== MOBILE SIDEBAR OVERLAY ===== */}
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Sidebar panel */}
      <div
        className={`md:hidden fixed top-0 left-0 z-[70] h-full w-[85%] max-w-[340px] bg-background shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex items-center justify-end p-4 border-b border-border">
          <button
            onClick={() => setMenuOpen(false)}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Menu */}
          <div className="px-5 pt-6 pb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Main Menu</h3>
            <div className="space-y-0">
              {mainMenu.map((link, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex items-center justify-between py-3.5 text-[15px] font-medium text-foreground hover:text-primary transition-colors border-b border-border/40 last:border-0"
                >
                  {link.name}
                  {link.hasSubmenu && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-border" />

          {/* Danh mục sản phẩm */}
          <div className="px-5 pt-5 pb-8">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Danh mục sản phẩm</h3>
            <div className="space-y-0">
              {categories.map((cat, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex items-center justify-between py-3.5 text-[15px] text-foreground hover:text-primary transition-colors border-b border-border/40 last:border-0"
                >
                  {cat.name}
                  {cat.hasSubmenu && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
