import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Glasses, Camera, Languages, Bot, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getHeroBanner } from "@/pages/admin/AdminBanners";
import { getBanners } from "@/components/BannerSlider";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// ═══ Category data with localStorage persistence ═══
export interface CategoryItem {
  name: string;
  desc: string;
  iconName: string; // stored as string key for serialization
  gradient: string;
  lightBg: string;
  borderHover: string;
  image: string;
  count: number;
  link: string;
}

const CATEGORY_STORAGE_KEY = "mercy_featured_categories";

export const defaultCategories: CategoryItem[] = [
  {
    name: "Kính Bluetooth", desc: "Nghe nhạc, gọi điện, trợ lý AI", iconName: "Headphones",
    gradient: "from-red-500 via-rose-500 to-pink-500", lightBg: "from-red-50 via-rose-50 to-pink-50",
    borderHover: "hover:border-red-300", image: "/products/MCK5.0D-0.jpg", count: 6,
    link: "/danh-muc/kinh-thong-minh-ai",
  },
  {
    name: "Kính Camera", desc: "Quay 2K POV, chụp 32MP", iconName: "Camera",
    gradient: "from-blue-500 via-indigo-500 to-violet-500", lightBg: "from-blue-50 via-indigo-50 to-violet-50",
    borderHover: "hover:border-blue-300", image: "/products/POV5.0D-0.jpg", count: 6,
    link: "/danh-muc/kinh-camera",
  },
  {
    name: "Kính Dịch Thuật", desc: "Realtime 40+ ngôn ngữ", iconName: "Languages",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500", lightBg: "from-emerald-50 via-teal-50 to-cyan-50",
    borderHover: "hover:border-emerald-300", image: "/products/KDT5.0D-0.jpg", count: 6,
    link: "/danh-muc/kinh-dich-thuat",
  },
  {
    name: "Robot AI", desc: "Gia sư AI, mắt LED biểu cảm", iconName: "Bot",
    gradient: "from-purple-500 via-violet-500 to-fuchsia-500", lightBg: "from-purple-50 via-violet-50 to-fuchsia-50",
    borderHover: "hover:border-purple-300", image: "/products/RBnu-capy-0.jpg", count: 4,
    link: "/danh-muc/robot-ai",
  },
  {
    name: "Phụ Kiện", desc: "Bao da cao cấp, quà tặng", iconName: "Glasses",
    gradient: "from-amber-500 via-orange-500 to-red-500", lightBg: "from-amber-50 via-orange-50 to-red-50",
    borderHover: "hover:border-amber-300", image: "/products/Bao-da-0.jpg", count: 2,
    link: "/danh-muc/phu-kien",
  },
];

