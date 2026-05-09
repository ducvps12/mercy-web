import { Shield, Truck, RotateCcw, Headphones, Lock, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    icon: Shield,
    title: "Thương hiệu đảm bảo",
    desc: "Cam kết chính hãng 100%, nguồn gốc rõ ràng",
    iconBg: "bg-red-50 text-red-600",
  },
  {
    icon: Sparkles,
    title: "Cải tiến liên tục",
    desc: "Luôn cập nhật công nghệ mới, nâng cấp trải nghiệm",
    iconBg: "bg-amber-50 text-amber-600",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ kỹ thuật 24/7",
    desc: "Phản hồi nhanh trong 15 phút, đội ngũ chuyên nghiệp",
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    icon: Lock,
    title: "Bảo mật an toàn",
    desc: "Bảo vệ thông tin khách hàng, thanh toán an toàn",
    iconBg: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: RotateCcw,
    title: "Cam kết chất lượng",
    desc: "Sản phẩm chính hãng, kiểm định nghiêm ngặt",
    iconBg: "bg-purple-50 text-purple-600",
  },
  {
    icon: Truck,
    title: "Giao hàng tận nơi",
    desc: "Miễn phí vận chuyển toàn quốc, giao nhanh 2h nội thành",
    iconBg: "bg-cyan-50 text-cyan-600",
  },
];

const FeaturesBar = () => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section ref={ref} className="py-2 md:py-6">
      <div className="container">
        <div className="bg-white rounded-2xl border border-gray-100 p-3 md:p-8">
          {/* Section Header */}
          <div
            className={`text-center mb-3 md:mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-sm md:text-xl font-bold text-gray-900">
              Lý do Mercy được khách hàng tin tưởng
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
              Mercy mang đến sự an tâm thông qua sản phẩm chất lượng và dịch vụ chuyên nghiệp
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 md:grid-cols-3 xl:grid-cols-6 gap-2 md:gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className={`group text-center p-2 md:p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${150 + i * 80}ms` }}
              >
                {/* Icon */}
                <div
                  className={`w-8 h-8 md:w-12 md:h-12 mx-auto rounded-lg md:rounded-xl ${f.iconBg} flex items-center justify-center mb-1.5 md:mb-3 transition-transform duration-200 group-hover:scale-105`}
                >
                  <f.icon className="w-4 h-4 md:w-6 md:h-6" />
                </div>

                {/* Text */}
                <h3 className="font-semibold text-[10px] md:text-sm text-gray-900 mb-0.5 md:mb-1 leading-tight">
                  {f.title}
                </h3>
                <p className="text-[9px] md:text-[11px] text-gray-500 leading-snug hidden md:block">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
