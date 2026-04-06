import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Kính bluetooth", image: "https://images.unsplash.com/photo-1574258495973-f7977603b6d2?w=200&h=200&fit=crop", badge: null },
  { name: "Kính thời trang", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=200&fit=crop", badge: null },
  { name: "Kính râm", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop", badge: "Hot" },
  { name: "Kính cận", image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=200&h=200&fit=crop", badge: null },
  { name: "Kính chống ánh sáng xanh", image: "https://images.unsplash.com/photo-1574258495973-f7977603b6d2?w=200&h=200&fit=crop", badge: "1 đổi 1" },
  { name: "Kính thể thao", image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=200&h=200&fit=crop", badge: null },
  { name: "Gọng kính", image: "https://images.unsplash.com/photo-1533139143976-30918502365b?w=200&h=200&fit=crop", badge: null },
  { name: "Tròng kính", image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=200&h=200&fit=crop", badge: "1 đổi 1" },
  { name: "Phụ kiện kính", image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=200&h=200&fit=crop", badge: null },
  { name: "Hộp đựng kính", image: "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=200&h=200&fit=crop", badge: null },
  { name: "Dây đeo kính", image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=200&h=200&fit=crop", badge: null },
  { name: "Khăn lau kính", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop", badge: null },
];

const CategorySuggestions = () => {
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
    <section className="py-6 md:py-10 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 italic">
          Gợi ý cho bạn
        </h2>

        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          <div
            ref={scrollRef}
            className="grid grid-rows-2 grid-flow-col gap-x-4 gap-y-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="snap-start flex flex-col items-center gap-2 w-[100px] md:w-[120px] flex-shrink-0 group/item"
              >
                <div className="relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-lg overflow-hidden bg-muted">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                  />
                  {cat.badge && (
                    <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                      {cat.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs md:text-sm text-foreground text-center leading-tight group-hover/item:text-primary transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-4">
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="w-8 h-full bg-foreground/40 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySuggestions;
