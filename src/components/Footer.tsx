import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Footer = () => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <footer ref={ref} className="mercy-gradient text-primary-foreground">
      <div className="container py-14 md:py-20">
        <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-extrabold mb-4">
              <span>M</span>
              <span className="mercy-text-gradient">e</span>
              <span>rcy</span>
            </h3>
            <p className="text-sm text-primary-foreground/70 leading-relaxed mb-5">
              Mercy - Thương hiệu độc quyền tại Việt Nam. Chung tay xây dựng cuộc sống tiện ích thông minh cùng Mercy.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/60 mb-1">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Mon – Sat: 9:00 am – 5:30 pm</span>
            </div>
            <p className="text-sm text-primary ml-6 font-semibold">Sunday: CLOSED</p>
            <a
              href="#"
              className="inline-flex items-center gap-2 mt-5 bg-primary hover:bg-mercy-orange-light text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            >
              <ExternalLink className="w-4 h-4" />
              Get a Quote
            </a>
          </div>

          {/* Giới thiệu */}
          <div>
            <h4 className="font-bold text-base mb-5 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-primary pb-2">
              Giới thiệu
            </h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              {["Trang Chủ", "Về Chúng Tôi", "Thông Tin Tuyển Dụng", "Liên Hệ"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Info */}
          <div>
            <h4 className="font-bold text-base mb-5 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-primary pb-2">
              Official Info
            </h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>HCM: 8/1E Đường Tô Ký, Ấp Tam Đông 1, Xã Đông Thạnh, TP. HCM.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0 text-primary" />
                <span>0763068614 (Mr. Hùng)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>HN: Số 10, Đường Thanh Niên, Xã Ba Vì, Hà Nội.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0 text-primary" />
                <span>0398684921 (Mr. Mạnh)</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-bold text-base mb-5 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-primary pb-2">
              Opening Hours
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-primary-foreground/70">
                <span>Week Days</span>
                <span className="font-medium text-primary-foreground">10:00 - 17:00</span>
              </div>
              <div className="flex justify-between text-primary-foreground/70">
                <span>Saturday</span>
                <span className="font-medium text-primary-foreground">10:00 - 15:00</span>
              </div>
              <div className="flex justify-between text-primary-foreground/70">
                <span>Sunday</span>
                <span className="font-medium text-primary">Day Off</span>
              </div>
            </div>
            <a
              href="#"
              className="inline-block mt-6 bg-primary hover:bg-mercy-orange-light text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              Contacts
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/40">
          <p>Copyright © 2026 Mercy | Powered by Mr.Manhdora</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
