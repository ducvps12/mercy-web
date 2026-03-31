import glasses1 from "@/assets/products/glasses-1.jpg";
import glasses2 from "@/assets/products/glasses-2.jpg";
import glasses3 from "@/assets/products/glasses-3.jpg";
import glasses4 from "@/assets/products/glasses-4.jpg";
import glasses5 from "@/assets/products/glasses-5.jpg";
import glasses7 from "@/assets/products/glasses-7.jpg";

export interface ProductData {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
  category: string;
}

export const products: ProductData[] = [
  {
    id: 1,
    name: "Kính Nghe Nhạc Thông Minh Bluetooth Mercy KNNT5.0",
    price: 2990000,
    originalPrice: 3990000,
    image: glasses1,
    images: [glasses1, glasses2, glasses3],
    description: "Kính mắt thông minh tích hợp Bluetooth 5.0, cho phép nghe nhạc, nghe gọi rảnh tay. Thiết kế thời trang, phù hợp mọi phong cách. Chống tia UV400, bảo vệ mắt toàn diện.",
    specs: [
      { label: "Bluetooth", value: "5.0" },
      { label: "Pin", value: "100mAh, sử dụng 4-6 giờ" },
      { label: "Sạc", value: "Type-C, sạc đầy 1.5 giờ" },
      { label: "Trọng lượng", value: "35g" },
      { label: "Chống nước", value: "IPX4" },
      { label: "Tròng kính", value: "Chống UV400, chống chói" },
    ],
    category: "Kính Mắt Thông Minh",
  },
  {
    id: 2,
    name: "Kính Râm Nghe Nhạc Thông Minh Bluetooth Mercy KNND5.0",
    price: 3490000,
    originalPrice: 4490000,
    image: glasses2,
    images: [glasses2, glasses1, glasses4],
    description: "Kính râm thông minh phong cách, tích hợp loa ngoài Bluetooth 5.0. Tròng kính phân cực cao cấp, bảo vệ mắt khỏi tia UV và ánh sáng chói.",
    specs: [
      { label: "Bluetooth", value: "5.0" },
      { label: "Pin", value: "120mAh, sử dụng 5-7 giờ" },
      { label: "Sạc", value: "Type-C" },
      { label: "Trọng lượng", value: "38g" },
      { label: "Chống nước", value: "IPX4" },
      { label: "Tròng kính", value: "Phân cực, chống UV400" },
    ],
    category: "Kính Mắt Thông Minh",
  },
  {
    id: 3,
    name: "Kính Thông Minh Bluetooth Mercy 6.0 – Camera Quay Video/Chụp Hình",
    price: 5990000,
    originalPrice: 7990000,
    image: glasses3,
    images: [glasses3, glasses5, glasses7],
    description: "Kính thông minh cao cấp tích hợp camera Full HD, cho phép quay video và chụp ảnh trực tiếp. Bluetooth 6.0 siêu nhanh, âm thanh vượt trội.",
    specs: [
      { label: "Bluetooth", value: "6.0" },
      { label: "Camera", value: "Full HD 1080p" },
      { label: "Bộ nhớ", value: "32GB" },
      { label: "Pin", value: "200mAh, sử dụng 3-5 giờ" },
      { label: "Sạc", value: "Type-C, sạc nhanh" },
      { label: "Trọng lượng", value: "45g" },
    ],
    category: "Kính Mắt Thông Minh",
  },
  {
    id: 4,
    name: "Kính Thông Minh Mercy MCK5.0 [Bản Black]",
    price: 4990000,
    image: glasses4,
    images: [glasses4, glasses1, glasses5],
    description: "Phiên bản Black sang trọng với thiết kế tối giản. Bluetooth 5.0, âm thanh rõ ràng, khử tiếng ồn hiệu quả.",
    specs: [
      { label: "Bluetooth", value: "5.0" },
      { label: "Pin", value: "150mAh, sử dụng 5-8 giờ" },
      { label: "Sạc", value: "Type-C" },
      { label: "Trọng lượng", value: "32g" },
      { label: "Khử ồn", value: "ENC" },
      { label: "Màu sắc", value: "Đen" },
    ],
    category: "Kính Mắt Thông Minh",
  },
  {
    id: 5,
    name: "Kính Thông Minh Mercy MCK5.0 [Bản White]",
    price: 4990000,
    image: glasses5,
    images: [glasses5, glasses4, glasses2],
    description: "Phiên bản White trẻ trung với thiết kế tối giản. Bluetooth 5.0, âm thanh rõ ràng, khử tiếng ồn hiệu quả.",
    specs: [
      { label: "Bluetooth", value: "5.0" },
      { label: "Pin", value: "150mAh, sử dụng 5-8 giờ" },
      { label: "Sạc", value: "Type-C" },
      { label: "Trọng lượng", value: "32g" },
      { label: "Khử ồn", value: "ENC" },
      { label: "Màu sắc", value: "Trắng" },
    ],
    category: "Kính Mắt Thông Minh",
  },
  {
    id: 6,
    name: "Kính Thông Minh Mercy MCK5.1 [Bản Black]",
    price: 5990000,
    image: glasses7,
    images: [glasses7, glasses3, glasses1],
    description: "Phiên bản nâng cấp MCK5.1 với chip xử lý mới, âm thanh Hi-Fi, thời lượng pin vượt trội.",
    specs: [
      { label: "Bluetooth", value: "5.1" },
      { label: "Pin", value: "180mAh, sử dụng 6-9 giờ" },
      { label: "Sạc", value: "Type-C, sạc nhanh" },
      { label: "Trọng lượng", value: "33g" },
      { label: "Âm thanh", value: "Hi-Fi, ENC" },
      { label: "Màu sắc", value: "Đen" },
    ],
    category: "Kính Mắt Thông Minh",
  },
  {
    id: 7,
    name: "Kính Thông Minh Mercy MCK5.1 [Bản White]",
    price: 5990000,
    image: glasses1,
    images: [glasses1, glasses7, glasses5],
    description: "Phiên bản nâng cấp MCK5.1 màu trắng với chip xử lý mới, âm thanh Hi-Fi, thời lượng pin vượt trội.",
    specs: [
      { label: "Bluetooth", value: "5.1" },
      { label: "Pin", value: "180mAh, sử dụng 6-9 giờ" },
      { label: "Sạc", value: "Type-C, sạc nhanh" },
      { label: "Trọng lượng", value: "33g" },
      { label: "Âm thanh", value: "Hi-Fi, ENC" },
      { label: "Màu sắc", value: "Trắng" },
    ],
    category: "Kính Mắt Thông Minh",
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN").format(price) + "đ";
