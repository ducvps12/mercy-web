import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { Briefcase, Handshake, HelpCircle, MapPin, Phone, Mail, Clock, Users, Star, ChevronRight, CheckCircle, Heart, Target, Award, Zap } from "lucide-react";
import { makeSiteUrl } from "@/lib/config";

interface InfoSection {
  title: string;
  content: string[];
}

interface CompanyInfoData {
  title: string;
  icon: typeof Briefcase;
  desc: string;
  sections: InfoSection[];
}

const companyInfoData: Record<string, CompanyInfoData> = {
  "tuyen-dung": {
    title: "Thông tin tuyển dụng",
    icon: Briefcase,
    desc: "Gia nhập đội ngũ Mercy – Nơi bạn được phát triển và tỏa sáng",
    sections: [
      {
        title: "1. Về môi trường làm việc tại Mercy",
        content: [
          "Mercy là một doanh nghiệp trẻ, năng động trong lĩnh vực công nghệ đeo thông minh (Wearable Technology) tại Việt Nam. Chúng tôi luôn đề cao sự sáng tạo, tinh thần chủ động và khả năng tự học hỏi của mỗi thành viên.",
          "Tại Mercy, bạn sẽ được làm việc với những sản phẩm công nghệ tiên phong, được thử sức với nhiều dự án thú vị và có cơ hội phát triển bản thân không giới hạn.",
          "Môi trường làm việc mở, thoải mái, không gò bó – nơi ý tưởng được lắng nghe và đóng góp của bạn luôn được ghi nhận.",
          "Đội ngũ hiện tại gồm những bạn trẻ đam mê công nghệ, marketing, content và kinh doanh – tất cả cùng hướng đến mục tiêu chung: mang công nghệ thông minh đến gần hơn với mọi người.",
        ],
      },
      {
        title: "2. Quyền lợi khi làm việc tại Mercy",
        content: [
          "Mức lương cạnh tranh theo năng lực và kinh nghiệm, thưởng theo KPI hàng tháng/quý.",
          "Được trang bị sản phẩm công nghệ Mercy để sử dụng và trải nghiệm.",
          "Cơ hội đào tạo nâng cao kỹ năng chuyên môn, tham gia các khóa học về AI, Marketing, E-commerce.",
          "Lộ trình thăng tiến rõ ràng: Nhân viên → Trưởng nhóm → Quản lý → Giám đốc bộ phận.",
          "Được tham gia các sự kiện ra mắt sản phẩm, hội chợ công nghệ, team building.",
          "Chế độ bảo hiểm xã hội, bảo hiểm y tế, nghỉ phép theo quy định Nhà nước.",
          "Thưởng lễ, Tết, thưởng hiệu suất, thưởng sáng kiến.",
          "Giờ làm việc linh hoạt, hỗ trợ làm việc từ xa (remote) cho một số vị trí.",
        ],
      },
      {
        title: "3. Các vị trí đang tuyển dụng",
        content: [
          "📌 Nhân viên Marketing Online (Full-time/Part-time): Chạy quảng cáo Facebook, TikTok, Google Ads. Yêu cầu: Có kinh nghiệm chạy ads, hiểu biết về digital marketing.",
          "📌 Content Creator / Video Editor: Sáng tạo nội dung video review sản phẩm, TikTok, Reels. Yêu cầu: Có khả năng quay dựng video, sử dụng CapCut/Premiere/After Effects.",
          "📌 Nhân viên Kinh doanh / Bán hàng Online: Tư vấn sản phẩm qua Fanpage, Zalo, Shopee, TikTok Shop. Yêu cầu: Giao tiếp tốt, đam mê công nghệ, chịu được áp lực doanh số.",
          "📌 Nhân viên Chăm sóc Khách hàng: Hỗ trợ khách hàng sau bán hàng, xử lý bảo hành, đổi trả. Yêu cầu: Kiên nhẫn, có tinh thần trách nhiệm cao.",
          "📌 Cộng tác viên bán hàng (Affiliate): Giới thiệu sản phẩm Mercy và nhận hoa hồng theo đơn hàng. Không yêu cầu kinh nghiệm, có hướng dẫn chi tiết.",
          "📌 Thực tập sinh Marketing / E-commerce: Dành cho sinh viên năm 3-4 muốn tích lũy kinh nghiệm thực tế. Có cơ hội nhận việc chính thức sau thực tập.",
        ],
      },
      {
        title: "4. Yêu cầu chung",
        content: [
          "Đam mê công nghệ, yêu thích sản phẩm kính thông minh và thiết bị đeo.",
          "Tinh thần học hỏi, sẵn sàng đón nhận thử thách mới.",
          "Làm việc chủ động, có khả năng quản lý thời gian hiệu quả.",
          "Trung thực, có tinh thần đồng đội và trách nhiệm với công việc.",
          "Ưu tiên ứng viên có kinh nghiệm trong lĩnh vực E-commerce, Công nghệ, Marketing Digital.",
        ],
      },
      {
        title: "5. Cách ứng tuyển",
        content: [
          "Gửi CV (hồ sơ cá nhân) qua email: mercytechglobal@gmail.com",
          "Tiêu đề email: [Ứng tuyển] – Họ tên – Vị trí ứng tuyển",
          "Hoặc liên hệ trực tiếp qua Hotline: 0898 273 899",
          "Nhắn tin qua Fanpage Facebook: Mercy – Kính Thông Minh",
          "Thời gian phản hồi: Mercy sẽ liên hệ lại trong vòng 3–5 ngày làm việc sau khi nhận CV.",
          "Lưu ý: Chúng tôi không thu bất kỳ khoản phí nào từ ứng viên trong quá trình tuyển dụng.",
        ],
      },
      {
        title: "6. Địa điểm làm việc",
        content: [
          "🏢 Văn phòng HCM: Số 109 đường Nguyễn Thị Nhung, KĐT Vạn Phúc, Hiệp Bình Phước, TP. HCM",
          "🏢 Văn phòng Hà Nội: Số 10, Đường Thanh Niên, Xã Ba Vì, Hà Nội",
          "Một số vị trí hỗ trợ làm việc remote toàn phần hoặc hybrid (kết hợp online + offline).",
        ],
      },
    ],
  },
  "lien-he-hop-tac": {
    title: "Liên hệ hợp tác",
    icon: Handshake,
    desc: "Cùng Mercy mang công nghệ thông minh đến gần hơn với mọi người",
    sections: [
      {
        title: "1. Các hình thức hợp tác",
        content: [
          "🤝 Đại lý phân phối: Trở thành đại lý chính thức của Mercy, nhận chiết khấu hấp dẫn, hỗ trợ marketing và đào tạo sản phẩm.",
          "📱 Affiliate (Cộng tác viên bán hàng): Chia sẻ link giới thiệu sản phẩm và nhận hoa hồng từ 5–12% cho mỗi đơn hàng thành công. Không cần vốn, không cần kho hàng.",
          "🎬 KOL / Influencer / Content Creator: Hợp tác review sản phẩm, tạo content trên TikTok, YouTube, Facebook, Instagram. Nhận sản phẩm trải nghiệm + thù lao theo thỏa thuận.",
          "🏢 Doanh nghiệp / Tổ chức: Cung cấp kính thông minh cho doanh nghiệp, tổ chức sự kiện, quà tặng doanh nghiệp với giá ưu đãi đặc biệt.",
          "🎓 Trường học / Trung tâm đào tạo: Hợp tác cung cấp thiết bị học tập thông minh, ứng dụng AI trong giáo dục.",
          "🌐 Dropship: Bạn bán hàng, Mercy lo kho và ship. Chiết khấu hấp dẫn, hỗ trợ hình ảnh và content.",
        ],
      },
      {
        title: "2. Quyền lợi đối tác đại lý",
        content: [
          "Chiết khấu lên đến 25% trên giá bán lẻ (tùy quy mô và doanh số).",
          "Được cung cấp sản phẩm trải nghiệm và bộ tài liệu bán hàng chuyên nghiệp.",
          "Được đào tạo kiến thức sản phẩm, kỹ năng tư vấn bán hàng.",
          "Hỗ trợ marketing: hình ảnh, video, content sẵn sàng sử dụng.",
          "Được ưu tiên nhập hàng mới, hàng Flash Sale trước công chúng.",
          "Hỗ trợ đổi trả hàng lỗi nhanh chóng, bảo hành đầy đủ cho khách hàng cuối.",
          "Có chính sách thưởng doanh số hàng tháng/quý.",
        ],
      },
      {
        title: "3. Quyền lợi Affiliate (Cộng tác viên)",
        content: [
          "Hoa hồng từ 5–12% cho mỗi đơn hàng thành công thông qua link/mã giới thiệu.",
          "Không cần vốn, không cần nhập hàng – chỉ cần chia sẻ và kiếm tiền.",
          "Dashboard quản lý đơn hàng và hoa hồng minh bạch, cập nhật realtime.",
          "Hỗ trợ content, hình ảnh, video sẵn sàng để đăng bài.",
          "Thanh toán hoa hồng hàng tuần/tháng qua chuyển khoản ngân hàng hoặc ví điện tử.",
          "Thưởng thêm khi đạt mốc doanh số: 5 đơn/tháng → bonus 200.000đ, 10 đơn/tháng → bonus 500.000đ.",
        ],
      },
      {
        title: "4. Quyền lợi KOL / Influencer",
        content: [
          "Nhận sản phẩm kính thông minh miễn phí để trải nghiệm và review.",
          "Thù lao review theo thỏa thuận (tùy thuộc vào quy mô kênh và engagement).",
          "Được tham gia các sự kiện ra mắt sản phẩm độc quyền.",
          "Cơ hội trở thành Brand Ambassador chính thức của Mercy.",
          "Hỗ trợ quảng bá kênh/trang cá nhân thông qua kênh truyền thông của Mercy.",
        ],
      },
      {
        title: "5. Quy trình đăng ký hợp tác",
        content: [
          "Bước 1: Liên hệ qua email mercytechglobal@gmail.com hoặc Hotline 0898 273 899.",
          "Bước 2: Gửi thông tin cá nhân/doanh nghiệp và hình thức hợp tác mong muốn.",
          "Bước 3: Mercy đánh giá và phản hồi trong vòng 2–3 ngày làm việc.",
          "Bước 4: Ký kết thỏa thuận hợp tác (nếu cần) và bắt đầu triển khai.",
          "Bước 5: Mercy hỗ trợ đào tạo sản phẩm, cung cấp tài liệu và bắt đầu hợp tác.",
        ],
      },
      {
        title: "6. Thông tin liên hệ hợp tác",
        content: [
          "📧 Email hợp tác: mercytechglobal@gmail.com",
          "📞 Hotline: 0898 273 899 – Tư vấn hợp tác đại lý/affiliate",
          "📞 Hotline: 0898 273 899 – Hợp tác KOL/doanh nghiệp",
          "💬 Zalo/Fanpage: Mercy – Kính Thông Minh",
          "🏢 VP HCM: Số 109 đường Nguyễn Thị Nhung, KĐT Vạn Phúc, Hiệp Bình Phước, TP. HCM",
          "🏢 VP Hà Nội: Số 10, Đường Thanh Niên, Xã Ba Vì, Hà Nội",
          "⏰ Thời gian làm việc: 9:00 – 21:30 (Thứ 2 – Chủ Nhật)",
        ],
      },
    ],
  },
  "cau-hoi-thuong-gap": {
    title: "Câu hỏi thường gặp (FAQ)",
    icon: HelpCircle,
    desc: "Giải đáp mọi thắc mắc về sản phẩm và dịch vụ của Mercy",
    sections: [
      {
        title: "1. Về sản phẩm kính thông minh",
        content: [
          "❓ Kính thông minh Mercy có thể thay tròng kính cận được không?\n→ Có. Tất cả kính Mercy đều hỗ trợ thay tròng kính cận, viễn, loạn theo nhu cầu. Bạn có thể thay tại bất kỳ cửa hàng kính nào.",
          "❓ Kính thông minh Mercy có chống nước không?\n→ Có. Kính Mercy đạt tiêu chuẩn chống nước IP65, có thể chịu được mồ hôi và nước mưa nhẹ. Tuy nhiên không nên ngâm nước hoặc sử dụng dưới nước.",
          "❓ Pin kính thông minh dùng được bao lâu?\n→ Pin 270mAh, thời lượng sử dụng từ 6–12 giờ tùy chế độ sử dụng (nghe nhạc, quay video, trợ lý AI...).",
          "❓ Kính quay video được bao lâu một lần?\n→ Mỗi lần quay tối đa 12 phút liên tục cho video 2K POV. Sau đó có thể quay tiếp nếu pin còn.",
          "❓ Kính có nặng không? Đeo lâu có mỏi không?\n→ Kính chỉ nặng 35g, nhẹ hơn nhiều so với kính thông thường. Thiết kế ergonomic, đeo cả ngày không mỏi.",
          "❓ Khác biệt giữa MCK 5.0 và MCK 5.1 là gì?\n→ MCK 5.1 là phiên bản cao cấp hơn, có tùy chọn tròng đổi màu (photochromic) tự động điều chỉnh sáng/tối theo môi trường và tròng râm chống UV.",
          "❓ Trợ lý AI hoạt động như thế nào?\n→ Trợ lý AI tích hợp sẵn, hỗ trợ điều khiển giọng nói tiếng Việt, tra cứu thông tin, dịch thuật realtime với độ trễ chỉ 0,5 giây.",
        ],
      },
      {
        title: "2. Về đặt hàng và thanh toán",
        content: [
          "❓ Đặt hàng trên website có an toàn không?\n→ Hoàn toàn an toàn. Website sử dụng mã hóa SSL/TLS, thông tin cá nhân được bảo mật tuyệt đối.",
          "❓ Mercy có những phương thức thanh toán nào?\n→ Chuyển khoản ngân hàng, VISA/MasterCard, Momo, ZaloPay, COD (thanh toán khi nhận hàng).",
          "❓ Tôi có thể trả góp 0% được không?\n→ Có. Mercy hỗ trợ trả góp 0% qua thẻ tín dụng của các ngân hàng đối tác. Kỳ hạn 3–12 tháng.",
          "❓ Sau khi đặt hàng, bao lâu tôi nhận được hàng?\n→ Nội thành HCM/HN: 1–2 ngày. Các tỉnh khác: 2–4 ngày. Vùng sâu vùng xa: 4–7 ngày.",
          "❓ Tôi có thể kiểm tra hàng trước khi thanh toán COD không?\n→ Có. Bạn được kiểm tra sản phẩm bên ngoài trước khi thanh toán cho shipper.",
          "❓ Đơn hàng tối thiểu bao nhiêu mới được miễn phí giao hàng?\n→ Đơn hàng từ 2.000.000đ trở lên được miễn phí giao hàng toàn quốc.",
        ],
      },
      {
        title: "3. Về bảo hành và đổi trả",
        content: [
          "❓ Kính thông minh Mercy được bảo hành bao lâu?\n→ Bảo hành mặc định 15 ngày. Có thể mua thêm gói bảo hành mở rộng: 3 tháng (+550k), 6 tháng (+650k), 12 tháng (+900k).",
          "❓ Nếu kính bị lỗi, tôi phải làm gì?\n→ Liên hệ Hotline 0898 273 899 hoặc nhắn Zalo/Fanpage. Mô tả lỗi, gửi ảnh/video minh chứng. Mercy sẽ hướng dẫn gửi hàng về trung tâm bảo hành.",
          "❓ Tôi có thể đổi trả sản phẩm trong bao lâu?\n→ Đổi sản phẩm mới trong 7 ngày. Hoàn tiền trong 3 ngày (nếu lỗi nhà sản xuất). Sau thời gian trên áp dụng chính sách bảo hành.",
          "❓ Phí gửi hàng bảo hành do ai chịu?\n→ Mercy hỗ trợ phí ship 1 chiều (gửi trả sản phẩm đã sửa về cho khách hàng).",
          "❓ Tôi làm rơi kính bị hỏng thì có được bảo hành không?\n→ Không. Hư hỏng do tác động vật lý (rơi, va đập, ngấm nước) không thuộc diện bảo hành. Mercy có thể hỗ trợ sửa chữa với phí linh kiện.",
        ],
      },
      {
        title: "4. Về Robot AI BabyThree",
        content: [
          "❓ Robot BabyThree có cần kết nối WiFi không?\n→ Có. BabyThree cần kết nối WiFi để sử dụng tính năng AI trò chuyện và dịch thuật.",
          "❓ BabyThree hỗ trợ bao nhiêu ngôn ngữ?\n→ Hỗ trợ hơn 40 ngôn ngữ trên toàn thế giới, bao gồm Tiếng Việt, Anh, Trung, Nhật, Hàn, Pháp...",
          "❓ BabyThree có thể dùng làm quà tặng được không?\n→ Hoàn toàn phù hợp! BabyThree là monquà tặng công nghệ ý nghĩa cho trẻ em, bạn bè, người thân.",
          "❓ Pin BabyThree dùng được bao lâu?\n→ Pin lithium tích hợp, sử dụng liên tục khoảng 4–6 giờ, sạc qua cổng USB-C.",
        ],
      },
      {
        title: "5. Về tài khoản và ưu đãi",
        content: [
          "❓ Làm sao để đăng ký tài khoản Mercy?\n→ Truy cập website kinhthongminhmercy.vn, click \"Đăng ký\" và điền thông tin. Hoặc đăng nhập nhanh bằng tài khoản Google.",
          "❓ Tôi quên mật khẩu thì làm sao?\n→ Vào trang Đăng nhập → Click \"Quên mật khẩu\" → Nhập email → Nhận link đặt lại mật khẩu.",
          "❓ Chương trình khách hàng thân thiết hoạt động như thế nào?\n→ Mỗi 10.000đ chi tiêu tích 1 điểm Mercy. Tích đủ điểm đổi voucher giảm giá. 3 cấp bậc: Bạc → Vàng → Kim Cương với ưu đãi tăng dần.",
          "❓ Tôi giới thiệu bạn bè mua hàng có được thưởng không?\n→ Có! Chương trình Referral: bạn nhận voucher 100.000đ cho mỗi khách hàng mới giới thiệu thành công.",
          "❓ Mercy có chương trình khuyến mãi thường xuyên không?\n→ Có. Flash Sale hàng ngày, khuyến mãi theo dịp lễ, ưu đãi đặc biệt cho thành viên. Đăng ký nhận tin để không bỏ lỡ!",
        ],
      },
      {
        title: "6. Liên hệ hỗ trợ",
        content: [
          "Nếu bạn không tìm thấy câu trả lời cho thắc mắc của mình, vui lòng liên hệ:",
          "📞 Hotline tư vấn: 0898 273 899",
          "📞 Hotline kỹ thuật: 0898 273 899",
          "📧 Email: mercytechglobal@gmail.com",
          "💬 Fanpage Facebook: Mercy – Kính Thông Minh",
          "⏰ Thời gian hỗ trợ: 9:00 – 21:30 (Thứ 2 – Chủ nhật)",
        ],
      },
    ],
  },
};