export function getFeaturedCategories(): CategoryItem[] {
  try {
    const saved = localStorage.getItem(CATEGORY_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return defaultCategories;
}

export function saveFeaturedCategories(cats: CategoryItem[]) {
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(cats));
}

const iconMap: Record<string, any> = { Headphones, Camera, Languages, Bot, Glasses };
function getIcon(name: string) { return iconMap[name] || Glasses; }

const HeroSection = () => {
  const navigate = useNavigate();
  const hero = getHeroBanner();
  const promoBanners = getBanners();
  const categoryItems = getFeaturedCategories();

  return (
    <section id="hero-section" className="relative z-0">
      {/* Background — shown on all screen sizes */}
      <div
        className="absolute inset-x-0 top-0 h-screen -z-10"
        style={{
          backgroundImage: "url('/banner2/bgimg.png')",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* ═══════════ Hero Banner – FPT Shop style: full-width ═══════════ */}
      <div className="w-full">
        <div className="md:container pt-1 md:pt-2">
          <a href={hero.link} className="block cursor-pointer">
            <picture>
              {hero.imageMobile && <source media="(max-width: 767px)" srcSet={hero.imageMobile} />}
              <img
                src={hero.image}
                alt={hero.alt || "Mercy Promotion"}
                className="w-full h-auto object-contain drop-shadow-sm md:rounded-xl"
                loading="eager"
              />
            </picture>
          </a>
        </div>
      </div>

      {/* ═══════════ Promo Banners – compact on mobile, dual on desktop ═══════════ */}
      {promoBanners.length > 0 && (
        <div className="container py-2 md:py-4">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full relative group"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {(promoBanners.length === 2 ? [...promoBanners, ...promoBanners] : promoBanners).map((banner, i) => (
                <CarouselItem key={`${banner.id || 'banner'}-${i}`} className="pl-2 md:pl-4 basis-full md:basis-1/2">
                  <button
                    onClick={(e) => {
                      navigate(banner.link);
                    }}
                    className="w-full relative rounded-xl overflow-hidden group/banner hover:shadow-md transition-all duration-200 active:scale-[0.98] bg-white border border-gray-100 block"
                  >
                    <div className="w-full rounded-xl overflow-hidden">
                      <picture>
                        {banner.imageMobile && <source media="(max-width: 767px)" srcSet={banner.imageMobile} />}
                        <img
                          src={banner.image}
                          alt={banner.alt}
                          className="w-full h-auto object-contain group-hover/banner:scale-[1.02] transition-transform duration-500"
                          loading="lazy"
                        />
                      </picture>
                    </div>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            {promoBanners.length >= 2 && (
              <>
                <CarouselPrevious className="-left-3 md:-left-5 bg-white/95 hover:bg-white shadow-md border border-gray-100 text-gray-800 h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <CarouselNext className="-right-3 md:-right-5 bg-white/95 hover:bg-white shadow-md border border-gray-100 text-gray-800 h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              </>
            )}
          </Carousel>
        </div>
      )}

      {/* ═══════════ Featured Categories – FPT Shop style icon grid on mobile ═══════════ */}
      <div className="container pb-3 md:pb-5">
        <div className="bg-white rounded-2xl p-4 md:p-7 border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 md:mb-6">
            <div>
              <h2 className="text-base md:text-xl font-bold text-gray-900">Danh mục nổi bật</h2>
            </div>
            <button
              onClick={() => navigate("/shop")}
              className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
            >
              Xem tất cả →
            </button>
          </div>

          {/* Category Grid — full card layout on all screen sizes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {categoryItems.map((cat, i) => (
              <CategoryCard key={i} cat={cat} navigate={navigate} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};



// Shared category card component
const CategoryCard = ({ cat, navigate }: { cat: CategoryItem; navigate: any }) => {
  const IconComp = getIcon(cat.iconName);
  return (
  <button
    onClick={() => navigate(cat.link)}
    className="group relative overflow-hidden rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] text-left w-full"
  >
    {/* Product image — square ratio to prevent cropping */}
    <div className="relative overflow-hidden aspect-square">
      <img
        src={cat.image}
        alt={cat.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        loading="lazy"
      />
      {/* Gradient overlay — strong for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* Product count badge */}
      <div className="absolute top-2 right-2 md:top-2.5 md:right-2.5">
        <span className="text-[10px] font-bold text-white px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/25">
          {cat.count} SP
        </span>
      </div>

      {/* Category info on image — solid background bar for readability */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="px-3 py-2.5 bg-black/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-white/30 backdrop-blur-md flex items-center justify-center ring-1 ring-white/50">
              <IconComp className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
            </div>
            <h3 className="text-[13px] md:text-sm font-bold text-white drop-shadow-md">{cat.name}</h3>
          </div>
          <p className="text-[10px] md:text-[11px] pl-8 md:pl-9 text-white/95 font-semibold line-clamp-1">{cat.desc}</p>
        </div>
      </div>
    </div>

    {/* Animated bottom accent line */}
    <div className="h-[2px] bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
  </button>
  );
};

export default HeroSection;
