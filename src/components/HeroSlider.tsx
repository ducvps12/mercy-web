import { useState, useEffect } from "react";
import heroBanner1 from "@/assets/hero-banner-1.jpg";
import heroBanner2 from "@/assets/hero-banner-2.jpg";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: heroBanner1,
    subtitle: "Super Brand Days! Sale 30% OFF",
    title: "Săn Deal trên LiveStream",
    times: ["9h00 - 12h00", "21h00 - 00h00", "00h00 - 02h00"],
    cta: "Săn trên Shopee",
    ctaLink: "#",
  },
  {
    image: heroBanner2,
    subtitle: "Super Brand Days! Sale 30% OFF",
    title: "Săn Deal trên LiveStream",
    times: ["9h00 - 12h00", "21h00 - 00h00", "00h00 - 02h00"],
    cta: "Săn trên TikTokShop",
    ctaLink: "#",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[560px]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              width={1920}
              height={800}
            />
            <div className="absolute inset-0 bg-mercy-dark/40 flex items-center">
              <div className="container">
                <p className="text-primary font-semibold text-sm md:text-base mb-2">{slide.subtitle}</p>
                <h2 className="text-primary-foreground text-2xl md:text-4xl lg:text-5xl font-extrabold mb-4">{slide.title}</h2>
                <div className="flex gap-3 mb-6">
                  {slide.times.map((t, j) => (
                    <span key={j} className="bg-primary/20 text-primary-foreground text-xs md:text-sm px-3 py-1.5 rounded-full border border-primary/30 font-medium">
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={slide.ctaLink}
                  className="inline-block bg-primary hover:bg-mercy-orange-light text-primary-foreground font-semibold px-6 py-3 rounded-lg transition-colors text-sm md:text-base"
                >
                  {slide.cta}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <button
        onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-primary-foreground/50"}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