const CompanyInfo = () => {
  const { slug } = useParams<{ slug: string }>();
  const info = slug ? companyInfoData[slug] : null;

  if (!info) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy trang</h1>
          <p className="text-gray-500 mb-8">Trang bạn tìm không tồn tại.</p>
          <a href="/" className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
            Về trang chủ
          </a>
        </main>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  const Icon = info.icon;

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead
        title={info.title}
        description={info.desc}
        canonical={makeSiteUrl(`/ve-chung-toi/${slug}`)}
      />
      <Header />

      <main>
        {/* Hero Banner */}
        <section className="relative bg-[#1d2939] text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1d2939] via-[#2d3a4a] to-[#0f1923]" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-500 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-orange-500 rounded-full blur-[100px]" />
          </div>
          <div className="relative container mx-auto px-4 py-16 md:py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20">
              <Icon className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              {info.title}
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {info.desc}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {info.sections.map((section, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 hover:shadow-md transition-shadow duration-300"
                >
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-extrabold shrink-0">
                      {i + 1}
                    </span>
                    {section.title.replace(/^\d+\.\s*/, "")}
                  </h2>
                  <ul className="space-y-3">
                    {section.content.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-[15px] text-gray-600 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 shrink-0" />
                        <span className="whitespace-pre-line">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* CTA */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Bạn cần hỗ trợ thêm?</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Liên hệ với chúng tôi để được tư vấn và giải đáp mọi thắc mắc
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="tel:0898273899"
                    className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors active:scale-95"
                  >
                    📞 Gọi: 0898 273 899
                  </a>
                  <a
                    href="mailto:mercytechglobal@gmail.com"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    ✉️ Email liên hệ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default CompanyInfo;
