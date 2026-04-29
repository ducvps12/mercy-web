import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { formatPrice } from "@/data/products";
import { Link } from "react-router-dom";

// TikTok review videos from @mr.manhdora.macginhi
const tiktokReviews = [
  {
    id: 1,
    videoId: "7616957685631683861",
    title: "CHECK VAR KÍNH AI CÓ CAMERA",
    productIndex: 0,
  },
  {
    id: 2,
    videoId: "7616707469141740821",
    title: "GIỐNG RAYBAN MÀ RẺ 1/2",
    productIndex: 3,
  },
  {
    id: 3,
    videoId: "7616353847182675220",
    title: "CHECK VAR KÍNH CAMERA MERCY",
    productIndex: 12,
  },
  {
    id: 4,
    videoId: "7578746935889104148",
    title: "Bị cướp điện thoại khi đang lái xe",
    productIndex: 6,
  },
  {
    id: 5,
    videoId: "7578457567358192917",
    title: "Bật mí góc quay POV cho reviewer",
    productIndex: 14,
  },
  {
    id: 6,
    videoId: "7575548507571096853",
    title: "Dịch thuật Real Time trên kính Mercy",
    productIndex: 8,
  }
];

/**
 * Lazy-loaded TikTok video card.
 * The iframe is only mounted when the user taps/clicks the play button.
 * This prevents the TikTok SDK from firing hundreds of tracking requests
 * (batch/biz_id, item_list, translation_language, webmssdk …) on page load.
 */
const TikTokVideoCard = ({ item }: { item: any }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      key={item.id}
      className="snap-start flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px]"
    >
      {/* TikTok Video – loaded only on user interaction */}
      <div className="relative aspect-[9/16] bg-gray-900 rounded-xl mb-3 shadow-md border border-gray-100/50 overflow-hidden">
        {isPlaying ? (
          <iframe
            src={`https://www.tiktok.com/player/v1/${item.videoId}?autoplay=1&music_info=0&description=0`}
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            title={item.title}
          />
        ) : (
          <button
            onClick={() => setIsPlaying(true)}
            className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all group/play cursor-pointer"
            aria-label={`Phát video: ${item.title}`}
          >
            {/* Thumbnail placeholder with TikTok branding */}
            <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mb-4 group-hover/play:scale-110 group-hover/play:bg-red-600/80 group-hover/play:border-red-400 transition-all duration-300">
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            </div>
            <p className="text-white/90 text-sm font-semibold px-6 text-center leading-snug">
              {item.title}
            </p>
            <p className="text-white/50 text-xs mt-2 flex items-center gap-1.5">
              <svg viewBox="0 0 48 48" className="w-4 h-4" fill="currentColor">
                <path d="M38.3 10.7c-1.5-1.6-2.5-3.7-2.7-6h-5.7V30c0 3.1-2.5 5.7-5.7 5.7-3.1 0-5.7-2.5-5.7-5.7 0-3.1 2.5-5.7 5.7-5.7.6 0 1.2.1 1.7.3v-5.9c-.6-.1-1.1-.1-1.7-.1-6.4 0-11.6 5.2-11.6 11.6S18 41.6 24.4 41.6 36 36.4 36 30V19.4c2.3 1.7 5.2 2.7 8.2 2.7v-5.8c-2.3-.1-4.4-1.1-5.9-2.6z" />
              </svg>
              Nhấn để xem trên TikTok
            </p>
          </button>
        )}
      </div>

      {/* Product info */}
      <Link
        to={`/product/${item.productId}`}
        className="flex items-start gap-3 group/link bg-white border border-gray-100 p-3 rounded-xl hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-14 h-14 md:w-16 md:h-16 rounded-lg object-cover border border-gray-100 flex-shrink-0"
        />
        <div className="min-w-0">
          {item.originalPrice && (
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(item.originalPrice)}
              </span>
              <span className="text-xs text-red-600 font-semibold">
                -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
              </span>
            </div>
          )}
          <p className="font-bold text-sm text-red-600">
            {formatPrice(item.price)}
          </p>
          <p className="text-xs text-gray-500 truncate group-hover/link:text-red-600 transition-colors">
            {item.name}
          </p>
        </div>
      </Link>
    </div>
  );
};

const ReviewSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { products } = useShop();

  const reviewItems = useMemo(() => {
    if (!products.length) return [];
    return tiktokReviews.map((r) => {
      const p = products[r.productIndex] || products[0];
      return {
        ...r,
        name: p?.name || "Sản phẩm",
        price: p?.price || 0,
        originalPrice: p?.originalPrice,
        image: p?.image || "",
        productId: p?.id || "",
      };
    });
  }, [products]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.7;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-4 md:py-6">
      <div className="container mx-auto px-4">
        {/* FPT-style white card wrapper */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              🎬 Góc review
            </h2>
            <span className="text-sm font-medium text-gray-500">
              Xem trực tiếp tại website
            </span>
          </div>

          <div className="relative group">
            <button
              onClick={() => scroll("left")}
              className="absolute -left-3 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {reviewItems.map((item) => (
                <TikTokVideoCard key={item.id} item={item} />
              ))}
            </div>

            <button
              onClick={() => scroll("right")}
              className="absolute -right-3 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
