import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getBanners } from "@/pages/admin/AdminBanners";

const BannerSlider = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [banners, setBanners] = useState(getBanners());

  useEffect(() => {
    const handleStorage = () => setBanners(getBanners());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.6;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-6 md:py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {banners.map((b) => (
              <a
                key={b.id}
                href="#"
                className="snap-start flex-shrink-0 w-[70vw] sm:w-[45vw] md:w-[32vw] lg:w-[24vw] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={b.image}
                  alt={b.alt}
                  loading="lazy"
                  width={1200}
                  height={512}
                  className="w-full h-auto object-cover"
                />
              </a>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BannerSlider;
