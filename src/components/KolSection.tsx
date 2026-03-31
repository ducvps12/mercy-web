import kolBanner from "@/assets/kol-banner.jpg";

const KolSection = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
          <img
            src={kolBanner}
            alt="KOLs & KOCs - Đồng hành thương hiệu"
            className="w-full h-[250px] md:h-[350px] object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            width={1200}
            height={600}
          />
          <div className="absolute inset-0 bg-mercy-dark/60 flex flex-col items-center justify-center text-center p-6">
            <p className="text-primary font-medium text-sm mb-2 tracking-widest uppercase">Đồng hành thương hiệu</p>
            <h3 className="text-primary-foreground text-3xl md:text-4xl font-extrabold mb-4">
              KOLs & KOCs
            </h3>
            <a
              href="#"
              className="inline-block bg-primary hover:bg-mercy-orange-light text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Tham gia ngay!
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KolSection;
