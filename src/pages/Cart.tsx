import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import { useShop } from "@/context/ShopContext";
import { formatPrice } from "@/data/products";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, cartCount } = useShop();

  const handleRemove = (id: number, name: string) => {
    removeFromCart(id);
    toast.success("Đã xoá khỏi giỏ hàng", { description: name });
  };

  const shippingFee = cartTotal >= 2000000 ? 0 : 30000;
  const totalWithShipping = cartTotal + shippingFee;

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />

      {/* Page Header */}
      <section className="bg-mercy-warm-bg border-b border-border">
        <div className="container py-10 md:py-14 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground italic" style={{ fontFamily: "Georgia, serif" }}>
            Giỏ hàng
          </h1>
          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>—</span>
            <span className="text-foreground">Giỏ hàng ({cartCount})</span>
          </div>
        </div>
      </section>

      <div className="container py-8 md:py-12">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-9 h-9 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Giỏ hàng trống</h2>
            <p className="text-muted-foreground text-sm mb-6">Hãy thêm sản phẩm yêu thích vào giỏ hàng</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 py-3 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/20"
            >
              Tiếp tục mua sắm
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              {/* Desktop Table Header */}
              <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 bg-muted/50 rounded-xl text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                <span>Sản phẩm</span>
                <span className="text-center">Đơn giá</span>
                <span className="text-center">Số lượng</span>
                <span className="text-center">Thành tiền</span>
                <span className="w-10" />
              </div>

              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Mobile layout */}
                    <div className="flex gap-4 md:hidden">
                      <Link to={`/product/${item.id}`} className="shrink-0">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.id}`} className="text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors">
                          {item.name}
                        </Link>
                        <p className="text-primary font-bold text-sm mt-1">{formatPrice(item.price)}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateCartQuantity(item.id, (item.quantity || 1) - 1)}
                              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity || 1}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, (item.quantity || 1) + 1)}
                              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemove(item.id, item.name)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_auto] gap-4 items-center">
                      <div className="flex items-center gap-4">
                        <Link to={`/product/${item.id}`} className="shrink-0">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                        </Link>
                        <Link to={`/product/${item.id}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
                          {item.name}
                        </Link>
                      </div>
                      <p className="text-sm text-foreground text-center">{formatPrice(item.price)}</p>
                      <div className="flex items-center justify-center">
                        <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.id, (item.quantity || 1) - 1)}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity || 1}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, (item.quantity || 1) + 1)}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-primary text-center">
                        {formatPrice(item.price * (item.quantity || 1))}
                      </p>
                      <button
                        onClick={() => handleRemove(item.id, item.name)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  ← Tiếp tục mua sắm
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                <h2 className="text-lg font-bold text-foreground mb-5">Tóm tắt đơn hàng</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính ({cartCount} sản phẩm)</span>
                    <span className="font-medium text-foreground">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span className={`font-medium ${shippingFee === 0 ? "text-green-600" : "text-foreground"}`}>
                      {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                    </span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Miễn phí vận chuyển cho đơn từ {formatPrice(2000000)}
                    </p>
                  )}
                </div>

                <div className="border-t border-border mt-5 pt-5">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-foreground">Tổng cộng</span>
                    <span className="text-xl font-bold text-primary">{formatPrice(totalWithShipping)}</span>
                  </div>
                </div>

                <button className="w-full mt-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md shadow-primary/20">
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default Cart;
