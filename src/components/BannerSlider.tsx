import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import banner1 from "@/assets/banners/banner-1.jpg";
import banner2 from "@/assets/banners/banner-2.jpg";
import banner3 from "@/assets/banners/banner-3.jpg";
import banner4 from "@/assets/banners/banner-4.jpg";

const banners = [
  { id: 1, image: banner1, alt: "Phụ kiện công nghệ" },
  { id: 2, image: banner2, alt: "Samsung Galaxy" },
  { id: 3, image: banner3, alt: "Smart Home" },
  { id: 4, image: banner4, alt: "Camera hành động" },
];

const BannerSlider = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

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
