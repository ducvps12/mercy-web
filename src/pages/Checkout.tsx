import { useState, useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cartTotal, cart, clearCart } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId] = useState(`MERCY${Math.floor(10000 + Math.random() * 90000)}`);

  // Affiliate code checking from localStorage
  const refCode = localStorage.getItem("mercy_ref");

  const shippingFee = cartTotal >= 2000000 ? 0 : 30000;
  const totalWithShipping = cartTotal + shippingFee;

  // Bank Info
  const BANK_ACCOUNT = "24488671";
  const BANK_NAME = "ACB";
  const ACCOUNT_NAME = "MAI XUAN ANH";
  // The structure `ThanhToan + orderId` is used.
  const description = `ThanhToan${orderId}`;

  // Generate VietQR image
  const qrUrl = `https://img.vietqr.io/image/${BANK_NAME}-${BANK_ACCOUNT}-compact2.png?amount=${totalWithShipping}&addInfo=${description}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  useEffect(() => {
    if (cart.length === 0 && !isSuccess) {
      navigate('/shop');
    }
  }, [cart, navigate, isSuccess]);

  // Polling to verify payment
  useEffect(() => {
    if (isSuccess || cartTotal === 0) return;

    const checkPayment = async () => {
      try {
        const res = await fetch("https://api.sieuthicode.net/historyapiacb/ec4f8aeb9d87bc0ffa48f709365313d1");
        const json = await res.json();
        
        if (json.messageStatus === "success" && json.data) {
          const match = json.data.find((tx: any) => 
            // In a real API we check type "IN" and amount && description.
            // Using includes to loosely match the description string since banks sometimes prepend/append characters
            (tx.amount >= totalWithShipping) && 
            tx.description.toLowerCase().includes(orderId.toLowerCase())
          );

          if (match) {
            setIsSuccess(true);
            toast.success("Thanh toán thành công! Cảm ơn bạn.");
            
            // Post order to backend
            fetch(`http://localhost:3000/api/orders`, { 
              method: "POST", 
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                total: totalWithShipping,
                orderCode: orderId,
                affiliateCode: refCode,
                userId: user?.id || null,
                items: cart
              }) 
            }).then(() => {
              clearCart();
            }).catch(e => console.error("Could not save order", e));
          }
        }
      } catch (err) {
        console.error("Lỗi kiểm tra lịch sử thanh toán", err);
      }
    };

    const interval = setInterval(checkPayment, 5000);
    return () => clearInterval(interval);
  }, [cartTotal, isSuccess, orderId, totalWithShipping, clearCart, refCode]);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Thanh toán thành công</h1>
          <p className="text-muted-foreground text-center mb-8">
            Đơn hàng <strong>{orderId}</strong> của bạn đã được xác nhận thanh toán. Chúng tôi sẽ sớm liên hệ để giao hàng.
          </p>
          <Link to="/" className="px-8 py-3 bg-primary text-white rounded-xl font-medium">Trở về trang chủ</Link>
        </div>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      
      <section className="bg-mercy-warm-bg border-b border-border py-10 text-center">
        <h1 className="text-3xl font-bold italic" style={{ fontFamily: "Georgia, serif" }}>Thanh toán</h1>
      </section>

      <div className="container py-12 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Code and Info */}
          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-md">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">Chuyển khoản để hoàn tất</h2>
            <div className="flex flex-col items-center justify-center space-y-6">
              <img src={qrUrl} alt="Mã QR Thanh Toán" className="w-64 h-64 object-contain rounded-xl border border-gray-100 shadow-sm" />
              
              <div className="w-full space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Ngân hàng</span>
                  <span className="font-semibold">{BANK_NAME}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Số tài khoản</span>
                  <span className="font-bold text-primary text-lg">{BANK_ACCOUNT}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Chủ tài khoản</span>
                  <span className="font-semibold uppercase">{ACCOUNT_NAME}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Số tiền</span>
                  <span className="font-bold text-lg text-primary">{formatPrice(totalWithShipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nội dung CK</span>
                  <span className="font-mono bg-muted px-2 py-1 rounded text-primary font-bold">{description}</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-500/10 text-yellow-700 rounded-xl text-center text-sm w-full">
                <p className="flex items-center justify-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                  </span>
                  Đang tự động chờ xác nhận thanh toán...
                </p>
                <p className="text-xs mt-2 opacity-80">Giao dịch sẽ được ghi nhận ngay sau khi chuyển khoản thành công</p>
              </div>
            </div>
          </div>

          {/* User & Order Summary */}
          <div className="space-y-6">
            <div className="bg-muted/30 p-6 rounded-2xl border border-border">
              <h3 className="font-semibold mb-4">Thông tin mua hàng</h3>
              {user ? (
                <div className="text-sm">
                  <p><strong>Người nhận:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                </div>
              ) : (
                <div className="text-sm">
                  <p className="text-muted-foreground mb-4">Bạn chưa đăng nhập. Nên đăng nhập để theo dõi đơn hàng!</p>
                  <Link to="/login" className="text-primary hover:underline font-medium">Đăng nhập tại đây</Link>
                </div>
              )}
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-md">
              <h3 className="font-semibold mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 text-sm items-center">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <span>{formatPrice(item.price * (item.quantity || 1))}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-5 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>{shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-border mt-2 pt-2">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatPrice(totalWithShipping)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Checkout;
