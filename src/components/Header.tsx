import { useState } from "react";
import { Menu, X, Search, ShoppingCart, User, Heart } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-1">
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="text-foreground">M</span>
            <span className="text-primary">e</span>
            <span className="text-foreground">rcy</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#" className="text-foreground hover:text-primary transition-colors">Trang chủ</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cửa hàng</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Tin tức</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Liên hệ</a>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors hidden sm:block">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">0</span>
          </button>
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors hidden sm:block">
            <User className="w-5 h-5" />
          </button>
          <button className="md:hidden p-2 text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <a href="#" className="block text-foreground font-medium py-2">Trang chủ</a>
          <a href="#" className="block text-muted-foreground py-2">Cửa hàng</a>
          <a href="#" className="block text-muted-foreground py-2">Tin tức</a>
          <a href="#" className="block text-muted-foreground py-2">Liên hệ</a>
        </div>
      )}
    </header>
  );
};

export default Header;
