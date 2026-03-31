import { Home, Store, ShoppingCart, User, Heart } from "lucide-react";
import { useState } from "react";

const items = [
  { icon: Home, label: "Trang chủ" },
  { icon: Store, label: "Cửa hàng" },
  { icon: ShoppingCart, label: "Giỏ hàng" },
  { icon: User, label: "Tài khoản" },
  { icon: Heart, label: "Danh mục yêu thích" },
];

const BottomNav = () => {
  const [active, setActive] = useState(0);
  const [tapped, setTapped] = useState<number | null>(null);

  const handleTap = (i: number) => {
    setActive(i);
    setTapped(i);
    setTimeout(() => setTapped(null), 300);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item, i) => (
          <button
            key={item.label}
            onClick={() => handleTap(i)}
            className={`flex flex-col items-center gap-0.5 px-1 py-1 min-w-0 relative transition-colors duration-200 ${
              i === active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {/* Active dot indicator */}
            <span className={`absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary transition-all duration-300 ${i === active ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />

            <span className="relative">
              <item.icon
                className={`w-5 h-5 shrink-0 transition-all duration-300 ${
                  tapped === i ? 'scale-125' : i === active ? 'scale-110' : 'scale-100'
                }`}
              />
            </span>
            <span className={`text-[9px] font-medium leading-tight text-center truncate max-w-[60px] transition-all duration-200 ${i === active ? 'font-semibold' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
