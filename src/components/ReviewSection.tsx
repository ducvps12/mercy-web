import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { products, formatPrice } from "@/data/products";
import { Link } from "react-router-dom";

const reviewItems = products.slice(0, 5).map((p) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  originalPrice: p.originalPrice,
  image: p.image,
  thumbnail: p.images[1] || p.image,
}));

const ReviewSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.7;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const discount = (price: number, original?: number) => {
    if (!original) return null;
    return `-${Math.round(((original - price) / original) * 100)}%`;
  };

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
          Góc review dành cho bạn
        </h2>

        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reviewItems.map((item) => (
              <div
                key={item.id}
                className="snap-start flex-shrink-0 w-[75vw] sm:w-[55vw] md:w-[42vw] lg:w-[32vw]"
              >
                {/* Video / Image area */}
                <div
                  className="relative aspect-[4/3] bg-mercy-dark rounded-xl overflow-hidden cursor-pointer mb-3"
                  onClick={() =>
                    setPlayingId(playingId === item.id ? null : item.id)
                  }
                >
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <Play className="w-7 h-7 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>

                {/* Product info */}
                <Link
                  to={`/product/${item.id}`}
                  className="flex items-start gap-3 group/link"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-14 h-14 md:w-16 md:h-16 rounded-lg object-cover border border-border flex-shrink-0"
                  />
                  <div className="min-w-0">
                    {item.originalPrice && (
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                        <span className="text-xs text-destructive font-semibold">
                          {discount(item.price, item.originalPrice)}
                        </span>
                      </div>
                    )}
                    <p className="font-bold text-sm md:text-base text-foreground">
                      {formatPrice(item.price)}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate group-hover/link:text-primary transition-colors">
                      {item.name}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
