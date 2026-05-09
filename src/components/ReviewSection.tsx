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
    thumbnail: "https://p16-sign-sg.tiktokcdn.com/tos-alisg-p-0037/oQAEIAqIQfyAnBE7XfQDKADneFjAh0bBBxfgAN~tplv-dmt-logom:tos-alisg-i-0000/cde8cfaecaee45c79c1c2c9f42a1e2c3.image?lk3s=b59d6b55&nonce=21428&refresh_token=4c0a2c936fe94c3dddcef3f82aaad54f&x-expires=1747310400&x-signature=tsMrqR4pSSjvlZd12aqIGPT9n0k%3D&shp=b59d6b55&shcp=fdd36af4",
  },
  {
    id: 2,
    videoId: "7616707469141740821",
    title: "GIỐNG RAYBAN MÀ RẺ 1/2",
    productIndex: 3,
    thumbnail: "https://p16-sign-sg.tiktokcdn.com/tos-alisg-p-0037/oUDAAAAfIiAEExfyh7f0QDhKebBNgqABjAnNZ~tplv-dmt-logom:tos-alisg-i-0000/d6befc9b1f8e4be0b47f8bdf2fe72847.image?lk3s=b59d6b55&nonce=51282&refresh_token=7e27804f76e5fbb11f500b9b5dab3d29&x-expires=1747310400&x-signature=8qH9Rn%2BvYnVrMeA%2FC8VJMGEQbhg%3D&shp=b59d6b55&shcp=fdd36af4",
  },
  {
    id: 3,
    videoId: "7616353847182675220",
    title: "CHECK VAR KÍNH CAMERA MERCY",
    productIndex: 12,
    thumbnail: "https://p16-sign-sg.tiktokcdn.com/tos-alisg-p-0037/oUhf0AAAABIQAqEfeD7gAgDxnyNKjBbfNieZEh~tplv-dmt-logom:tos-alisg-i-0000/f0e83b0d20fc430497dcf3e27be8e0c5.image?lk3s=b59d6b55&nonce=41768&refresh_token=ba7e9f5f2f16e4f28e3e5b9ae01e82ac&x-expires=1747310400&x-signature=qbdGJD%2BYLR8bOxvLG6gkZ43m%2FMQ%3D&shp=b59d6b55&shcp=fdd36af4",
  },
  {
    id: 4,
    videoId: "7578746935889104148",
    title: "Bị cướp điện thoại khi đang lái xe",
    productIndex: 6,
    thumbnail: "https://p16-sign-sg.tiktokcdn.com/tos-alisg-p-0037/oUBDFf9AEAQhq3AeKCHINiBfXgiA2DnNjBA0ED~tplv-dmt-logom:tos-alisg-i-0000/43ec60b0aa0a42cdb4f3289ae4e1a0f1.image?lk3s=b59d6b55&nonce=66814&refresh_token=d71e8d8a8ff1c37a38f87b4e2c5b11cc&x-expires=1747310400&x-signature=dI1X6Nk52ZfVSXw%2FYG8kHfpZHsg%3D&shp=b59d6b55&shcp=fdd36af4",
  },
  {
    id: 5,
    videoId: "7578457567358192917",
    title: "Bật mí góc quay POV cho reviewer",
    productIndex: 14,
    thumbnail: "https://p16-sign-sg.tiktokcdn.com/tos-alisg-p-0037/oMFAAfEgKN0Be3ghCIQxAAqEi2DBbjfNAjIHD9~tplv-dmt-logom:tos-alisg-i-0000/c36c7bfc0a4342e79c4bc0fc26a95ede.image?lk3s=b59d6b55&nonce=87012&refresh_token=dff0c3bd4d90f4dab75a52e91f68cf0f&x-expires=1747310400&x-signature=yh2kIlpFWXjwGfn5m%2BqFBYu4kqA%3D&shp=b59d6b55&shcp=fdd36af4",
  },
  {
    id: 6,
    videoId: "7575548507571096853",
    title: "Dịch thuật Real Time trên kính Mercy",
    productIndex: 8,
    thumbnail: "https://p16-sign-sg.tiktokcdn.com/tos-alisg-p-0037/o0hfAABD2E3xQIEqeN9bAAgfIj7gKDnAfNBiCi~tplv-dmt-logom:tos-alisg-i-0000/42d75d68bad7404cb18fc8b3aa36dcee.image?lk3s=b59d6b55&nonce=16693&refresh_token=f1f3a7a04a82cbb4f4ddf8e1d2bce45a&x-expires=1747310400&x-signature=v5N1hBXdOa4vJU5zYmTLgx6fJJk%3D&shp=b59d6b55&shcp=fdd36af4",
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
  const [liveThumbnail, setLiveThumbnail] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically fetch the live thumbnail to bypass expiring CDN URLs
    const fetchThumbnail = async () => {
      try {
        const res = await fetch(`https://www.tiktok.com/oembed?url=https://www.tiktok.com/@tiktok/video/${item.videoId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.thumbnail_url) {
          setLiveThumbnail(data.thumbnail_url);
        }
      } catch (err) {
        // Silently fail and fallback to hardcoded or product image
      }
    };
    fetchThumbnail();
  }, [item.videoId]);

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
            className="w-full h-full relative flex flex-col items-center justify-center cursor-pointer group/play overflow-hidden"
            aria-label={`Phát video: ${item.title}`}
          >
            {/* Product image as base thumbnail — always shown */}
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover/play:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            )}
            {/* TikTok thumbnail on top (may expire, product image stays as fallback) */}
            {(liveThumbnail || item.thumbnail) && (
              <img
                src={liveThumbnail || item.thumbnail}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover/play:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70 group-hover/play:from-black/20 group-hover/play:via-black/30 group-hover/play:to-black/60 transition-all" />
            
            {/* Play button */}
            <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center mb-3 group-hover/play:scale-110 group-hover/play:bg-red-600/80 group-hover/play:border-red-400 transition-all duration-300 shadow-xl">
              <Play className="w-7 h-7 md:w-8 md:h-8 text-white ml-1" fill="white" />
            </div>
            <p className="relative z-10 text-white text-sm font-bold px-6 text-center leading-snug drop-shadow-lg">
              {item.title}
            </p>
            <p className="relative z-10 text-white/70 text-xs mt-2 flex items-center gap-1.5">
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
