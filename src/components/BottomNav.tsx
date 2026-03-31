import { Home, Store, ShoppingCart, User, Heart } from "lucide-react";
import { useState } from "react";

const items = [
  { icon: Home, label: "Trang chủ" },
  { icon: Store, label: "Cửa hàng" },
  { icon: ShoppingCart, label: "Giỏ hàng", badge: 0 },
  { icon: User, label: "Tài khoản" },
  { icon: Heart, label: "Yêu thích", badge: 0 },
];

const BottomNav = () => {
  const [active, setActive] = useState(0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around py-1.5 pb-safe">
        {items.map((item, i) => (
          <button
            key={item.label}
            onClick={() => setActive(i)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 relative transition-all duration-300 ${
              i === active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {/* Active indicator */}
            {i === active && (
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full" />
            )}
            <span className="relative">
              <item.icon className={`w-5 h-5 transition-transform duration-200 ${i === active ? 'scale-110' : ''}`} />
              {item.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
