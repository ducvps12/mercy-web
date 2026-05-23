import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Văn Hùng",
    role: "Content Creator",
    company: "TikToker @hungtraveler",
    rating: 5,
    content:
      "Kính Camera POV từ Mercy giúp mình quay được những góc nhìn độc đáo mà không cần cầm điện thoại. Chất lượng 2K siêu nét, âm thanh rõ ràng. Đỉnh thật sự!",
    avatar: "https://ui-avatars.com/api/?name=NVH&background=3b82f6&color=fff&bold=true&size=128",
  },
  {
    id: 2,
    name: "Trần Thị Mai",
    role: "Giáo viên tiếng Anh",
    company: "Trung tâm Anh ngữ SAM",
    rating: 5,
    content:
      "Kính dịch thuật realtime là một sản phẩm tuyệt vời! Hỗ trợ 40+ ngôn ngữ, dịch chính xác và tự nhiên. Giúp mình rất nhiều trong việc giao tiếp với học viên nước ngoài.",
    avatar: "https://ui-avatars.com/api/?name=TTM&background=ec4899&color=fff&bold=true&size=128",
  },
  {
    id: 3,
    name: "Lê Minh Đức",
    role: "Doanh nhân",
    company: "CEO StartUp Tech",
    rating: 5,
    content:
      "Tôi đã mua MCK 5.1 cho cả team. Nghe nhạc, nhận cuộc gọi, điều khiển bằng giọng nói – tất cả trên một chiếc kính. Dịch vụ chăm sóc khách hàng của Mercy cũng rất chuyên nghiệp.",
    avatar: "https://ui-avatars.com/api/?name=LMD&background=8b5cf6&color=fff&bold=true&size=128",
  },
  {
    id: 4,
    name: "Phạm Quốc Anh",
    role: "Reviewer công nghệ",
    company: "YouTube @QuocAnhTech",
    rating: 5,
    content:
      "Sau khi review nhiều thương hiệu kính thông minh, Mercy là sản phẩm có giá cả hợp lý nhất so với tính năng. Bảo hành trọn đời là điểm cộng lớn!",
    avatar: "https://ui-avatars.com/api/?name=PQA&background=f59e0b&color=fff&bold=true&size=128",
  },
  {
    id: 5,
    name: "Hoàng Yến",
    role: "Travel Blogger",
    company: "Instagram @yengoesplaces",
    rating: 5,
    content:
      "Đi du lịch mà có kính dịch thuật Mercy, mình tự tin giao tiếp ở bất cứ đâu. Pin trâu, thiết kế nhẹ, đeo cả ngày không mỏi. Recommend mọi người luôn!",
    avatar: "https://ui-avatars.com/api/?name=HY&background=10b981&color=fff&bold=true&size=128",
  },
];

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollReveal(0.1);
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Show 1 on mobile, 3 on desktop
  const visibleCount = typeof window !== "undefined" && window.innerWidth >= 768 ? 3 : 1;
  const maxIndex = Math.max(0, testimonials.length - visibleCount);

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlay, maxIndex]);

  const goPrev = () => {
    setIsAutoPlay(false);
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goNext = () => {
    setIsAutoPlay(false);
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section ref={ref} className="py-4 md:py-6">
      <div className="container">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-8 overflow-hidden">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Phản hồi từ khách hàng
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Hơn 16,000+ khách hàng đã tin tưởng và hài lòng với sản phẩm của chúng tôi
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Nav Buttons */}
            <button
              onClick={goPrev}
              className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <div className="overflow-hidden mx-6 md:mx-8">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${current * (100 / visibleCount)}%)`,
                }}
              >
                {testimonials.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 px-2"
                    style={{
                      width: `${100 / visibleCount}%`,
                    }}
                  >
                    <div className="bg-white border border-gray-100 rounded-xl p-5 md:p-6 h-full relative hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                      {/* Quote icon */}
                      <Quote className="w-8 h-8 text-red-100 absolute top-4 right-4" />

                      {/* Stars */}
                      <div className="flex gap-0.5 mb-4">
                        {Array.from({ length: item.rating }).map((_, si) => (
                          <Star
                            key={si}
                            className="w-4 h-4 text-amber-400 fill-amber-400"
                          />
                        ))}
                      </div>

                      {/* Content */}
                      <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-3 md:line-clamp-none italic">
                        "{item.content}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                          loading="lazy"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {item.role} • {item.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={goNext}
              className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrent(i);
                  setIsAutoPlay(false);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-red-500 w-6"
                    : "bg-gray-300 w-2 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
