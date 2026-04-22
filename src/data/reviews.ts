// Review data system - unique reviews per product/category
export interface Review {
  name: string;
  avatar: string;
  color: string;
  rating: number;
  date: string;
  verified: boolean;
  text: string;
  helpful: number;
  images: string[];
}

export interface ReviewSummary {
  avgRating: number;
  totalReviews: number;
  distribution: { stars: number; count: number; pct: number }[];
}

// All possible reviews - categorized
const glassesReviews: Review[] = [
  {
    name: "Trần Minh Đức", avatar: "T", color: "bg-blue-500",
    rating: 5, date: "03/04/2025", verified: true,
    text: "Kính rất đẹp, camera quay 2K rõ nét. Trợ lý AI nghe lệnh nhanh, dịch thuật realtime khá chính xác. Pin dùng cả ngày thoải mái. Recommend cho ae nào cần thiết bị all-in-one!",
    helpful: 12, images: [],
  },
  {
    name: "Nguyễn Thu Hà", avatar: "N", color: "bg-pink-500",
    rating: 5, date: "28/03/2025", verified: true,
    text: "Mua cho chồng dùng đi du lịch, quay video POV rất tiện. Âm thanh loa 3D nghe nhạc trong lành, không bị lộ ra ngoài. Thiết kế đeo nhẹ, đội cả ngày không mỏi tai.",
    helpful: 8, images: [],
  },
  {
    name: "Phạm Quang Huy", avatar: "P", color: "bg-emerald-500",
    rating: 5, date: "22/03/2025", verified: true,
    text: "Chất lượng camera tốt hơn mong đợi, chống rung EIS mượt mà. Ghi âm cuộc họp tiện lợi, AI tóm tắt nội dung chuẩn. Ship nhanh, đóng gói cẩn thận. 5 sao!",
    helpful: 15, images: [],
  },
  {
    name: "Lê Thị Mai Anh", avatar: "L", color: "bg-purple-500",
    rating: 4, date: "18/03/2025", verified: true,
    text: "Kính đẹp, nhẹ chỉ 35g đeo rất thoải mái. Tính năng dịch thuật realtime rất hữu ích khi đi công tác nước ngoài. Trừ 1 sao vì app đôi lúc hơi lag, nhưng update thường xuyên nên ok.",
    helpful: 6, images: [],
  },
  {
    name: "Võ Hoàng Nam", avatar: "V", color: "bg-orange-500",
    rating: 5, date: "12/03/2025", verified: false,
    text: "Quay video khi chạy xe máy cực kỳ ổn định. IP65 chống nước tốt, đi mưa nhẹ không vấn đề gì. Giá so với Ray-Ban Meta thì rẻ hơn rất nhiều mà tính năng ngang ngửa.",
    helpful: 21, images: [],
  },
  {
    name: "Đặng Thùy Linh", avatar: "Đ", color: "bg-cyan-500",
    rating: 3, date: "06/03/2025", verified: true,
    text: "Sản phẩm ok, nhưng mình thấy thời lượng quay video 12 phút hơi ngắn. Mong hãng cải thiện pin ở phiên bản sau. Các tính năng khác thì ổn, kỹ thuật viên tư vấn nhiệt tình.",
    helpful: 3, images: [],
  },
  {
    name: "Hoàng Văn Tùng", avatar: "H", color: "bg-indigo-500",
    rating: 5, date: "01/03/2025", verified: true,
    text: "Dùng để ghi lại khoảnh khắc du lịch rất tiện. Không cần cầm điện thoại quay nữa. Tính năng AI hỗ trợ tìm đường, dịch ngôn ngữ khi ở nước ngoài quá tuyệt!",
    helpful: 18, images: [],
  },
  {
    name: "Phan Thanh Bình", avatar: "P", color: "bg-teal-500",
    rating: 5, date: "25/02/2025", verified: true,
    text: "Đã dùng 2 tháng, rất hài lòng. Bluetooth kết nối nhanh, nghe nhạc chất lượng tốt. Micro khử ồn AI nghe rất rõ khi gọi điện. Đóng gói đẹp, tặng kèm bao da.",
    helpful: 9, images: [],
  },
  {
    name: "Ngô Thị Minh Ngọc", avatar: "N", color: "bg-rose-500",
    rating: 4, date: "20/02/2025", verified: true,
    text: "Thiết kế thời trang, đeo đi làm không ai biết là kính thông minh. Camera chụp ảnh 32MP khá nét. Chỉ tiếc là chưa có phiên bản gọng tròn cho nữ.",
    helpful: 7, images: [],
  },
  {
    name: "Lương Đức Anh", avatar: "L", color: "bg-amber-600",
    rating: 5, date: "15/02/2025", verified: false,
    text: "Tặng bạn gái làm quà Valentine, cô ấy mê lắm. Quay vlog POV rất đẹp, âm thanh thu được rõ ràng. Sạc nhanh 1 tiếng đầy pin.",
    helpful: 14, images: [],
  },
  {
    name: "Trương Quốc Đạt", avatar: "T", color: "bg-lime-600",
    rating: 5, date: "10/02/2025", verified: true,
    text: "Mình là dân sales nên phải đi gặp khách nhiều. Tính năng ghi âm 1 chạm giúp mình note lại nội dung cuộc họp rất tiện. AI tóm tắt cũng khá chính xác.",
    helpful: 22, images: [],
  },
  {
    name: "Bùi Thị Hương", avatar: "B", color: "bg-fuchsia-500",
    rating: 4, date: "05/02/2025", verified: true,
    text: "Sản phẩm tốt, dùng được nhiều tính năng. Loa nghe nhạc hay, pin dùng 8-10 tiếng nhẹ nhàng. Mong update thêm nhiều giọng dịch thuật hơn.",
    helpful: 5, images: [],
  },
];

