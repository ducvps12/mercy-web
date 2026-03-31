import { Home, Store, ShoppingCart, User, Heart } from "lucide-react";

const items = [
  { icon: Home, label: "Trang chủ", active: true },
  { icon: Store, label: "Cửa hàng", active: false },
  { icon: ShoppingCart, label: "Giỏ hàng", active: false },
  { icon: User, label: "Tài khoản", active: false },
  { icon: Heart, label: "Yêu thích", active: false },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${
              item.active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
