import { useState, useEffect } from "react";
import { Menu, Search, ShoppingCart, User, Heart, Phone, Zap, ChevronDown, ChevronRight, Minus } from "lucide-react";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className={`sticky top-0 z-50 bg-background transition-shadow duration-500 ${scrolled ? 'shadow-lg shadow-foreground/5' : 'shadow-sm'}`}>
      {/* Top bar */}
      <div className="bg-background border-b border-border">
        <div className="container flex items-center justify-between h-14 md:h-20 gap-3 md:gap-4">
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-foreground tap-ripple active:scale-90 transition-transform duration-150"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <a href="/" className="flex flex-col items-center shrink-0 group">
            <span className="text-2xl md:text-3xl font-extrabold tracking-tight transition-all duration-500 group-hover:scale-110 group-hover:tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
              <span className="text-secondary transition-colors duration-300 group-hover:text-mercy-charcoal">m</span>
              <span className="text-primary transition-all duration-300 group-hover:text-mercy-orange-glow">e</span>
              <span className="text-secondary transition-colors duration-300 group-hover:text-mercy-charcoal">rcy</span>
            </span>
            <span className="text-[7px] md:text-[9px] text-muted-foreground tracking-[0.12em] -mt-1 transition-opacity duration-300 group-hover:opacity-70">
              Smart Vision • Smart Life
            </span>
          </a>

          {/* Hamburger icon (desktop - circular dark button) */}
          <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-200 active:scale-90 shrink-0">
            <Menu className="w-5 h-5" />
          </button>

          {/* Category dropdown + Search bar combined (desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-2xl">
            <div className={`flex items-center w-full rounded-lg overflow-hidden border-2 transition-all duration-400 ${searchFocused ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'}`}>
              {/* Category selector inside search */}
              <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground text-sm font-medium whitespace-nowrap hover:bg-secondary/90 transition-colors duration-200 border-r border-border/30">
                Category
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <input
                type="text"
                placeholder="Search for product..."
                className="flex-1 px-4 py-2.5 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <button className="bg-primary hover:bg-mercy-orange-light text-primary-foreground px-5 py-2.5 transition-all duration-200 active:scale-95 hover:shadow-md hover:shadow-primary/20">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hotline */}
          <div className="hidden lg:flex items-center gap-3 group cursor-pointer shrink-0">
            <div className="w-11 h-11 rounded-full border-2 border-primary flex items-center justify-center animate-pulse-glow group-hover:bg-primary/10 transition-colors duration-300">
              <Phone className="w-4 h-4 text-primary group-hover:animate-wiggle" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hotline</p>
              <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-200">0898 273 899</p>
            </div>
          </div>

          {/* Flash Sale - outlined orange border */}
          <a
            href="#"
            className="hidden sm:flex items-center gap-2 border-2 border-primary text-primary px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95 group shrink-0"
          >
            <Zap className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span>Flash Sale</span>
          </a>

          <div className="md:hidden" />
        </div>
      </div>

      {/* Desktop Second Navigation Bar */}
      <div className="hidden md:block bg-background border-b border-border">
        <div className="container flex items-center justify-between h-12">
          <div className="flex items-center gap-8">
            {/* DANH MỤC SẢN PHẨM - orange background */}
            <div className="relative">
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold text-sm hover:bg-mercy-orange-light transition-all duration-200 active:scale-95"
              >
                <Menu className="w-4 h-4" />
                DANH MỤC SẢN PHẨM
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-background rounded-lg shadow-xl border border-border z-50 overflow-hidden">
                  {categories.map((cat, i) => (
                    <a
                      key={i}
                      href="#"
                      className="flex items-center justify-between px-4 py-3 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-all duration-200 group animate-slide-in-stagger"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <span className="transition-transform duration-200 group-hover:translate-x-1">{cat.name}</span>
                      {cat.hasSubmenu && <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all duration-200 group-hover:translate-x-1" />}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Nav links */}
            <nav className="flex items-center gap-6">
              {mainMenu.map((link, i) => (
                <a key={i} href="#" className={`text-sm font-medium transition-all duration-200 underline-animate py-1 ${i === 0 ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {link.name}
                  {link.hasSubmenu && <ChevronDown className="inline w-3.5 h-3.5 ml-0.5 transition-transform duration-200" />}
                </a>
              ))}
            </nav>
          </div>

          {/* Right side icons with badges */}
          <div className="flex items-center gap-1">
            {[
              { Icon: User, badge: null },
              { Icon: ShoppingCart, badge: "0" },
              { Icon: Heart, badge: "0" },
              { Icon: ShoppingCart, badge: "0" },
            ].map(({ Icon, badge }, idx) => (
              <button
                key={idx}
                className="p-2.5 text-muted-foreground hover:text-primary transition-all duration-200 relative group icon-hover-bounce"
              >
                <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                {badge !== null && (
                  <span className="absolute top-0.5 right-0.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center transition-transform duration-200 group-hover:scale-125">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Backdrop */}
      <div
        className={`md:hidden fixed inset-0 z-[60] bg-foreground/50 backdrop-blur-sm transition-all duration-400 ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Sidebar Panel */}
      <div
        className={`md:hidden fixed top-0 left-0 z-[70] h-full w-[85%] max-w-[340px] bg-background shadow-2xl flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-end p-4 border-b border-border">
          <button
            onClick={() => setMenuOpen(false)}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-border transition-all duration-200 active:scale-90"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-5 pt-6 pb-3">
            <h3 className={`text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 transition-all duration-500 ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
              style={{ transitionDelay: '150ms' }}
            >
              Main Menu
            </h3>
            {mainMenu.map((link, i) => (
              <a
                key={i}
                href="#"
                className={`flex items-center justify-between py-3.5 text-[15px] font-medium text-foreground hover:text-primary transition-all duration-300 border-b border-border/40 last:border-0 tap-ripple group ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{ transitionDelay: `${200 + i * 80}ms` }}
              >
                <span className="transition-transform duration-200 group-hover:translate-x-1">{link.name}</span>
                {link.hasSubmenu && <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />}
              </a>
            ))}
          </div>

          <div className="mx-5 border-t border-border" />

          <div className="px-5 pt-5 pb-8">
            <h3 className={`text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 transition-all duration-500 ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
              style={{ transitionDelay: '400ms' }}
            >
              Danh mục sản phẩm
            </h3>
            {categories.map((cat, i) => (
              <a
                key={i}
                href="#"
                className={`flex items-center justify-between py-3.5 text-[15px] text-foreground hover:text-primary transition-all duration-300 border-b border-border/40 last:border-0 tap-ripple group ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{ transitionDelay: `${450 + i * 60}ms` }}
              >
                <span className="transition-transform duration-200 group-hover:translate-x-1">{cat.name}</span>
                {cat.hasSubmenu && <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
