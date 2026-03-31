import { useState, useEffect } from "react";
import heroBanner1 from "@/assets/hero-banner-1.jpg";
import heroBanner2 from "@/assets/hero-banner-2.jpg";
import kolBanner from "@/assets/kol-banner.jpg";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: heroBanner1,
    subtitle: "⚡ Super Brand Days! Sale 30% OFF",
    title: "Săn Deal trên LiveStream",
    times: ["9h00 - 12h00", "21h00 - 00h00", "00h00 - 02h00"],
    cta: "Săn trên Shopee",
  },
  {
    image: heroBanner2,
    subtitle: "⚡ Super Brand Days! Sale 30% OFF",
    title: "Săn Deal trên LiveStream",
    times: ["9h00 - 12h00", "21h00 - 00h00", "00h00 - 02h00"],
    cta: "Săn trên TikTokShop",
  },
];

const categories = [
  { name: "Kính Mắt Thông Minh", hasSubmenu: true },
  { name: "Balo Thông Minh", hasSubmenu: false },
  { name: "Bút Thông Minh", hasSubmenu: false },
  { name: "Đồng Hồ, Vòng Đeo Tay Thông Minh", hasSubmenu: false },
  { name: "Flash Sale", hasSubmenu: false },
  { name: "Tai Nghe Bluetooth", hasSubmenu: true },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % slides.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => {
    if (index === current) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setIsAnimating(false);
    }, 300);
  };

  const slide = slides[current];

  return (
    <section className="container py-4 md:py-6">
      <div className="flex gap-4">
        {/* Category sidebar - desktop */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden h-full">
            {categories.map((cat, i) => (
              <a
                key={i}
                href="#"
                className="flex items-center justify-between px-5 py-3.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-all duration-200 border-b border-border/50 last:border-0 group"
              >
                <span className="transition-transform duration-200 group-hover:translate-x-1">{cat.name}</span>
                {cat.hasSubmenu && <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all duration-200 group-hover:translate-x-1" />}
              </a>
            ))}
          </div>
        </div>

        {/* Main hero slider */}
        <div className="flex-1 min-w-0">
          <div className="relative rounded-xl overflow-hidden h-[250px] sm:h-[320px] md:h-[400px] lg:h-[420px] group">
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover transition-all duration-500 ${isAnimating ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
              width={1920}
              height={800}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-mercy-dark/80 via-mercy-dark/50 to-transparent">
              <div className={`flex flex-col justify-center h-full px-6 md:px-10 max-w-lg transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <p className="text-primary font-semibold text-xs md:text-sm mb-2">{slide.subtitle}</p>
                <h2 className="text-primary-foreground text-xl md:text-3xl lg:text-4xl font-extrabold mb-4 italic" style={{ fontFamily: 'Georgia, serif' }}>
                  {slide.title}
                </h2>
                <div className="space-y-1 mb-5">
                  {slide.times.map((t, j) => (
                    <p key={j} className="text-primary-foreground/70 text-xs md:text-sm">{t}</p>
                  ))}
                </div>
                <a
                  href="#"
                  className="self-start border border-primary-foreground/40 text-primary-foreground text-xs md:text-sm px-5 py-2.5 rounded-md hover:bg-primary-foreground/10 transition-all duration-300 hover:border-primary-foreground"
                >
                  {slide.cta}
                </a>
              </div>
            </div>

            {/* Nav arrows */}
            <button
              onClick={() => goTo((current - 1 + slides.length) % slides.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background backdrop-blur-sm p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => goTo((current + 1) % slides.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background backdrop-blur-sm p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? "bg-primary w-6 h-2.5" : "bg-primary-foreground/50 w-2.5 h-2.5 hover:bg-primary-foreground/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* KOL sidebar - desktop */}
        <div className="hidden xl:block w-[260px] shrink-0">
          <div className="relative rounded-xl overflow-hidden h-full cursor-pointer group">
            <img
              src={kolBanner}
              alt="KOLs & KOCs"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              width={1200}
              height={600}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-mercy-dark/90 via-mercy-dark/40 to-transparent flex flex-col items-center justify-end p-6 pb-8">
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                Đồng hành thương hiệu
              </span>
              <h3 className="text-primary-foreground text-2xl font-extrabold mb-1">KOLS</h3>
              <h3 className="text-primary-foreground text-2xl font-extrabold mb-4">KOCS</h3>
              <a
                href="#"
                className="border border-primary-foreground/60 text-primary-foreground text-xs px-5 py-2 rounded-full hover:bg-primary-foreground/10 transition-all duration-300 hover:border-primary-foreground"
              >
                Tham gia ngay!
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
