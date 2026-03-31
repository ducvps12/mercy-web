import { useState, useEffect, useCallback } from "react";
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
  { name: "Kính Mắt Thông Minh", hasSubmenu: true, submenu: ["Kính Mắt AI Thông Minh", "Kính Mắt Camera Thông Minh", "Kính Mắt Nghe Nhạc Thông Minh"] },
  { name: "Balo Thông Minh", hasSubmenu: false, submenu: [] },
  { name: "Bút Thông Minh", hasSubmenu: false, submenu: [] },
  { name: "Đồng Hồ, Vòng Đeo Tay Thông Minh", hasSubmenu: false, submenu: [] },
  { name: "Flash Sale", hasSubmenu: false, submenu: [] },
  { name: "Tai Nghe Bluetooth", hasSubmenu: true, submenu: ["Tai Nghe TWS", "Tai Nghe Chụp Tai", "Tai Nghe Mở Tai"] },
];

const SLIDE_DURATION = 6000;

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const goTo = useCallback((index: number, dir: 'left' | 'right' = 'right') => {
    if (index === current || isTransitioning) return;
    setDirection(dir);
    setIsTransitioning(true);
    setProgress(0);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 400);
  }, [current, isTransitioning]);

  // Auto-advance with progress bar
  useEffect(() => {
    let start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(elapsed / SLIDE_DURATION, 1));
      if (elapsed >= SLIDE_DURATION) {
        goTo((current + 1) % slides.length, 'right');
        start = Date.now();
        setProgress(0);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [current, goTo]);

  const slide = slides[current];

  return (
    <section id="hero-section" className={`container py-4 md:py-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="flex gap-4">
        {/* Category sidebar - desktop */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden h-full">
            {categories.map((cat, i) => (
              <div key={i} className="relative group/cat">
                <a
                  href="#"
                  className={`flex items-center justify-between px-5 py-3.5 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-all duration-250 border-b border-border/50 last:border-0 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  style={{ transitionDelay: `${200 + i * 60}ms` }}
                >
                  <span className="transition-transform duration-200 group-hover/cat:translate-x-2">{cat.name}</span>
                  {cat.hasSubmenu && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover/cat:text-primary transition-all duration-200 group-hover/cat:translate-x-1" />
                  )}
                </a>
                {cat.hasSubmenu && cat.submenu.length > 0 && (
                  <div className="absolute left-full top-0 ml-1 w-64 bg-background rounded-xl border border-border shadow-xl z-50 py-1 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 translate-x-2 group-hover/cat:translate-x-0">
                    {cat.submenu.map((sub, j) => (
                      <a
                        key={j}
                        href="#"
                        className="block px-5 py-3 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-all duration-200"
                      >
                        {sub}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main hero slider */}
        <div className="flex-1 min-w-0">
          <div className="relative rounded-xl overflow-hidden h-[250px] sm:h-[320px] md:h-[400px] lg:h-[420px] group">
            {/* Background image with Ken Burns */}
            <div className={`absolute inset-0 transition-all duration-600 ${isTransitioning ? (direction === 'right' ? 'opacity-0 scale-110 -translate-x-4' : 'opacity-0 scale-110 translate-x-4') : 'opacity-100 scale-100 translate-x-0'}`}>
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover animate-kenburns"
                width={1920}
                height={800}
              />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-mercy-dark/85 via-mercy-dark/50 to-transparent" />

            {/* Mercy logo inside slider */}
            <div className={`absolute top-5 left-1/2 -translate-x-1/2 text-center transition-all duration-600 ${isTransitioning ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <h3 className="text-primary-foreground text-xl md:text-2xl font-bold tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>Mercy</h3>
              <p className="text-primary-foreground/50 text-[8px] md:text-[10px] tracking-[0.2em]">Smart Vision - Smart Life</p>
            </div>

            {/* Content */}
            <div className={`absolute inset-0 flex flex-col justify-center px-6 md:px-10 max-w-lg transition-all duration-600 ${isTransitioning ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
              <p className="text-primary font-semibold text-xs md:text-sm mb-2 tracking-wide"
                style={{ transitionDelay: '100ms' }}
              >
                {slide.subtitle}
              </p>

              <h2 className="text-primary-foreground text-xl md:text-3xl lg:text-4xl font-extrabold mb-4 italic overflow-hidden"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <span className={`inline-block transition-all duration-700 ${isTransitioning ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
                  style={{ transitionDelay: '150ms' }}
                >
                  {slide.title}
                </span>
              </h2>

              <div className="space-y-1 mb-5">
                {slide.times.map((t, j) => (
                  <p
                    key={j}
                    className={`text-primary-foreground/70 text-xs md:text-sm transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}
                    style={{ transitionDelay: `${200 + j * 80}ms` }}
                  >
                    {t}
                  </p>
                ))}
              </div>

              <a
                href="#"
                className={`self-start border border-primary-foreground/40 text-primary-foreground text-xs md:text-sm px-5 py-2.5 rounded-md hover:bg-primary hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 active:scale-95 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
                style={{ transitionDelay: '350ms' }}
              >
                {slide.cta}
              </a>
            </div>

            {/* Avatar thumbnail bottom-right */}
            <div className="absolute bottom-4 right-4 flex items-end gap-2">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden border-2 border-primary shadow-lg">
                <img src={slide.image} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <span className="text-primary-foreground font-bold text-sm md:text-base drop-shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>Alex</span>
            </div>

            {/* Nav arrows - appear on hover */}
            <button
              onClick={() => goTo((current - 1 + slides.length) % slides.length, 'left')}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background backdrop-blur-sm p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 hover:scale-110 active:scale-90"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => goTo((current + 1) % slides.length, 'right')}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background backdrop-blur-sm p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 hover:scale-110 active:scale-90"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>

            {/* Dots + progress */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? 'right' : 'left')}
                  className="relative rounded-full overflow-hidden transition-all duration-400"
                  style={{ width: i === current ? 28 : 10, height: 10 }}
                >
                  <span className={`absolute inset-0 rounded-full transition-colors duration-300 ${i === current ? 'bg-primary-foreground/30' : 'bg-primary-foreground/40 hover:bg-primary-foreground/60'}`} />
                  {i === current && (
                    <span
                      className="absolute inset-0 rounded-full bg-primary origin-left"
                      style={{ transform: `scaleX(${progress})`, transition: 'transform 50ms linear' }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KOL sidebar - desktop */}
        <div className={`hidden xl:block w-[260px] shrink-0 transition-all duration-700 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="relative rounded-xl overflow-hidden h-full cursor-pointer group">
            <img
              src={kolBanner}
              alt="KOLs & KOCs"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              width={1200}
              height={600}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-mercy-dark/90 via-mercy-dark/40 to-transparent transition-all duration-300 group-hover:from-mercy-dark/95" />
            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 pb-8">
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/30">
                Đồng hành thương hiệu
              </span>
              <h3 className="text-primary-foreground text-2xl font-extrabold mb-1 transition-transform duration-300 group-hover:-translate-y-1">KOLS</h3>
              <h3 className="text-primary-foreground text-2xl font-extrabold mb-4 transition-transform duration-300 group-hover:-translate-y-1" style={{ transitionDelay: '50ms' }}>KOCS</h3>
              <a
                href="#"
                className="border border-primary-foreground/60 text-primary-foreground text-xs px-5 py-2 rounded-full transition-all duration-300 hover:bg-primary hover:border-primary hover:shadow-lg hover:shadow-primary/30 active:scale-95 group-hover:-translate-y-1"
                style={{ transitionDelay: '100ms' }}
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
