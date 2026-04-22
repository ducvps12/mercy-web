import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Glasses, Camera, Languages, Bot, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getHeroBanner, getPromoBanners } from "@/pages/admin/AdminBanners";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const HeroSection = () => {
  const navigate = useNavigate();
  const hero = getHeroBanner();
  const promoBanners = getPromoBanners();

  return (
    <section id="hero-section" className="relative z-0">
      {/* Background that spans screen height behind the elements */}
      <div
        className="absolute inset-x-0 top-0 h-screen -z-10"
        style={{
          background: 'linear-gradient(180deg, #be0117 0%, #e8445a 25%, #f7a8b8 50%, #fde8e8 70%, #f8f9fa 100%)',
        }}
      />

      {/* ═══════════ Hero Banner – FPT Shop style: full-width with gradient ═══════════ */}
      <div className="w-full">
        <div className="container pt-2">
          <a href={hero.link} className="block cursor-pointer">
            <img
              src={hero.image}
              alt={hero.alt}
              className="w-full h-auto object-contain"
              loading="eager"
            />
          </a>
        </div>
      </div>

      {/* ═══════════ Dual Promo Banners – FPT-style ═══════════ */}
      {promoBanners.length > 0 && (
        <div className="container py-3 md:py-4">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full relative group"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {(promoBanners.length === 2 ? [...promoBanners, ...promoBanners] : promoBanners).map((banner, i) => (
                <CarouselItem key={`${banner.id || 'banner'}-${i}`} className="pl-3 md:pl-4 md:basis-1/2">
                  <button
                    onClick={(e) => {
                      navigate(banner.link);
                    }}
                    className="w-full relative rounded-xl overflow-hidden group/banner hover:shadow-md transition-all duration-200 active:scale-[0.98] bg-white border border-gray-100 block"
                  >
                    <div className="w-full">
                      <img
                        src={banner.image}
                        alt={banner.alt}
                        className="w-full h-auto object-contain group-hover/banner:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                      />
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

      {/* ═══════════ Featured Categories – Apple/Google-inspired premium design ═══════════ */}
      <div className="container pb-3 md:pb-5">
        <div className="bg-white rounded-2xl p-5 md:p-7 border border-gray-100">
          {/* Header with animated gradient accent */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Danh mục nổi bật</h2>
              <p className="text-xs text-gray-400 mt-0.5">Khám phá các sản phẩm công nghệ đeo thông minh</p>
            </div>
            <button
              onClick={() => navigate("/shop")}
              className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
            >
              Xem tất cả →
            </button>
          </div>

          {/* Category Grid - Responsive & Premium */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {[
              {
                name: "Kính Bluetooth",
                desc: "Nghe nhạc, gọi điện, trợ lý AI",
                icon: Headphones,
                gradient: "from-red-500 via-rose-500 to-pink-500",
                lightBg: "from-red-50 via-rose-50 to-pink-50",
                borderHover: "hover:border-red-300",
                image: "/products/MCK5.0D-0.jpg",
                count: 6,
                link: "/shop",
              },
              {
                name: "Kính Camera",
                desc: "Quay 2K POV, chụp 32MP",
                icon: Camera,
                gradient: "from-blue-500 via-indigo-500 to-violet-500",
                lightBg: "from-blue-50 via-indigo-50 to-violet-50",
                borderHover: "hover:border-blue-300",
                image: "/products/POV5.0D-0.jpg",
                count: 6,
                link: "/shop",
              },
              {
                name: "Kính Dịch Thuật",
                desc: "Realtime 40+ ngôn ngữ",
                icon: Languages,
                gradient: "from-emerald-500 via-teal-500 to-cyan-500",
                lightBg: "from-emerald-50 via-teal-50 to-cyan-50",
                borderHover: "hover:border-emerald-300",
                image: "/products/KDT5.0D-0.jpg",
                count: 6,
                link: "/shop",
              },
              {
                name: "Robot AI",
                desc: "Gia sư AI, mắt LED biểu cảm",
                icon: Bot,
                gradient: "from-purple-500 via-violet-500 to-fuchsia-500",
                lightBg: "from-purple-50 via-violet-50 to-fuchsia-50",
                borderHover: "hover:border-purple-300",
                image: "/products/RBnu-capy-0.jpg",
                count: 4,
                link: "/shop",
              },
              {
                name: "Phụ Kiện",
                desc: "Bao da cao cấp, quà tặng",
                icon: Glasses,
                gradient: "from-amber-500 via-orange-500 to-red-500",
                lightBg: "from-amber-50 via-orange-50 to-red-50",
                borderHover: "hover:border-amber-300",
                image: "/products/Bao-da-0.jpg",
                count: 2,
                link: "/shop",
              },
            ].map((cat, i) => (
              <button
                key={i}
                onClick={() => navigate(cat.link)}
                className={`group relative overflow-hidden rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] text-left`}
              >
                {/* Product image with gradient overlay */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                  {/* Product count badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[10px] font-bold text-white px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                      {cat.count} SP
                    </span>
                  </div>

                  {/* Category info on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center ring-1 ring-white/30`}>
                        <cat.icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-white drop-shadow-md">{cat.name}</h3>
                    </div>
                    <p className="text-[10px] text-white/80 font-medium line-clamp-1">{cat.desc}</p>
                  </div>
                </div>

                {/* Animated bottom accent line */}
                <div className="h-[2px] bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
