import { Phone, MapPin, Clock, Calendar } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Footer = () => {
  const { ref, isVisible } = useScrollReveal(0.05);

  return (
    <footer ref={ref} className="bg-mercy-warm-bg text-foreground overflow-hidden">
      <div className="container py-14 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '100ms' }}
          >
            <a href="/" className="inline-block group mb-4">
              <span className="text-3xl font-extrabold transition-all duration-300 group-hover:tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                <span className="text-secondary">m</span>
                <span className="text-primary">e</span>
                <span className="text-secondary">rcy</span>
              </span>
              <p className="text-[9px] text-muted-foreground tracking-[0.1em] -mt-0.5">Smart Vision • Smart Life</p>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Mercy - Thương hiệu độc quyền tại Việt Nam. Chung tay xây dựng cuộc sống tiện ích thông minh cùng Mercy.
            </p>
            <div className="flex items-start gap-2 text-sm text-muted-foreground mb-1">
              <Clock className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
              <div>
                <span>Mon – Sat: 9:00 am – 5:30 pm,</span>
                <br />
                <span>Sunday: <span className="text-primary font-bold">CLOSED</span></span>
              </div>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2 mt-5 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 hover:bg-mercy-orange-light hover:shadow-xl hover:shadow-primary/20 hover:scale-105 active:scale-95 group/btn"
            >
              <Calendar className="w-4 h-4 transition-transform duration-200 group-hover/btn:rotate-12" />
              Get a Quote
            </a>
          </div>

          {/* Giới thiệu */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <h4 className="font-bold text-lg text-foreground mb-5 relative inline-block pb-2 italic" style={{ fontFamily: 'Georgia, serif' }}>
              Giới thiệu
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-600 ${isVisible ? 'w-10' : 'w-0'}`}
                style={{ transitionDelay: '600ms' }}
              />
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-muted-foreground">
              {["Trang Chủ", "Về Chúng Tôi", "Thông Tin Tuyển Dụng", "Liên Hệ"].map((link, idx) => (
                <a
                  key={link}
                  href="#"
                  className={`hover:text-primary transition-all duration-200 inline-block hover:translate-x-1 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  style={{ transitionDelay: `${500 + idx * 80}ms` }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Official Info */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '300ms' }}
          >
            <h4 className="font-bold text-lg text-foreground mb-5 relative inline-block pb-2 italic" style={{ fontFamily: 'Georgia, serif' }}>
              Official Info
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-600 ${isVisible ? 'w-10' : 'w-0'}`}
                style={{ transitionDelay: '700ms' }}
              />
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {[
                { icon: MapPin, text: "HCM: 8/1E Đường Tô Ký, Ấp Tam Đông 1, Xã Đông Thạnh, TP. HCM." },
                { icon: Phone, text: "0763068614 (Mr. Hùng)" },
                { icon: MapPin, text: "HN: Số 10, Đường Thanh Niên, Xã Ba Vì, Hà Nội." },
                { icon: Phone, text: "0398684921 (Mr.Manh)" },
              ].map(({ icon: Icon, text }, idx) => (
                <li key={idx} className="flex items-start gap-2.5 group/item cursor-default">
                  <Icon className="w-4 h-4 mt-0.5 shrink-0 text-primary transition-transform duration-200 group-hover/item:scale-110" />
                  <span className="transition-colors duration-200 group-hover/item:text-foreground">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '400ms' }}
          >
            <h4 className="font-bold text-lg text-foreground mb-5 relative inline-block pb-2 italic" style={{ fontFamily: 'Georgia, serif' }}>
              Opening Hours
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-600 ${isVisible ? 'w-10' : 'w-0'}`}
                style={{ transitionDelay: '800ms' }}
              />
            </h4>
            <div className="space-y-3 text-sm">
              {[
                { day: "Week Days", time: "10:00 - 17:00" },
                { day: "Saturday", time: "10:00 - 15:00" },
                { day: "Sunday", time: "Day Off" },
              ].map(({ day, time }) => (
                <div key={day} className="flex justify-between text-muted-foreground group/row cursor-default">
                  <span className="font-medium text-foreground transition-colors duration-200">{day}</span>
                  <span className="transition-all duration-200 group-hover/row:text-primary">{time}</span>
                </div>
              ))}
            </div>
            <a
              href="#"
              className="inline-block mt-6 bg-primary text-primary-foreground text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:bg-mercy-orange-light hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Contact us
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container py-5 text-center text-sm text-muted-foreground">
          <p>Copyright © 2026 Mercy | Powered by Mr.Manhdora</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
