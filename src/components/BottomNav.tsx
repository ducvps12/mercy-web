import { Home, Store, ShoppingCart, User, Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const items = [
  { icon: Home, label: "Trang chủ", href: "/" },
  { icon: Store, label: "Cửa hàng", href: "/shop" },
  { icon: ShoppingCart, label: "Giỏ hàng", href: "/cart" },
  { icon: User, label: "Tài khoản", href: "/login" },
  { icon: Heart, label: "Yêu thích", href: "/shop" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tapped, setTapped] = useState<number | null>(null);

  const activeIndex = items.findIndex((item) => item.href === location.pathname);

  const handleTap = (i: number) => {
    setTapped(i);
    setTimeout(() => setTapped(null), 300);
    navigate(items[i].href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item, i) => (
          <button
            key={item.label}
            onClick={() => handleTap(i)}
            className={`flex flex-col items-center gap-0.5 px-1 py-1 min-w-0 relative transition-colors duration-200 ${
              i === activeIndex ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <span className={`absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary transition-all duration-300 ${i === activeIndex ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
            <span className="relative">
              <item.icon
                className={`w-5 h-5 shrink-0 transition-all duration-300 ${
                  tapped === i ? 'scale-125' : i === activeIndex ? 'scale-110' : 'scale-100'
                }`}
              />
            </span>
            <span className={`text-[9px] font-medium leading-tight text-center truncate max-w-[60px] transition-all duration-200 ${i === activeIndex ? 'font-semibold' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
