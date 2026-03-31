import { Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Footer = () => {
  const { ref, isVisible } = useScrollReveal(0.05);

  return (
    <footer ref={ref} className="mercy-gradient text-primary-foreground overflow-hidden">
      <div className="container py-14 md:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '100ms' }}
          >
            <a href="/" className="inline-block group mb-4">
              <span className="text-3xl font-extrabold transition-all duration-300 group-hover:tracking-wider">
                <span>M</span>
                <span className="mercy-text-gradient">e</span>
                <span>rcy</span>
              </span>
            </a>
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
              className="inline-flex items-center gap-2 mt-5 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 hover:bg-mercy-orange-light hover:shadow-xl hover:shadow-primary/20 hover:scale-105 active:scale-95 group/btn"
            >
              <ExternalLink className="w-4 h-4 transition-transform duration-200 group-hover/btn:rotate-12" />
              Get a Quote
            </a>
          </div>

          {/* Giới thiệu */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <h4 className="font-bold text-base mb-5 relative inline-block pb-2">
              Giới thiệu
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-600 ${isVisible ? 'w-8' : 'w-0'}`}
                style={{ transitionDelay: '600ms' }}
              />
            </h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              {["Trang Chủ", "Về Chúng Tôi", "Thông Tin Tuyển Dụng", "Liên Hệ"].map((link, idx) => (
                <li key={link} className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  style={{ transitionDelay: `${500 + idx * 80}ms` }}
                >
                  <a href="#" className="hover:text-primary transition-all duration-200 inline-block hover:translate-x-2">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Info */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '300ms' }}
          >
            <h4 className="font-bold text-base mb-5 relative inline-block pb-2">
              Official Info
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-600 ${isVisible ? 'w-8' : 'w-0'}`}
                style={{ transitionDelay: '700ms' }}
              />
            </h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              {[
                { icon: MapPin, text: "HCM: 8/1E Đường Tô Ký, Ấp Tam Đông 1, Xã Đông Thạnh, TP. HCM." },
                { icon: Phone, text: "0763068614 (Mr. Hùng)" },
                { icon: MapPin, text: "HN: Số 10, Đường Thanh Niên, Xã Ba Vì, Hà Nội." },
                { icon: Phone, text: "0398684921 (Mr. Mạnh)" },
              ].map(({ icon: Icon, text }, idx) => (
                <li key={idx} className="flex items-start gap-2.5 group/item cursor-default">
                  <Icon className="w-4 h-4 mt-0.5 shrink-0 text-primary transition-transform duration-200 group-hover/item:scale-110" />
                  <span className="transition-colors duration-200 group-hover/item:text-primary-foreground/90">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '400ms' }}
          >
            <h4 className="font-bold text-base mb-5 relative inline-block pb-2">
              Opening Hours
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-600 ${isVisible ? 'w-8' : 'w-0'}`}
                style={{ transitionDelay: '800ms' }}
              />
            </h4>
            <div className="space-y-3 text-sm">
              {[
                { day: "Week Days", time: "10:00 - 17:00", highlight: false },
                { day: "Saturday", time: "10:00 - 15:00", highlight: false },
                { day: "Sunday", time: "Day Off", highlight: true },
              ].map(({ day, time, highlight }) => (
                <div key={day} className="flex justify-between text-primary-foreground/70 group/row cursor-default">
                  <span className="transition-colors duration-200 group-hover/row:text-primary-foreground/90">{day}</span>
                  <span className={`font-medium transition-all duration-200 ${highlight ? 'text-primary' : 'text-primary-foreground group-hover/row:text-primary'}`}>{time}</span>
                </div>
              ))}
            </div>
            <a
              href="#"
              className="inline-block mt-6 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 hover:bg-mercy-orange-light hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Contacts
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container py-5 text-center text-xs text-primary-foreground/40">
          <p>Copyright © 2026 Mercy | Powered by Mr.Manhdora</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
