import { MapPin, Phone, Clock, Facebook, Instagram, Youtube, Send, CheckCircle2, ArrowRight } from "lucide-react";
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
      <div className="border-b border-gray-800">
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
            <form onSubmit={handleSubscribe} className="flex w-full sm:w-auto gap-2 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email ưu đãi..."
                className="w-[220px] px-3 py-2 rounded bg-[#1A1C21] border border-gray-700 text-white placeholder:text-gray-500 text-xs outline-none focus:border-red-500 transition-all"
              />
              <button
                type="submit"
                className="bg-[#cb1c22] hover:bg-[#b0161b] text-white px-4 py-2 rounded font-semibold text-xs transition-colors"
              >
                Đăng ký
              </button>
              {subscribed && <span className="text-emerald-400 text-xs font-medium absolute top-full left-0 mt-1">✓ Thành công!</span>}
            </form>
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
            <div className="flex gap-3 mb-5">
              <a href="#" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all duration-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

            <h4 className="font-bold text-white uppercase mb-3 text-xs">Tổng đài miễn phí</h4>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 leading-tight">Tư vấn mua hàng:</p>
                <p className="font-bold text-white text-sm">0763 068 614 <span className="text-xs font-normal text-gray-500">(Mr. Hùng)</span></p>
              </div>
              <div className="flex gap-2 mt-2">
                <a href="https://zalo.me/0763068614" target="_blank" rel="noopener noreferrer" className="bg-[#0068ff] text-white px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-semibold hover:bg-blue-700 border border-blue-600">
                  <Send className="w-3.5 h-3.5" /> Zalo
                </a>
                <a href="tel:0763068614" className="bg-[#1A1C21] border border-gray-700 text-white px-3 py-1.5 rounded flex items-center gap-1.5 text-xs hover:border-gray-500">
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
                <p className="text-white font-semibold text-xs flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#cb1c22]" /> 0398 684 921 <span className="text-gray-500 font-normal">(Mr. Mạnh)</span></p>
              </div>
            </div>

            <h4 className="font-bold text-white uppercase mb-3 text-xs">Hỗ trợ thanh toán</h4>
            <div className="grid grid-cols-4 gap-2 pr-2 mb-6">
              {[
                { name: 'MasterCard', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png' },
                { name: 'JCB', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/JCB_logo.svg/200px-JCB_logo.svg.png' },
                { name: 'Amex', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/200px-American_Express_logo_%282018%29.svg.png' },
                { name: 'Apple Pay', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/200px-Apple_Pay_logo.svg.png' },
                { name: 'Google Pay', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/200px-Google_Pay_Logo.svg.png' }
              ].map((method, i) => (
                <div key={i} className="bg-white rounded border border-gray-200 h-8 flex items-center justify-center shrink-0 p-1">
                  <img src={method.logo} alt={method.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
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
