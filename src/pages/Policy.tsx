import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { Shield, RotateCcw, Lock, CreditCard, Truck, Heart } from "lucide-react";
import { makeSiteUrl } from "@/lib/config";

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
    title: "Chính sách bảo hành sản phẩm",
    icon: Shield,
    desc: "Căn cứ vào quy định chung của Bộ Công Thương về hoạt động thương mại điện tử và nhằm đảm bảo quyền lợi tốt nhất cho khách hàng, Công ty TNHH Công nghệ Mercy ban hành Chính sách Bảo hành chính thức áp dụng cho các sản phẩm kinh doanh.",
    sections: [
      {
        title: "Điều 1: Phạm vi và đối tượng áp dụng",
        content: [
          "Chính sách này áp dụng cho tất cả khách hàng mua các sản phẩm công nghệ bao gồm Kính thông minh, Đồng hồ thông minh, Tai nghe thông minh và các phụ kiện đi kèm trực tiếp từ hệ thống bán hàng của Mercy.",
        ],
      },
      {
        title: "Điều 2: Thời hạn bảo hành",
        content: [
          "Thời hạn bảo hành được xác định dựa trên gói dịch vụ mà khách hàng lựa chọn tại thời điểm mua hàng, cụ thể như sau:",
          "1. Gói bảo hành mặc định: 15 ngày kể từ ngày nhận hàng thành công.",
          "2. Gói bảo hành mở rộng 03 tháng: 90 ngày kể từ ngày nhận hàng thành công.",
          "3. Gói bảo hành mở rộng 06 tháng: 180 ngày kể từ ngày nhận hàng thành công.",
          "4. Gói bảo hành mở rộng 12 tháng: 365 ngày kể từ ngày nhận hàng thành công.",
          "Lưu ý: Đối với các trường hợp phát sinh lỗi từ nhà sản xuất trong vòng 15 ngày đầu (đối với Kính và Tai nghe) hoặc 30 ngày đầu (đối với Đồng hồ), khách hàng được hưởng chính sách đổi mới sản phẩm tương đương.",
        ],
      },
      {
        title: "Điều 3: Điều kiện được bảo hành",
        content: [
          "Sản phẩm được chấp nhận bảo hành khi thỏa mãn đồng thời các điều kiện sau:",
          "1. Sản phẩm còn trong thời hạn bảo hành căn cứ theo hóa đơn mua hàng hoặc dữ liệu bảo hành điện tử của Mercy.",
          "2. Lỗi sản phẩm được bộ phận kỹ thuật xác định là lỗi do nhà sản xuất (lỗi linh kiện, lỗi phần cứng tự thân).",
          "3. Sản phẩm phải còn nguyên trạng về cấu trúc, không có dấu hiệu can thiệp trái phép từ bên ngoài.",
        ],
      },
      {
        title: "Điều 4: Các trường hợp từ chối bảo hành",
        content: [
          "Mercy có quyền từ chối bảo hành đối với các trường hợp sau:",
          "1. Sản phẩm bị hư hỏng do tác động vật lý như rơi vỡ, móp méo, trầy xước nặng hoặc biến dạng do nhiệt độ cao.",
          "2. Sản phẩm bị thấm nước, chất lỏng hoặc có dấu hiệu rỉ sét, ẩm mốc do bảo quản không đúng cách.",
          "3. Khách hàng tự ý tháo mở sản phẩm, thay đổi cấu trúc hoặc sửa chữa tại các cơ sở không được sự ủy quyền của Mercy.",
          "4. Hư hỏng linh kiện hoặc cháy nổ do sử dụng sai nguồn điện, sạc không đúng tiêu chuẩn hoặc dùng sai phụ kiện đi kèm.",
          "5. Các hao mòn tự nhiên trong quá trình sử dụng như giảm dung lượng pin, mờ lớp sơn phủ hoặc lão hóa vật liệu sau thời gian dài.",
          "6. Sản phẩm không có hóa đơn hoặc mã đơn hàng hợp lệ trên hệ thống của Mercy.",
        ],
      },
      {
        title: "Điều 5: Quy trình tiếp nhận bảo hành",
        content: [
          "Bước 1: Khách hàng liên hệ với Bộ phận Chăm sóc khách hàng qua Hotline 0898273899 để thông báo tình trạng sự cố.",
          "Bước 2: Trong vòng 24 giờ, bộ phận kỹ thuật sẽ hướng dẫn khách hàng khắc phục từ xa qua điện thoại hoặc hỗ trợ trực tuyến.",
          "Bước 3: Nếu không thể khắc phục từ xa, khách hàng gửi sản phẩm về địa chỉ tiếp nhận của công ty. Chúng tôi sẽ tiến hành kiểm tra và xử lý trong thời gian sớm nhất.",
        ],
      },
      {
        title: "Điều 6: Thông tin liên hệ",
        content: [
          "Mọi thắc mắc và yêu cầu bảo hành, Quý khách vui lòng gửi về:",
          "Hotline: 0898 273 899",
          "Email: mercytechglobal@gmail.com",
          "Website: kinhthongminhmercy.vn",
        ],
      },
    ],
  },
  "bao-mat": {
    title: "Chính sách bảo mật thông tin",
    icon: Lock,
    desc: "Công ty TNHH Công nghệ Mercy cam kết bảo vệ tối đa quyền riêng tư và thông tin cá nhân của khách hàng.",
    sections: [
      {
        title: "Điều 1: Mục đích thu thập thông tin cá nhân",
        content: [
          "Mercy thu thập thông tin của khách hàng nhằm các mục đích sau:",
          "1. Thực hiện quy trình giao hàng theo địa chỉ khách hàng đã cung cấp.",
          "2. Hỗ trợ kỹ thuật, tư vấn sản phẩm và giải đáp các thắc mắc của khách hàng.",
          "3. Thực hiện các chương trình hậu mãi, chăm sóc khách hàng và hỗ trợ sau mua hàng.",
          "4. Thông báo các thông tin quan trọng liên quan đến đơn hàng và các thay đổi về chính sách của công ty.",
        ],
      },
      {
        title: "Điều 2: Phạm vi thu thập thông tin",
        content: [
          "Các thông tin cơ bản Mercy thu thập bao gồm:",
          "1. Họ và tên khách hàng.",
          "2. Số điện thoại liên lạc.",
          "3. Địa chỉ nhận hàng (bao gồm số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố).",
          "4. Địa chỉ thư điện tử (Email).",
        ],
      },
      {
        title: "Điều 3: Thời gian lưu trữ thông tin",
        content: [
          "Thông tin cá nhân của khách hàng sẽ được lưu trữ và bảo mật trên hệ thống nội bộ của Mercy cho đến khi có yêu cầu hủy bỏ từ phía khách hàng hoặc khi thông tin không còn cần thiết cho các mục đích hậu mãi và bảo hành sản phẩm.",
        ],
      },
      {
        title: "Điều 4: Những người hoặc tổ chức có thể tiếp cận thông tin",
        content: [
          "1. Mercy cam kết tuyệt đối không bán, chia sẻ hay trao đổi thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào vì mục đích thương mại.",
          "2. Thông tin chỉ được cung cấp cho các đơn vị vận chuyển đối tác để phục vụ duy nhất mục đích giao hàng.",
          "3. Trong trường hợp có yêu cầu từ cơ quan pháp luật có thẩm quyền theo quy định của pháp luật Việt Nam, Mercy có trách nhiệm hợp tác cung cấp thông tin theo đúng quy định.",
        ],
      },
      {
        title: "Điều 5: Đơn vị thu thập và quản lý thông tin",
        content: [
          "Tên đơn vị: CÔNG TY TNHH CÔNG NGHỆ MERCY",
          "Địa chỉ: 8/1E Đường Tô Ký, Ấp Tam Đông 1, Xã Đông Thạnh, Thành phố Hồ Chí Minh, Việt Nam.",
          "Hotline: 0898273899",
          "Email: mercytechglobal@gmail.com",
        ],
      },
      {
        title: "Điều 6: Quyền của khách hàng đối với thông tin cá nhân",
        content: [
          "Khách hàng có quyền yêu cầu Mercy kiểm tra, cập nhật, điều chỉnh hoặc hủy bỏ thông tin cá nhân của mình bằng cách liên hệ trực tiếp qua Hotline hoặc Email chính thức của công ty.",
        ],
      },
      {
        title: "Điều 7: Cam kết bảo mật và an toàn thanh toán",
        content: [
          "1. Bảo mật dữ liệu: Mercy sử dụng giao thức SSL (Secure Sockets Layer) để bảo vệ thông tin khách hàng trong suốt quá trình giao dịch trực tuyến.",
          "2. Bảo mật thanh toán: Hệ thống tuân thủ các tiêu chuẩn bảo mật dữ liệu thông tin thanh toán (PCI DSS). Đối với các giao dịch thẻ nội địa hoặc quốc tế, chúng tôi sử dụng cơ chế Tokenization – chỉ lưu chuỗi đã được mã hóa bởi Đối tác Cổng thanh toán, đảm bảo không trực tiếp lưu trữ thông tin thẻ của khách hàng trên hệ thống website.",
          "3. Xác thực giao dịch: Các giao dịch trực tuyến sẽ được bảo vệ thêm bởi mã xác thực một lần (OTP) gửi qua tin nhắn điện thoại để đảm bảo tính chính chủ của tài khoản.",
        ],
      },
      {
        title: "Điều 8: Điều khoản thi hành",
        content: [
          "Chính sách này có hiệu lực kể từ ngày đăng tải trên website kinhthongminhmercy.vn. Mercy có quyền thay đổi, cập nhật nội dung chính sách này bất cứ lúc nào để phù hợp với quy định pháp luật và hoạt động của công ty mà không cần thông báo trước.",
        ],
      },
    ],
  },
  "tra-gop": {
    title: "Chính sách trả góp",
    icon: CreditCard,
    desc: "Nhằm mang lại sự tiện lợi và hỗ trợ tối đa cho khách hàng trong việc sở hữu các sản phẩm công nghệ tiên tiến, Công ty TNHH Công nghệ Mercy ban hành Chính sách Trả góp chi tiết.",
    sections: [
      {
        title: "Điều 1: Đối tượng và điều kiện áp dụng",
        content: [
          "1. Đối tượng áp dụng: Tất cả công dân Việt Nam từ đủ 18 tuổi trở lên, có đầy đủ năng lực hành vi dân sự, có nhu cầu mua sắm các sản phẩm Kính thông minh, Đồng hồ thông minh, Tai nghe thông minh và các thiết bị khác tại Mercy.",
          "2. Điều kiện áp dụng: Giá trị đơn hàng thanh toán trả góp phải đạt mức tối thiểu từ 3.000.000 VNĐ (Ba triệu đồng chẵn) trở lên sau khi đã trừ các khoản giảm giá hoặc khuyến mãi (nếu có).",
        ],
      },
      {
        title: "Điều 2: Hình thức trả góp qua thẻ tín dụng",
        content: [
          "1. Mercy hợp tác với các Cổng thanh toán uy tín để hỗ trợ trả góp qua thẻ tín dụng của hơn 20 ngân hàng trong nước và quốc tế.",
          "2. Khách hàng sử dụng thẻ tín dụng (Credit Card) mang tên chính chủ, thẻ còn trong trạng thái hoạt động và hạn mức tín dụng còn lại phải lớn hơn hoặc bằng giá trị đơn hàng trả góp.",
          "3. Kỳ hạn trả góp linh hoạt: 3 tháng, 6 tháng, 9 tháng hoặc 12 tháng tùy thuộc vào quy định của từng ngân hàng phát hành thẻ.",
          "4. Khách hàng có thể được hưởng chương trình trả góp 0% lãi suất, tuy nhiên có thể phát sinh phí chuyển đổi trả góp tùy theo chính sách của từng ngân hàng tại thời điểm giao dịch.",
        ],
      },
      {
        title: "Điều 3: Quy trình thực hiện trả góp",
        content: [
          "Bước 1: Khách hàng lựa chọn sản phẩm mong muốn trên website kinhthongminhmercy.vn và đảm bảo tổng giá trị đơn hàng đạt mức tối thiểu theo quy định.",
          "Bước 2: Tại trang thanh toán, khách hàng chọn phương thức \"Thanh toán trả góp bằng thẻ tín dụng\".",
          "Bước 3: Khách hàng điền đầy đủ thông tin thẻ tín dụng, chọn ngân hàng phát hành và kỳ hạn trả góp phù hợp.",
          "Bước 4: Xác nhận thanh toán. Hệ thống sẽ tự động chuyển đổi giao dịch thành trả góp với ngân hàng. Khách hàng không cần thực hiện thêm thủ tục nào khác nếu không có yêu cầu đặc biệt từ ngân hàng phát hành thẻ.",
          "Bước 5: Sau khi giao dịch thành công, Mercy sẽ tiến hành xác nhận đơn hàng và giao hàng theo thời gian quy định.",
        ],
      },
      {
        title: "Điều 4: Chính sách đổi trả đối với đơn hàng trả góp",
        content: [
          "1. Đơn hàng trả góp được áp dụng chính sách bảo hành và đổi mới tương tự như đơn hàng thanh toán thông thường theo \"Chính sách Bảo hành\" của Mercy (áp dụng đổi mới nếu có lỗi từ nhà sản xuất).",
          "2. Mercy không hỗ trợ hủy đơn hàng hoặc hoàn trả tiền mặt cho các giao dịch trả góp đã được ngân hàng chuyển đổi thành công. Việc đổi trả chỉ áp dụng hình thức đổi sản phẩm tương đương hoặc sản phẩm có giá trị cao hơn (khách hàng thanh toán phần chênh lệch bằng tiền mặt hoặc chuyển khoản).",
        ],
      },
      {
        title: "Điều 5: Trách nhiệm của khách hàng",
        content: [
          "1. Khách hàng có trách nhiệm thanh toán đầy đủ và đúng hạn các khoản trả góp hàng tháng cho ngân hàng phát hành thẻ theo sao kê tín dụng.",
          "2. Mercy không chịu trách nhiệm về bất kỳ khoản phí phạt trả chậm hoặc các rủi ro phát sinh giữa khách hàng và ngân hàng liên quan đến việc thanh toán thẻ tín dụng.",
        ],
      },
      {
        title: "Điều 6: Thông tin hỗ trợ",
        content: [
          "Mọi thắc mắc liên quan đến quy trình và thủ tục trả góp, Quý khách vui lòng liên hệ:",
          "Địa chỉ: 8/1E Đường Tô Ký, Ấp Tam Đông 1, Xã Đông Thạnh, Thành phố Hồ Chí Minh, Việt Nam.",
          "Hotline: 0898 273 899",
          "Email: mercytechglobal@gmail.com",
        ],
      },
    ],
  },
  "giao-hang": {
    title: "Chính sách giao hàng và hỗ trợ kỹ thuật",
    icon: Truck,
    desc: "Công ty TNHH Công nghệ Mercy cam kết mang đến dịch vụ vận chuyển an toàn và hỗ trợ kỹ thuật chuyên nghiệp cho mọi khách hàng.",
    sections: [
      {
        title: "Điều 1: Phạm vi vận chuyển",
        content: [
          "Mercy thực hiện giao hàng trên phạm vi toàn quốc, bao gồm tất cả các tỉnh thành và khu vực huyện xã thuộc lãnh thổ Việt Nam thông qua các đối tác vận chuyển uy tín.",
        ],
      },
      {
        title: "Điều 2: Thời gian giao hàng dự kiến",
        content: [
          "Sau khi đơn hàng được xác nhận thành công (hoặc sau khi khách hàng thực hiện đặt cọc 10% theo quy định thanh toán), thời gian giao hàng dự kiến như sau:",
          "1. Khu vực Nội thành Thành phố Hồ Chí Minh: Thời gian từ 2 đến 3 ngày làm việc.",
          "2. Khu vực Ngoại tỉnh và các vùng lân cận: Thời gian từ 5 đến 7 ngày làm việc.",
          "Lưu ý: Thời gian giao hàng không tính các ngày Chủ nhật, ngày lễ Tết theo quy định của Nhà nước hoặc các trường hợp bất khả kháng do thiên tai, dịch bệnh.",
        ],
      },
      {
        title: "Điều 3: Phí vận chuyển",
        content: [
          "1. Phí vận chuyển sẽ được tính toán dựa trên khối lượng sản phẩm và khoảng cách địa lý theo biểu phí của đơn vị vận chuyển.",
          "2. Mức phí cụ thể sẽ được thông báo trực tiếp cho khách hàng trong quá trình xác nhận đơn hàng qua điện thoại hoặc hiển thị rõ tại trang thanh toán của website.",
        ],
      },
      {
        title: "Điều 4: Quy định đồng kiểm khi nhận hàng",
        content: [
          "Để đảm bảo quyền lợi tuyệt đối, Mercy khuyến khích khách hàng thực hiện quy trình đồng kiểm như sau:",
          "1. Khách hàng có quyền mở kiện hàng kiểm tra ngoại quan sản phẩm (số lượng, màu sắc, tình trạng nguyên vẹn của hộp đựng và seal sản phẩm) trước khi thanh toán số tiền còn lại cho nhân viên giao hàng.",
          "2. Khách hàng không được phép tự ý bóc seal (tem niêm phong) của sản phẩm hoặc sử dụng thử sản phẩm trước khi hoàn tất thanh toán.",
          "3. Trường hợp sản phẩm có dấu hiệu bị móp méo, vỡ hỏng do vận chuyển hoặc không đúng mẫu mã đã đặt, khách hàng có quyền từ chối nhận hàng và liên hệ ngay với Hotline 0898273899 để được hỗ trợ xử lý.",
        ],
      },
      {
        title: "Điều 5: Hỗ trợ lắp đặt và cài đặt kỹ thuật",
        content: [
          "Đối với các dòng sản phẩm công nghệ như Kính thông minh, Đồng hồ và Tai nghe, việc \"lắp đặt\" chủ yếu là các thao tác cài đặt phần mềm và kết nối thiết bị. Mercy hỗ trợ khách hàng như sau:",
          "1. Hướng dẫn trực tiếp: Tại địa chỉ văn phòng công ty khi khách hàng mua hàng trực tiếp.",
          "2. Hỗ trợ từ xa: Đối với khách hàng mua online, bộ phận kỹ thuật sẽ hỗ trợ cài đặt, kết nối ứng dụng và hướng dẫn sử dụng thông qua các kênh: Điện thoại, Video Call (Zalo) hoặc điều khiển từ xa qua phần mềm Teamviewer/UltraViewer.",
          "3. Tài liệu hướng dẫn: Mỗi sản phẩm gửi đi đều kèm theo tài liệu hướng dẫn sử dụng chi tiết bằng tiếng Việt hoặc hướng dẫn truy cập kho dữ liệu hỗ trợ trực tuyến của Mercy.",
        ],
      },
      {
        title: "Điều 6: Trách nhiệm với hàng hóa vận chuyển",
        content: [
          "1. Mercy chịu trách nhiệm về các rủi ro như mất mát hoặc hư hỏng sản phẩm trong suốt quá trình vận chuyển từ kho hàng đến tay khách hàng.",
          "2. Khách hàng có trách nhiệm kiểm tra hàng hóa khi nhận. Sau khi khách hàng đã ký nhận hàng mà không ghi chú về tình trạng hư hỏng ngoại quan, Mercy không có trách nhiệm giải quyết các khiếu nại về vỡ hỏng hay thiếu hụt phụ kiện do tác động vật lý sau đó.",
        ],
      },
      {
        title: "Điều 7: Thông tin liên hệ hỗ trợ giao hàng",
        content: [
          "Địa chỉ tiếp nhận: 8/1E Đường Tô Ký, Ấp Tam Đông 1, Xã Đông Thạnh, Thành phố Hồ Chí Minh, Việt Nam.",
          "Hotline hỗ trợ vận chuyển: 0898 273 899",
          "Email: mercytechglobal@gmail.com",
        ],
      },
    ],
  },
  "khach-hang-than-thiet": {
    title: "Chính sách khách hàng thân thiết (Mercy Member)",
    icon: Heart,
    desc: "Nhằm tri ân sự tin tưởng và đồng hành của Quý khách, Công ty TNHH Công nghệ Mercy chính thức áp dụng chương trình Khách hàng thân thiết (Mercy Member).",
    sections: [
      {
        title: "Điều 1: Đối tượng và nguyên tắc tham gia",
        content: [
          "1. Đối tượng áp dụng: Tất cả khách hàng cá nhân có phát sinh giao dịch mua hàng thành công tại hệ thống của Mercy.",
          "2. Nguyên tắc quản lý: Hệ thống quản lý tài khoản thành viên tự động dựa trên Số điện thoại mua hàng của khách hàng. Quý khách vui lòng sử dụng một số điện thoại duy nhất cho mọi giao dịch để đảm bảo quyền lợi tích lũy không bị phân mảnh.",
        ],
      },
      {
        title: "Điều 2: Hệ thống hạng thành viên và điều kiện xét duyệt",
        content: [
          "Hạng thành viên được xét duyệt tự động dựa trên \"Tổng chi tiêu tích lũy\" (số tiền khách hàng thực trả sau khi đã trừ các khuyến mãi) kể từ đơn hàng đầu tiên hoàn tất giao hàng và thanh toán.",
          "1. Hạng M-New (Thành viên Tiêu chuẩn): Dành cho khách hàng có tổng chi tiêu tích lũy dưới 5.000.000 VNĐ.",
          "2. Hạng M-Gold (Thành viên Vàng): Dành cho khách hàng có tổng chi tiêu tích lũy từ 5.000.000 VNĐ đến dưới 15.000.000 VNĐ.",
          "3. Hạng M-Diamond (Thành viên Kim Cương): Dành cho khách hàng có tổng chi tiêu tích lũy từ 15.000.000 VNĐ trở lên.",
        ],
      },
      {
        title: "Điều 3: Quyền lợi đặc quyền theo hạng thành viên",
        content: [
          "Dựa trên hạng thành viên đạt được, Quý khách sẽ tận hưởng các đặc quyền tương ứng trong các lần mua sắm tiếp theo:",
          "1. Đặc quyền hạng M-New: Tích lũy 0.5% giá trị đơn hàng vào điểm thưởng Mercy Point; nhận thông báo sớm nhất về các chương trình Flash Sale và ra mắt sản phẩm mới.",
          "2. Đặc quyền hạng M-Gold: Giảm ngay trực tiếp 1% trên hóa đơn mua thiết bị mới; tích lũy 1% giá trị đơn hàng vào điểm thưởng Mercy Point; tặng mã giảm giá trị giá 200.000 VNĐ nhân dịp sinh nhật khách hàng.",
          "3. Đặc quyền hạng M-Diamond: Giảm ngay trực tiếp 2% trên hóa đơn mua thiết bị mới; tích lũy 2% giá trị đơn hàng vào điểm thưởng Mercy Point; tặng mã giảm giá trị giá 500.000 VNĐ nhân dịp sinh nhật khách hàng; ưu tiên mượn thiết bị dùng tạm trong thời gian chờ bảo hành sản phẩm (nếu có sẵn).",
        ],
      },
      {
        title: "Điều 4: Quy định về tích lũy và sử dụng điểm thưởng (Mercy Point)",
        content: [
          "1. Quy đổi điểm thưởng: Mỗi 1 điểm Mercy Point tích lũy tương đương với 1 VNĐ khi sử dụng để thanh toán cho các đơn hàng tiếp theo.",
          "2. Hạn mức sử dụng: Khách hàng có thể sử dụng Mercy Point để thanh toán tối đa 50% giá trị của một đơn hàng mới.",
          "3. Không quy đổi tiền mặt: Điểm thưởng Mercy Point chỉ có giá trị thanh toán tại hệ thống Mercy, tuyệt đối không có giá trị quy đổi thành tiền mặt dưới mọi hình thức.",
          "4. Thời hạn sử dụng: Điểm thưởng tích lũy có thời hạn sử dụng là 12 tháng kể từ ngày phát sinh giao dịch tích điểm cuối cùng. Quá thời hạn này, hệ thống sẽ tự động hủy số điểm chưa sử dụng.",
        ],
      },
      {
        title: "Điều 5: Điều khoản thi hành và xử lý vi phạm",
        content: [
          "1. Trong trường hợp khách hàng thực hiện đổi trả sản phẩm và được hoàn tiền (nếu có), số điểm tích lũy và chi tiêu ghi nhận từ đơn hàng đó sẽ bị khấu trừ tương ứng khỏi tài khoản thành viên.",
          "2. Mercy có quyền từ chối áp dụng ưu đãi, thu hồi hạng thành viên và toàn bộ điểm thưởng nếu phát hiện khách hàng có hành vi gian lận, cố tình tạo nhiều tài khoản để trục lợi từ chính sách.",
          "3. Mercy bảo lưu quyền thay đổi các điều kiện xét duyệt, tỷ lệ quy đổi điểm và quyền lợi của chương trình khách hàng thân thiết bất cứ lúc nào. Mọi thay đổi sẽ được thông báo công khai trên website kinhthongminhmercy.vn và có hiệu lực ngay sau khi đăng tải.",
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
        canonical={makeSiteUrl(`/chinh-sach/${slug}`)}
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

export default Policy;