const robotReviews: Review[] = [
  {
    name: "Nguyễn Thanh Mai", avatar: "N", color: "bg-pink-400",
    rating: 5, date: "02/04/2025", verified: true,
    text: "Con gái mình 6 tuổi mê lắm! BabyThree nói chuyện vui, dạy tiếng Anh tự nhiên. Mắt LED biểu cảm rất cute, bé coi như bạn thân luôn.",
    helpful: 25, images: [],
  },
  {
    name: "Lê Hoàng Phúc", avatar: "L", color: "bg-blue-400",
    rating: 5, date: "27/03/2025", verified: true,
    text: "Mua cho cháu trai 8 tuổi. AI trả lời câu hỏi về động vật, khoa học rất thông minh. Bé luyện phát âm tiếng Anh mỗi ngày, tiến bộ thấy rõ!",
    helpful: 19, images: [],
  },
  {
    name: "Trần Thị Bích", avatar: "T", color: "bg-green-400",
    rating: 4, date: "20/03/2025", verified: true,
    text: "Thiết kế dễ thương, chất liệu mềm mại an toàn cho bé. Tính năng kể chuyện và hát ru rất hay. Pin dùng được lâu. Trừ 1 sao vì giá hơi cao.",
    helpful: 11, images: [],
  },
  {
    name: "Võ Minh Tuấn", avatar: "V", color: "bg-orange-400",
    rating: 5, date: "15/03/2025", verified: false,
    text: "Combo 3 con quá xinh! Mỗi con một tính cách khác nhau, con gái mình chơi cả ngày không chán. Tính năng đố vui kiến thức giúp bé học mà chơi.",
    helpful: 16, images: [],
  },
  {
    name: "Đỗ Thị Hạnh", avatar: "Đ", color: "bg-purple-400",
    rating: 5, date: "08/03/2025", verified: true,
    text: "Quà tặng 8/3 cho con gái, bé thích lắm! Nhận dạng giọng nói tốt, phản hồi nhanh. Mắt LED thay đổi biểu cảm theo cảm xúc rất sinh động.",
    helpful: 13, images: [],
  },
  {
    name: "Huỳnh Văn Phát", avatar: "H", color: "bg-teal-400",
    rating: 4, date: "01/03/2025", verified: true,
    text: "Dạy tiếng Anh cho con hiệu quả hơn mình tưởng. Phát âm chuẩn, có game tương tác. Chỉ mong thêm nhiều ngôn ngữ châu Á hơn.",
    helpful: 8, images: [],
  },
  {
    name: "Phạm Ngọc Lan", avatar: "P", color: "bg-rose-400",
    rating: 5, date: "22/02/2025", verified: true,
    text: "Mua con Capybara cho bé nhà mình, xinh xắn quá trời! Bé nói chuyện với nó cả ngày. AI rất thông minh, biết nhớ tên bé và cá nhân hóa câu trả lời.",
    helpful: 20, images: [],
  },
  {
    name: "Nguyễn Hải Đăng", avatar: "N", color: "bg-cyan-400",
    rating: 3, date: "15/02/2025", verified: true,
    text: "Tính năng AI tốt nhưng loa hơi nhỏ khi dùng ngoài trời. Phù hợp dùng trong nhà. Thiết kế cute, con thích nhưng mong cải thiện chất lượng loa.",
    helpful: 4, images: [],
  },
];

