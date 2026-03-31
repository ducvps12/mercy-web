import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Shield, Truck, RefreshCw, Headphones } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Độc quyền tại Việt Nam",
    desc: "Phiên bản tiếng Việt cho người Việt",
  },
  {
    icon: Truck,
    title: "Miễn phí vận chuyển",
    desc: "Toàn quốc",
  },
  {
    icon: RefreshCw,
    title: "Đổi trả hoàn tiền",
    desc: "Chính hãng",
  },
  {
    icon: Headphones,
    title: "24/7 Hỗ trợ",
    desc: "Luôn hỗ trợ khi bạn cần",
  },
];

const FeaturesBar = () => {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <section ref={ref} className="bg-mercy-warm-bg border-y border-border">
      <div className="container py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 md:gap-4 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-primary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm md:text-base leading-tight">{feature.title}</h4>
                <p className="text-muted-foreground text-xs md:text-sm mt-0.5">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
