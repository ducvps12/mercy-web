import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { Shield, RotateCcw, Lock, CreditCard, Truck, Heart } from "lucide-react";

interface PolicySection {
  title: string;
  content: string[];
}

interface PolicyInfo {
  title: string;
  icon: typeof Shield;
  desc: string;
  sections: PolicySection[];
}

const policiesData: Record<string, PolicyInfo> = {
  "bao-hanh": {
    title: "Chính sách bảo hành",
    icon: Shield,
    desc: "Cam kết bảo hành sản phẩm chất lượng, uy tín tại Mercy",
    sections: [
      {
        title: "1. Thời gian bảo hành",
        content: [
          "Bảo hành mặc định: 15 ngày kể từ ngày mua hàng.",
          "Gói bảo hành mở rộng 3 tháng: +550.000đ",
          "Gói bảo hành mở rộng 6 tháng: +650.000đ",
          "Gói bảo hành mở rộng 12 tháng: +900.000đ",
          "Thời hạn bảo hành được tính từ ngày khách hàng nhận sản phẩm (theo phiếu bảo hành hoặc hóa đơn mua hàng).",
        ],
      },
      {
        title: "2. Điều kiện bảo hành",
        content: [
          "Sản phẩm được mua trực tiếp từ Mercy hoặc các đại lý ủy quyền.",
          "Sản phẩm còn trong thời hạn bảo hành và còn nguyên tem bảo hành (nếu có).",
          "Lỗi do nhà sản xuất: lỗi phần cứng, lỗi phần mềm hệ thống, lỗi linh kiện.",
          "Sản phẩm phải được sử dụng đúng mục đích và theo hướng dẫn sử dụng đi kèm.",
        ],
      },
      {
        title: "3. Trường hợp không được bảo hành",
        content: [
          "Sản phẩm bị hư hỏng do tác động vật lý: rơi, vỡ, va đập, cong vênh, nứt.",
          "Sản phẩm bị hư hỏng do nước, hóa chất, nhiệt độ cao.",
          "Sản phẩm đã bị sửa chữa, thay đổi linh kiện bởi bên thứ ba không được Mercy ủy quyền.",
          "Sản phẩm hết thời hạn bảo hành.",
          "Không có phiếu bảo hành hoặc hóa đơn mua hàng hợp lệ.",
          "Các phụ kiện đi kèm ngoài cam kết (cáp, sạc, hộp...).",
        ],
      },
      {
        title: "4. Quy trình bảo hành",
        content: [
          "Bước 1: Liên hệ tổng đài Mercy qua Hotline 0763 068 614 hoặc Fanpage/Zalo chính thức.",
          "Bước 2: Mô tả tình trạng lỗi và gửi hình ảnh/video (nếu có).",
          "Bước 3: Gửi sản phẩm về trung tâm bảo hành (Mercy hỗ trợ phí ship 1 chiều).",
          "Bước 4: Kiểm tra và xử lý trong vòng 3–7 ngày làm việc.",
          "Bước 5: Gửi trả sản phẩm đã sửa chữa về cho khách hàng.",
        ],
      },
      {
        title: "5. Liên hệ bảo hành",
        content: [
          "Hotline: 0763 068 614 (Mr. Hùng)",
          "Email: Kinhthongminh.mercy@gmail.com",
          "Thời gian hỗ trợ: 9:00 – 21:30 (T2 – CN)",
        ],
      },
    ],
  },
  "doi-tra": {
    title: "Chính sách đổi trả",
    icon: RotateCcw,
    desc: "Đổi trả linh hoạt, đảm bảo quyền lợi khách hàng",
    sections: [
      {
        title: "1. Điều kiện đổi trả",
        content: [
          "Sản phẩm còn nguyên vẹn, chưa qua sử dụng hoặc sử dụng dưới 3 ngày kể từ ngày nhận hàng.",
          "Sản phẩm bị lỗi từ nhà sản xuất (lỗi kỹ thuật, linh kiện).",
          "Sản phẩm giao sai mẫu, sai màu, sai cấu hình so với đơn hàng.",
          "Sản phẩm còn đầy đủ phụ kiện đi kèm, hộp, phiếu bảo hành và hóa đơn.",
        ],
      },
      {
        title: "2. Thời gian đổi trả",
        content: [
          "Đổi sản phẩm mới: Trong vòng 7 ngày kể từ ngày nhận hàng.",
          "Hoàn tiền: Trong vòng 3 ngày kể từ ngày nhận hàng (áp dụng khi sản phẩm bị lỗi từ nhà sản xuất).",
          "Sau thời gian trên, sản phẩm sẽ được áp dụng chính sách bảo hành.",
        ],
      },
      {
        title: "3. Trường hợp không áp dụng đổi trả",
        content: [
          "Sản phẩm bị hư hỏng do người dùng: rơi, vỡ, va đập, ngấm nước.",
          "Sản phẩm đã bị thay đổi, sửa chữa bởi bên thứ ba.",
          "Sản phẩm không còn đầy đủ phụ kiện, tem niêm phong bị mất.",
          "Sản phẩm mua trong chương trình Flash Sale, khuyến mãi đặc biệt (có ghi rõ không áp dụng đổi trả).",
        ],
      },
      {
        title: "4. Quy trình đổi trả",
        content: [
          "Bước 1: Liên hệ Hotline 0763 068 614 hoặc nhắn tin qua Fanpage/Zalo.",
          "Bước 2: Cung cấp thông tin đơn hàng, mô tả lý do đổi trả và gửi hình ảnh minh chứng.",
          "Bước 3: Mercy xác nhận yêu cầu đổi trả trong vòng 24h.",
          "Bước 4: Gửi sản phẩm về địa chỉ được hướng dẫn (Mercy hỗ trợ phí ship 1 chiều).",
          "Bước 5: Nhận sản phẩm mới hoặc hoàn tiền trong vòng 3–5 ngày làm việc.",
        ],
      },
      {
        title: "5. Phương thức hoàn tiền",
        content: [
          "Hoàn tiền qua chuyển khoản ngân hàng.",
          "Hoàn tiền qua ví điện tử (Momo, ZaloPay).",
          "Thời gian hoàn tiền: 1–3 ngày làm việc sau khi Mercy nhận được sản phẩm trả lại.",
        ],
      },
    ],
  },
  "bao-mat": {
    title: "Chính sách bảo mật",
    icon: Lock,
    desc: "Cam kết bảo vệ thông tin cá nhân của khách hàng",
    sections: [
      {
        title: "1. Thông tin thu thập",
        content: [
          "Họ tên, số điện thoại, email, địa chỉ khi bạn đặt hàng hoặc đăng ký tài khoản.",
          "Thông tin thanh toán (không bao gồm mật khẩu ngân hàng, mã CVV).",
          "Dữ liệu truy cập website: IP, trình duyệt, thời gian truy cập (phục vụ cải thiện trải nghiệm).",
        ],
      },
      {
        title: "2. Mục đích sử dụng thông tin",
        content: [
          "Xử lý đơn hàng, giao hàng đúng địa chỉ.",
          "Liên hệ hỗ trợ sau bán hàng, bảo hành.",
          "Gửi thông tin khuyến mãi, ưu đãi mới (nếu khách hàng đồng ý nhận).",
          "Cải thiện dịch vụ và trải nghiệm khách hàng trên website.",
        ],
      },
      {
        title: "3. Cam kết bảo mật",
        content: [
          "Mercy cam kết tuyệt đối không bán, chia sẻ, trao đổi thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào không liên quan.",
          "Mọi thông tin giao dịch được mã hóa và bảo vệ theo tiêu chuẩn bảo mật hiện đại (SSL/TLS).",
          "Chỉ nhân viên được ủy quyền mới có quyền truy cập dữ liệu khách hàng, và phải tuân thủ quy định bảo mật nội bộ.",
        ],
      },
      {
        title: "4. Quyền của khách hàng",
        content: [
          "Yêu cầu truy cập, chỉnh sửa thông tin cá nhân bất cứ lúc nào.",
          "Yêu cầu xóa tài khoản và dữ liệu cá nhân khỏi hệ thống.",
          "Từ chối nhận email/tin nhắn quảng cáo.",
        ],
      },
      {
        title: "5. Cookie và tracking",
        content: [
          "Website sử dụng cookie để ghi nhớ tùy chọn người dùng và cải thiện trải nghiệm.",
          "Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên một số tính năng có thể bị ảnh hưởng.",
        ],
      },
    ],
  },
  "tra-gop": {
    title: "Chính sách trả góp",
    icon: CreditCard,
    desc: "Trả góp 0% lãi suất – Mua ngay, trả sau dễ dàng",
    sections: [
      {
        title: "1. Điều kiện trả góp",
        content: [
          "Khách hàng từ 18 tuổi trở lên, có CCCD/CMND hợp lệ.",
          "Áp dụng cho tất cả sản phẩm kính thông minh Mercy từ 2.000.000đ trở lên.",
          "Trả góp qua thẻ tín dụng: VISA, Mastercard, JCB (của các ngân hàng đối tác).",
          "Trả góp qua ví điện tử: Momo, ZaloPay (theo chương trình từng thời điểm).",
        ],
      },
      {
        title: "2. Kỳ hạn trả góp",
        content: [
          "3 tháng – Lãi suất 0%",
          "6 tháng – Lãi suất 0%",
          "12 tháng – Lãi suất 0% (áp dụng một số sản phẩm/ngân hàng)",
          "Kỳ hạn cụ thể tùy thuộc vào ngân hàng phát hành thẻ và chương trình khuyến mãi hiện hành.",
        ],
      },
      {
        title: "3. Quy trình đăng ký trả góp",
        content: [
          "Bước 1: Chọn sản phẩm và phương thức thanh toán 'Trả góp 0%' khi đặt hàng.",
          "Bước 2: Cung cấp thông tin thẻ tín dụng hoặc chọn đối tác trả góp.",
          "Bước 3: Xác nhận kỳ hạn trả góp.",
          "Bước 4: Hoàn tất đặt hàng – Mercy xử lý và giao hàng trong 1–3 ngày.",
        ],
      },
      {
        title: "4. Ngân hàng đối tác",
        content: [
          "Vietcombank, Techcombank, VPBank, TPBank, Sacombank, MB Bank, ACB, BIDV, Agribank, VIB, SHB, HDBank, và nhiều ngân hàng khác.",
          "Danh sách ngân hàng hỗ trợ có thể thay đổi theo từng chương trình.",
        ],
      },
      {
        title: "5. Lưu ý",
        content: [
          "Lãi suất 0% chỉ áp dụng khi khách hàng thanh toán đúng hạn hàng tháng.",
          "Phí chuyển đổi trả góp (nếu có) do ngân hàng quy định, không phải Mercy thu.",
          "Liên hệ Hotline 0763 068 614 để được tư vấn chi tiết.",
        ],
      },
    ],
  },
  "giao-hang": {
    title: "Chính sách giao hàng & lắp đặt",
    icon: Truck,
    desc: "Giao hàng nhanh chóng, tận nơi trên toàn quốc",
    sections: [
      {
        title: "1. Phạm vi giao hàng",
        content: [
          "Mercy giao hàng trên toàn quốc qua các đơn vị vận chuyển uy tín: Giao Hàng Nhanh (GHN), Giao Hàng Tiết Kiệm (GHTK), J&T Express, Viettel Post.",
          "Hỗ trợ giao hàng quốc tế theo yêu cầu (liên hệ trực tiếp).",
        ],
      },
      {
        title: "2. Thời gian giao hàng",
        content: [
          "Nội thành TP. HCM, Hà Nội: 1–2 ngày làm việc.",
          "Các tỉnh thành khác: 2–4 ngày làm việc.",
          "Vùng sâu, vùng xa: 4–7 ngày làm việc.",
          "Đơn hàng được xử lý và chuyển giao vận chuyển trong vòng 24h sau khi xác nhận.",
        ],
      },
      {
        title: "3. Phí giao hàng",
        content: [
          "MIỄN PHÍ giao hàng cho đơn hàng từ 2.000.000đ trở lên.",
          "Đơn hàng dưới 2.000.000đ: Phí giao hàng từ 20.000đ – 50.000đ tùy khu vực.",
          "Giao hàng COD (thanh toán khi nhận hàng): Miễn phí phụ thu COD.",
        ],
      },
      {
        title: "4. Hỗ trợ lắp đặt & hướng dẫn sử dụng",
        content: [
          "Kính thông minh Mercy được hướng dẫn sử dụng chi tiết qua video và tài liệu kèm theo.",
          "Hỗ trợ cài đặt app, kết nối Bluetooth, hướng dẫn sử dụng trợ lý AI qua điện thoại/Zalo.",
          "Đội ngũ kỹ thuật viên sẵn sàng hỗ trợ từ xa 24/7 qua Hotline 0763 068 614.",
        ],
      },
      {
        title: "5. Kiểm tra đơn hàng",
        content: [
          "Sau khi đặt hàng, khách hàng nhận mã vận đơn qua SMS/Zalo để theo dõi tình trạng giao hàng.",
          "Kiểm tra hàng trước khi thanh toán COD. Nếu sản phẩm có dấu hiệu bị hư hỏng trong quá trình vận chuyển, vui lòng từ chối nhận và liên hệ Mercy ngay.",
        ],
      },
    ],
  },
  "khach-hang-than-thiet": {
    title: "Chính sách khách hàng thân thiết",
    icon: Heart,
    desc: "Tri ân khách hàng – Ưu đãi đặc quyền dành riêng cho bạn",
    sections: [
      {
        title: "1. Cấp bậc thành viên",
        content: [
          "🥉 Thành viên Bạc (Silver): Đăng ký tài khoản và mua hàng lần đầu.",
          "🥇 Thành viên Vàng (Gold): Tổng chi tiêu từ 5.000.000đ trở lên.",
          "💎 Thành viên Kim Cương (Diamond): Tổng chi tiêu từ 15.000.000đ trở lên hoặc mua từ 3 sản phẩm trở lên.",
        ],
      },
      {
        title: "2. Quyền lợi theo cấp bậc",
        content: [
          "Silver: Giảm 3% cho đơn hàng tiếp theo, nhận thông báo Flash Sale sớm.",
          "Gold: Giảm 5% cho mọi đơn hàng, miễn phí giao hàng toàn quốc, quà sinh nhật.",
          "Diamond: Giảm 8% cho mọi đơn hàng, ưu tiên bảo hành VIP (xử lý trong 24h), quà tặng độc quyền, mời tham gia sự kiện ra mắt sản phẩm mới.",
        ],
      },
      {
        title: "3. Tích điểm đổi quà",
        content: [
          "Mỗi 10.000đ chi tiêu = 1 điểm Mercy.",
          "100 điểm = Voucher giảm 50.000đ.",
          "300 điểm = Voucher giảm 200.000đ.",
          "500 điểm = Voucher giảm 500.000đ hoặc phụ kiện miễn phí.",
          "Điểm có hiệu lực trong vòng 12 tháng kể từ ngày tích lũy.",
        ],
      },
      {
        title: "4. Ưu đãi giới thiệu bạn bè (Referral)",
        content: [
          "Giới thiệu thành công 1 khách hàng mới → Nhận ngay Voucher 100.000đ.",
          "Khách hàng được giới thiệu → Nhận Voucher 50.000đ cho đơn hàng đầu tiên.",
          "Không giới hạn số lần giới thiệu.",
        ],
      },
      {
        title: "5. Điều khoản",
        content: [
          "Chương trình có thể thay đổi theo từng thời kỳ, Mercy sẽ thông báo trước qua email/ứng dụng.",
          "Không áp dụng đồng thời với các chương trình khuyến mãi khác (trừ khi có ghi rõ).",
          "Liên hệ Hotline 0763 068 614 để biết thêm chi tiết.",
        ],
      },
    ],
  },
};

const Policy = () => {
  const { slug } = useParams<{ slug: string }>();
  const policy = slug ? policiesData[slug] : null;

  if (!policy) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy chính sách</h1>
          <p className="text-gray-500 mb-8">Trang chính sách bạn tìm không tồn tại.</p>
          <a href="/" className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
            Về trang chủ
          </a>
        </main>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  const Icon = policy.icon;

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead
        title={policy.title}
        description={policy.desc}
        canonical={`https://mercy.vn/chinh-sach/${slug}`}
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
              {policy.title}
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {policy.desc}
            </p>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {policy.sections.map((section, i) => (
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
                        <span>{item}</span>
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
                    href="tel:0763068614"
                    className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors active:scale-95"
                  >
                    📞 Gọi: 0763 068 614
                  </a>
                  <a
                    href="mailto:Kinhthongminh.mercy@gmail.com"
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

export default Policy;