const accessoryReviews: Review[] = [
  {
    name: "Hoàng Thị Yến", avatar: "H", color: "bg-amber-500",
    rating: 5, date: "01/04/2025", verified: true,
    text: "Bao da rất đẹp, chất liệu mềm mịn. Đựng kính vừa khít, bảo vệ tốt. Thiết kế gọn nhẹ bỏ túi được. Giá 99k quá rẻ so với chất lượng!",
    helpful: 10, images: [],
  },
  {
    name: "Trần Quốc Bảo", avatar: "T", color: "bg-slate-500",
    rating: 5, date: "25/03/2025", verified: true,
    text: "Mua kèm kính MCK, bao da đựng rất vừa. Chống trầy xước tốt, đường may tỉ mỉ. Nên mua kèm để bảo vệ kính.",
    helpful: 7, images: [],
  },
  {
    name: "Lê Minh Châu", avatar: "L", color: "bg-violet-500",
    rating: 4, date: "18/03/2025", verified: true,
    text: "Bao da ok, đẹp đúng như mô tả. Chỉ hơi tiếc không có nhiều màu để chọn. Mong hãng ra thêm màu nâu và xám.",
    helpful: 3, images: [],
  },
  {
    name: "Phạm Văn Hưng", avatar: "P", color: "bg-gray-500",
    rating: 5, date: "10/03/2025", verified: false,
    text: "Đóng gói cẩn thận, ship nhanh. Bao da chất lượng cao, logo Mercy in chìm sang trọng. Dùng hàng ngày 2 tháng rồi vẫn mới.",
    helpful: 5, images: [],
  },
  {
    name: "Ngô Thanh Tâm", avatar: "N", color: "bg-emerald-400",
    rating: 5, date: "02/03/2025", verified: true,
    text: "Giá siêu rẻ mà chất lượng tuyệt vời. Khóa nam châm đóng mở dễ dàng, lót trong mềm mại không trầy kính. 10 điểm!",
    helpful: 12, images: [],
  },
];

// Seeded random to get consistent reviews per product
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  const rng = seededRandom(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Get reviews for a specific product
export function getProductReviews(productId: number, category: string): Review[] {
  let baseReviews: Review[];
  
  if (category === "Phụ Kiện") {
    baseReviews = accessoryReviews;
  } else if (category === "Robot AI") {
    baseReviews = robotReviews;
  } else {
    baseReviews = glassesReviews;
  }
  
  // Shuffle reviews based on product ID for unique ordering
  const shuffled = shuffleWithSeed(baseReviews, productId * 137);
  
  // Return a subset based on product ID (varied count)
  const countSeed = seededRandom(productId * 31);
  const count = Math.floor(countSeed() * 4) + Math.min(baseReviews.length - 3, 6); // 6 to baseReviews.length-3+6
  
  // Add product images to some reviews
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Get review summary for a product
export function getReviewSummary(reviews: Review[]): ReviewSummary {
  const total = reviews.length;
  if (total === 0) {
    return {
      avgRating: 0,
      totalReviews: 0,
      distribution: [5,4,3,2,1].map(s => ({ stars: s, count: 0, pct: 0 })),
    };
  }
  
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = Math.round((sum / total) * 10) / 10;
  
  const dist = [5,4,3,2,1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    return { stars, count, pct: Math.round((count / total) * 100) };
  });
  
  return { avgRating: avg, totalReviews: total, distribution: dist };
}

// User-written reviews stored in localStorage
const STORED_REVIEWS_KEY = "mercy_user_reviews";

export interface StoredReview {
  productId: number;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export function getStoredReviews(productId: number): Review[] {
  try {
    const stored = localStorage.getItem(STORED_REVIEWS_KEY);
    if (!stored) return [];
    const all: StoredReview[] = JSON.parse(stored);
    return all
      .filter(r => r.productId === productId)
      .map(r => ({
        name: r.name,
        avatar: r.name.charAt(0).toUpperCase(),
        color: "bg-red-500",
        rating: r.rating,
        date: r.date,
        verified: false,
        text: r.text,
        helpful: 0,
        images: [],
      }));
  } catch {
    return [];
  }
}

export function saveReview(review: StoredReview): void {
  try {
    const stored = localStorage.getItem(STORED_REVIEWS_KEY);
    const all: StoredReview[] = stored ? JSON.parse(stored) : [];
    all.unshift(review);
    localStorage.setItem(STORED_REVIEWS_KEY, JSON.stringify(all));
  } catch {
    // silently fail
  }
}
