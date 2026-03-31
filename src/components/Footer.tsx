import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mercy-gradient text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-extrabold mb-4">
              <span>M</span>
              <span className="text-primary">e</span>
              <span>rcy</span>
            </h3>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Kính Thông Minh Mercy – Thương hiệu công nghệ Việt tiên phong trong lĩnh vực kính thông minh.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Liên kết</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary transition-colors">Trang chủ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cửa hàng</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tin tức</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Giới thiệu</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Chính sách</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary transition-colors">Chính sách bảo hành</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Chính sách vận chuyển</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Điều khoản dịch vụ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>TP. Hồ Chí Minh, Việt Nam</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-primary" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-primary" />
                <span>info@mercy.vn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container py-4 text-center text-xs text-primary-foreground/50">
          © 2025 Mercy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
