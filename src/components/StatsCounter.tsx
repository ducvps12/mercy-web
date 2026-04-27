import { Users, Package, ThumbsUp, Headphones, Award } from "lucide-react";
import { useScrollReveal, useCountUp } from "@/hooks/useScrollReveal";

const stats = [
  {
    icon: Users,
    value: 16000,
    suffix: "+",
    label: "Khách hàng tin tưởng",
    textColor: "text-blue-600",
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    icon: Award,
    value: 10,
    suffix: "+",
    label: "Đối tác tin cậy của các thương hiệu hơn",
    textColor: "text-emerald-600",
    iconBg: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: ThumbsUp,
    value: 96,
    suffix: "%",
    label: "Khách hàng hài lòng",
    textColor: "text-amber-600",
    iconBg: "bg-amber-50 text-amber-600",
  },
  {
    icon: Headphones,
    value: 24,
    suffix: "/7",
    label: "Hỗ trợ kỹ thuật",
    textColor: "text-purple-600",
    iconBg: "bg-purple-50 text-purple-600",
  },
];

const StatItem = ({
  stat,
  index,
  isVisible,
}: {
  stat: (typeof stats)[0];
  index: number;
  isVisible: boolean;
}) => {
  const count = useCountUp(stat.value, 2000, isVisible);

  return (
    <div
      className={`flex flex-col items-center text-center p-5 md:p-6 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-500 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center mb-3 transition-transform duration-200`}
      >
        <stat.icon className="w-6 h-6" />
      </div>

      {/* Counter */}
      <div className="flex items-baseline gap-0.5">
        <span className={`text-3xl md:text-4xl font-extrabold ${stat.textColor}`}>
          {count.toLocaleString("vi-VN")}
        </span>
        <span className={`text-xl md:text-2xl font-bold ${stat.textColor}`}>
          {stat.suffix}
        </span>
      </div>

      {/* Label */}
      <p className="text-sm text-gray-500 font-medium mt-2">{stat.label}</p>
    </div>
  );
};

const StatsCounter = () => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section ref={ref} className="py-4 md:py-6">
      <div className="container">
        <div className="bg-gray-50 rounded-2xl p-5 md:p-8 border border-gray-100">
          {/* Header */}
          <div
            className={`text-center mb-6 md:mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Thương hiệu tích hợp trí tuệ nhân tạo vào thiết bị đầu tiên tại Việt Nam
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Phân phối độc quyền của Mercy tại Việt Nam
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {stats.map((stat, i) => (
              <StatItem
                key={i}
                stat={stat}
                index={i}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
