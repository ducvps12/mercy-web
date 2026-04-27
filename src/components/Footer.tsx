import { MapPin, Phone, Clock, Facebook, Instagram, Youtube, Send, CheckCircle2, ArrowRight, Video, Hash, Image } from "lucide-react";
import { useState } from "react";

const aboutLinks = [
  { name: "Giới thiệu về Mercy", href: "/about" },
  { name: "Tin tức khuyến mại", href: "/flash-sale" },
  { name: "Thông tin tuyển dụng", href: "/tuyen-dung" },
  { name: "Liên hệ hợp tác", href: "/lien-he" },
  { name: "Câu hỏi thường gặp", href: "/faq" },
];

const policyLinks = [
  { name: "Chính sách bảo hành", href: "/chinh-sach/bao-hanh" },
  { name: "Chính sách đổi trả", href: "/chinh-sach/doi-tra" },
  { name: "Chính sách bảo mật", href: "/chinh-sach/bao-mat" },
  { name: "Chính sách trả góp", href: "/chinh-sach/tra-gop" },
  { name: "Chính sách giao hàng & lắp đặt", href: "/chinh-sach/giao-hang" },
  { name: "Chính sách khách hàng thân thiết", href: "/chinh-sach/khach-hang-than-thiet" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#111317] text-[#c8cbd2] text-[13px] border-t border-gray-800">
      {/* ═══ CTA & Newsletter Strip ═══ */}
      <div className="border-b border-gray-800 bg-[#16181d]">
        <div className="container py-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-white font-bold text-base mb-1">
              Liên hệ ngay để được <span className="font-extrabold text-[#cb1c22]">tư vấn miễn phí</span>
            </h3>
            <p className="text-xs text-gray-400">
              Đội ngũ chuyên gia Mercy sẵn sàng tư vấn giải pháp kính thông minh phù hợp nhất cho bạn (Phản hồi trong 15 phút)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center shrink-0">
            <a
              href="tel:0898273899"
              className="flex items-center gap-2 bg-[#cb1c22] hover:bg-[#b0161b] text-white px-6 py-2.5 rounded-full font-bold text-lg lg:text-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Phone className="w-5 h-5 animate-pulse" />
              0898.273.899
            </a>
          </div>
        </div>
      </div>

      {/* ═══ Main Footer Content ═══ */}
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Column 1: Brand & Hotline */}
          <div>
            <h3 className="text-2xl font-black text-white mb-1 tracking-wider">MERCY</h3>
            <p className="text-[#cb1c22] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Smart Vision • Smart Life</p>

            <h4 className="font-bold text-sm text-gray-300 mb-3 uppercase tracking-wider">Kết nối với Mercy</h4>
            <div className="flex flex-wrap gap-3 mb-5">
              {[
                { name: 'Fanpage', icon: Facebook, href: 'https://www.facebook.com/kinhthongminhmercy', color: 'bg-blue-600' },
                { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/kinhthongminhmercy', color: 'bg-pink-600' },
                { name: 'TikTok', icon: Video, href: 'https://www.tiktok.com/@kinhthongminhmercy.vn', color: 'bg-gray-800' },
                { name: 'Threads', icon: Hash, href: 'https://www.threads.com/@kinhthongminhmercy', color: 'bg-gray-900' },
                { name: 'Pinterest', icon: Image, href: 'https://www.pinterest.com/mercytechglobal', color: 'bg-[#E60023]' },
                { name: 'Youtube', icon: Youtube, href: 'https://www.youtube.com/@mercyglobalstore', color: 'bg-red-600' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full ${social.color} flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all duration-300`}
                  title={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <h4 className="font-bold text-white uppercase mb-3 text-xs">Tổng đài miễn phí</h4>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 leading-tight">Tư vấn mua hàng:</p>
                <p className="font-bold text-white text-sm">0898 273 899 <span className="text-xs font-normal text-gray-500">(Mr. Hùng)</span></p>
              </div>
              <div className="flex gap-2 mt-2">
                <a href="https://zalo.me/0898273899" target="_blank" rel="noopener noreferrer" className="bg-[#0068ff] text-white px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-semibold hover:bg-blue-700 border border-blue-600">
                  <Send className="w-3.5 h-3.5" /> Zalo
                </a>
                <a href="tel:0898273899" className="bg-[#1A1C21] border border-gray-700 text-white px-3 py-1.5 rounded flex items-center gap-1.5 text-xs hover:border-gray-500">
                  <Phone className="w-3.5 h-3.5" /> Gọi điện
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: About */}
          <div>
            <h4 className="font-bold text-white uppercase mb-4 text-xs">Về chúng tôi</h4>
            <ul className="space-y-3">
              {aboutLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
              <li><div className="flex items-center gap-2 mt-4 text-gray-400"><Clock className="w-4 h-4" /> <span>9:00 – 21:30 (T2 – CN)</span></div></li>
            </ul>
          </div>

          {/* Column 3: Policy */}
          <div>
            <h4 className="font-bold text-white uppercase mb-4 text-xs">Chính sách</h4>
            <ul className="space-y-3">
              {policyLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Location & Payment */}
          <div>
            <h4 className="font-bold text-white uppercase mb-4 text-xs">Hệ thống cửa hàng</h4>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-white font-semibold text-xs mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#cb1c22]" /> CS HCM:</p>
                <p className="text-gray-400 leading-relaxed text-xs pl-5">Số 109 đường Nguyễn Thị Nhung, KĐT Vạn Phúc, Hiệp Bình Phước, TP. HCM</p>
              </div>
              <div>
                <p className="text-white font-semibold text-xs mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#cb1c22]" /> CS HN:</p>
                <p className="text-gray-400 leading-relaxed text-xs pl-5">Số 10, Đường Thanh Niên, Xã Ba Vì, Hà Nội</p>
              </div>
              <div>
                <p className="text-white font-semibold text-xs flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#cb1c22]" /> 0898 273 899 <span className="text-gray-500 font-normal">(Mr. Mạnh)</span></p>
              </div>
            </div>

            <h4 className="font-bold text-white uppercase mb-3 text-xs">Hỗ trợ thanh toán</h4>
            <div className="grid grid-cols-4 gap-2 pr-2 mb-6">
              {[
                { name: 'ACB Bank', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-ACB.png' }
              ].map((method, i) => (
                <div key={i} className="bg-white rounded border border-gray-200 h-8 flex items-center justify-center shrink-0 p-1">
                  <img src={method.logo} alt={method.name} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ═══ Footer Bottom ═══ */}
      <div className="border-t border-gray-800 bg-[#0A0A0A]">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500 font-medium">
            Copyright © 2026 Mercy Tech Global. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Powered by <span className="text-gray-300 font-semibold text-[13px]">Mr.Manhdora</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
