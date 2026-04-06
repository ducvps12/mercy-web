import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { products, formatPrice } from "@/data/products";

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
            className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => {
              const discount = product.originalPrice
                ? Math.round((1 - product.price / product.originalPrice) * 100)
                : 0;

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="snap-start flex-shrink-0 w-[140px] md:w-[180px] group/item"
                >
                  <div className="relative rounded-lg overflow-hidden bg-muted aspect-square mb-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                    />
                    {discount > 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-destructive text-destructive-foreground text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded">
                        -{discount}%
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs md:text-sm text-foreground leading-tight line-clamp-2 mb-1 group-hover/item:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm md:text-base font-bold text-destructive">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[10px] md:text-xs text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
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

export default CategorySuggestions;
