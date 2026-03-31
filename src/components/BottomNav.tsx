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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item, i) => (
          <button
            key={item.label}
            onClick={() => setActive(i)}
            className={`flex flex-col items-center gap-0.5 px-1 py-1 min-w-0 transition-colors duration-200 ${
              i === active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${i === active ? 'scale-110' : ''}`} />
            <span className="text-[9px] font-medium leading-tight text-center truncate max-w-[60px]">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
