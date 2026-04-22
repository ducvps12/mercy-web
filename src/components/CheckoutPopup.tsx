import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, Check, QrCode, Phone, User, Loader2, MapPin, ShieldCheck, Truck, RotateCcw, Shield, Gift, Info, ChevronDown, ChevronUp, Copy, CheckCheck } from "lucide-react";
import { formatPrice } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import { getNextOrderNumber, generateTransferContent, generateOrderCode, saveOrder, updateOrderInfo, type Order } from "@/data/orders";

interface CheckoutPopupProps {
  total: number;
  onClose: () => void;
}

type PaymentOption = "deposit" | "full";

const CheckoutPopup = ({ total, onClose }: CheckoutPopupProps) => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useShop();

  // Steps: 1=Payment select, 2=QR transfer, 3=Success+Info
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption>("deposit");
  const [submitting, setSubmitting] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [expandDepositInfo, setExpandDepositInfo] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Countdown state for payment confirmation
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(5);
  const countdownTotal = 5; // total seconds for countdown
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Customer info - filled AFTER payment in step 3
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [infoSubmitted, setInfoSubmitted] = useState(false);
  const [infoSubmitting, setInfoSubmitting] = useState(false);

  const displayTotal = cartTotal || total;
  const depositAmount = Math.ceil(displayTotal * 0.1);
  const remainingCOD = displayTotal - depositAmount;
  const transferAmount = selectedPayment === "deposit" ? depositAmount : displayTotal;

  // Generate order code with incrementing number
  const { orderNumber, orderCode, transferContentStr } = useMemo(() => {
    const num = getNextOrderNumber();
    return {
      orderNumber: num,
      orderCode: generateOrderCode(num),
      transferContentStr: generateTransferContent(num),
    };
  }, []);

  const handlePlaceOrder = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep(2);
    }, 600);
  };

  const finishPayment = useCallback(() => {
    // Save order to localStorage + cookie
    const newOrder: Order = {
      orderCode,
      orderNumber,
      items: cart.map(c => ({
        id: c.id,
        name: c.name,
        price: c.price,
        image: c.image,
        quantity: c.quantity || 1,
      })),
      total: displayTotal,
      transferAmount,
      paymentMethod: selectedPayment,
      depositAmount: selectedPayment === "deposit" ? depositAmount : undefined,
      remainingCOD: selectedPayment === "deposit" ? remainingCOD : undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
      transferContent: transferContentStr,
    };
    saveOrder(newOrder);
    setCountdownActive(false);
    setSubmitting(false);
    setStep(3);
  }, [orderCode, orderNumber, cart, displayTotal, transferAmount, selectedPayment, depositAmount, remainingCOD, transferContentStr]);

  const handleConfirmPayment = () => {
    setSubmitting(true);
    setCountdownSeconds(countdownTotal);
    setCountdownActive(true);
  };

  // Countdown timer effect
  useEffect(() => {
    if (!countdownActive) return;

    countdownIntervalRef.current = setInterval(() => {
      setCountdownSeconds(prev => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          finishPayment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [countdownActive, finishPayment]);

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setInfoSubmitting(true);
    // Update order with customer info
    updateOrderInfo(orderCode, { name: name.trim(), phone: phone.trim(), address: address.trim() });
    setTimeout(() => {
      setInfoSubmitting(false);
      setInfoSubmitted(true);
    }, 800);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  // Bank info
  const bankAccount = "0763068614";
  const bankName = "MB Bank";
  const accountName = "MERCY SMART VISION";
  const transferContent = transferContentStr;
  const qrUrl = `https://img.vietqr.io/image/MB-${bankAccount}-compact2.png?amount=${transferAmount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(accountName)}`;

  const stepLabels = [
    { num: 1, label: "Thanh toán" },
    { num: 2, label: "Chuyển khoản" },
    { num: 3, label: "Hoàn tất" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gray-50 rounded-2xl shadow-2xl w-full max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-red-600 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <h2 className="font-bold text-lg">
            {step === 1 && "Chọn phương thức thanh toán"}
            {step === 2 && "Chuyển khoản thanh toán"}
            {step === 3 && (infoSubmitted ? "Đặt hàng thành công!" : "Hoàn tất đơn hàng")}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center px-5 py-3 bg-white border-b border-gray-200 shrink-0">
          {stepLabels.map((s, idx) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s.num ? "bg-red-600 text-white" : "bg-gray-200 text-gray-400"
                }`}>
                  {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${step >= s.num ? "text-red-600" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > s.num ? "bg-red-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* STEP 1: Payment Method Selection                                */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="flex flex-col lg:flex-row min-h-0">
              {/* Left: Payment Options */}
              <div className="flex-1 p-5">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                  Chọn phương thức thanh toán
                </h3>

                <div className="space-y-3">
                  {/* ── Option 1: Cọc đảm bảo 10% ── */}
                  <button
                    onClick={() => setSelectedPayment("deposit")}
                    className={`w-full text-left rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                      selectedPayment === "deposit"
                        ? "border-red-500 shadow-lg shadow-red-500/10"
                        : "border-gray-200 hover:border-red-300"
                    }`}
                  >
                    <div className={`p-4 ${selectedPayment === "deposit" ? "bg-red-50" : "bg-white"}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          selectedPayment === "deposit" ? "border-red-500 bg-red-500" : "border-gray-300"
                        }`}>
                          {selectedPayment === "deposit" && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-gray-900">Chuyển khoản cọc đảm bảo</h4>
                            <span className="text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full">PHỔ BIẾN</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Cọc <span className="font-bold text-red-600">10%</span> giá trị đơn hàng · Thanh toán phần còn lại khi nhận hàng
                          </p>
                          <div className="mt-3 bg-white rounded-xl p-3 border border-red-100">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Số tiền cọc (10%)</span>
                              <span className="text-lg font-extrabold text-red-600">{formatPrice(depositAmount)}</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-400">Còn lại khi nhận hàng</span>
                              <span className="text-sm font-semibold text-gray-600">{formatPrice(remainingCOD)}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setExpandDepositInfo(!expandDepositInfo); }}
                            className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium mt-2 transition-colors"
                          >
                            <Info className="w-3 h-3" />
                            Chính sách cọc đảm bảo
                            {expandDepositInfo ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    {expandDepositInfo && selectedPayment === "deposit" && (
                      <div className="px-4 pb-4 bg-red-50 border-t border-red-100" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white rounded-xl p-3 mt-2 space-y-2">
                          <div className="flex items-start gap-2">
                            <Shield className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                            <p className="text-[11px] text-gray-600 leading-relaxed">
                              <span className="font-semibold text-gray-800">Hoàn tiền cọc 100%</span> — Sau khi giao hàng thành công, khoản cọc đảm bảo sẽ được <span className="font-bold text-green-600">hoàn trả lại</span> cho bạn.
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                            <p className="text-[11px] text-gray-600 leading-relaxed">
                              <span className="font-semibold text-gray-800">Bảo vệ đôi bên</span> — Cọc đảm bảo giúp xác nhận đơn hàng nghiêm túc.
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <RotateCcw className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                            <p className="text-[11px] text-gray-600 leading-relaxed">
                              <span className="font-semibold text-gray-800">Hoàn cọc nếu hủy</span> — Đơn bị hủy từ phía Mercy, cọc hoàn trả 100% ngay lập tức.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </button>

                  {/* ── Option 2: Thanh toán full ── */}
                  <button
                    onClick={() => setSelectedPayment("full")}
                    className={`w-full text-left rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                      selectedPayment === "full"
                        ? "border-red-500 shadow-lg shadow-red-500/10"
                        : "border-gray-200 hover:border-red-300"
                    }`}
                  >
                    <div className={`p-4 ${selectedPayment === "full" ? "bg-red-50" : "bg-white"}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          selectedPayment === "full" ? "border-red-500 bg-red-500" : "border-gray-300"
                        }`}>
                          {selectedPayment === "full" && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-gray-900">Thanh toán toàn bộ</h4>
                            <span className="text-[10px] font-bold bg-green-600 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Gift className="w-2.5 h-2.5" /> FREESHIP
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Chuyển khoản <span className="font-bold text-red-600">100%</span> giá trị đơn hàng · <span className="font-semibold text-green-600">Miễn phí ship toàn quốc</span>
                          </p>
                          <div className="mt-3 bg-white rounded-xl p-3 border border-green-100">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Tổng thanh toán</span>
                              <span className="text-lg font-extrabold text-red-600">{formatPrice(displayTotal)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <Truck className="w-3 h-3 text-green-600" />
                              <span className="text-[11px] font-semibold text-green-600">✓ Miễn phí vận chuyển toàn quốc</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <ShieldCheck className="w-3 h-3 text-green-600" />
                              <span className="text-[11px] font-semibold text-green-600">✓ Ưu tiên xử lý đơn hàng nhanh</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:w-[320px] p-5 bg-white border-t lg:border-t-0 lg:border-l border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                  Thông tin đơn hàng
                </h3>

                {/* Cart items */}
                {cart.length > 0 && (
                  <div className="space-y-2 mb-4 max-h-[120px] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-sm">
                        <img src={item.image} alt="" className="w-8 h-8 rounded border border-gray-100 object-cover shrink-0" />
                        <span className="flex-1 truncate text-gray-600 text-xs">{item.name}</span>
                        <span className="text-xs font-medium text-gray-800 whitespace-nowrap">x{item.quantity || 1}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price breakdown */}
                <div className="space-y-2 border-t border-gray-100 pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tổng tiền hàng</span>
                    <span className="font-semibold text-gray-800">{formatPrice(displayTotal)}</span>
                  </div>

                  {selectedPayment === "deposit" ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Cọc đảm bảo (10%)</span>
                        <span className="font-bold text-red-600">{formatPrice(depositAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Trả khi nhận hàng</span>
                        <span className="font-semibold text-gray-600">{formatPrice(remainingCOD)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Phí vận chuyển</span>
                        <span className="font-semibold text-gray-400">Theo khu vực</span>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mt-1">
                        <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                          🔄 Tiền cọc sẽ được <span className="font-bold">hoàn trả 100%</span> khi giao hàng thành công
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Phí vận chuyển</span>
                      <span className="font-semibold text-green-600">Miễn phí</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3 mt-1">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-sm font-bold text-gray-800">Cần thanh toán</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">Chuyển khoản ngay</p>
                      </div>
                      <span className="text-xl font-extrabold text-red-600">{formatPrice(transferAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Note about filling info later */}
                <div className="mt-3 bg-blue-50 rounded-lg p-2.5 border border-blue-100">
                  <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
                    📝 Thông tin giao hàng (tên, SĐT, địa chỉ) sẽ được điền <span className="font-bold">sau khi thanh toán</span>
                  </p>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-2 mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 accent-red-600"
                  />
                  <span className="text-[11px] text-gray-500 leading-relaxed">
                    Bằng việc đặt hàng, bạn đồng ý với{" "}
                    <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a> và{" "}
                    <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a> của Mercy.
                  </span>
                </label>

                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting || !agreeTerms}
                  className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl text-sm active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {submitting
                    ? "Đang xử lý..."
                    : selectedPayment === "deposit"
                      ? `Đặt cọc ${formatPrice(depositAmount)}`
                      : `Thanh toán ${formatPrice(displayTotal)}`
                  }
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* STEP 2: QR Code Payment                                        */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="p-5">
              <div className="max-w-lg mx-auto">
                {/* Payment type indicator */}
                <div className={`rounded-xl p-3 mb-4 text-center ${
                  selectedPayment === "deposit" ? "bg-amber-50 border border-amber-200" : "bg-green-50 border border-green-200"
                }`}>
                  {selectedPayment === "deposit" ? (
                    <p className="text-sm font-semibold text-amber-800">
                      🔒 Chuyển khoản cọc đảm bảo — <span className="text-red-600">{formatPrice(depositAmount)}</span>
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-green-800">
                      ✅ Chuyển khoản toàn bộ — <span className="text-red-600">{formatPrice(displayTotal)}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Quét mã QR hoặc chuyển khoản thủ công theo thông tin bên dưới
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* QR Code */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-3 shadow-lg">
                      <img
                        src={qrUrl}
                        alt="QR Code chuyển khoản"
                        className="w-48 h-48 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          const placeholder = document.getElementById("qr-fallback-v2");
                          if (placeholder) placeholder.style.display = "flex";
                        }}
                      />
                      <div id="qr-fallback-v2" className="hidden flex-col items-center justify-center w-48 h-48 bg-gray-100 rounded-xl">
                        <QrCode className="w-12 h-12 text-gray-300 mb-2" />
                        <p className="text-xs text-gray-400">QR Code</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 text-center">Mở app ngân hàng &amp; quét mã</p>
                  </div>

                  {/* Bank details */}
                  <div className="flex-1 space-y-3">
                    <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                      {[
                        { label: "Ngân hàng", value: bankName, key: "bank" },
                        { label: "Số tài khoản", value: bankAccount, key: "account", mono: true },
                        { label: "Chủ tài khoản", value: accountName, key: "name" },
                        { label: "Số tiền", value: formatPrice(transferAmount), key: "amount", highlight: true },
                        { label: "Nội dung CK", value: transferContent, key: "content" },
                      ].map((row) => (
                        <div key={row.key} className="flex justify-between items-center px-3.5 py-2.5 group">
                          <span className="text-xs text-gray-500">{row.label}</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm text-right ${
                              row.highlight ? "font-extrabold text-red-600 text-base" :
                              row.mono ? "font-semibold text-gray-800 font-mono tracking-wider" :
                              "font-semibold text-gray-800"
                            }`}>
                              {row.value}
                            </span>
                            {(row.key === "account" || row.key === "content") && (
                              <button
                                onClick={() => handleCopy(row.key === "account" ? bankAccount : transferContent, row.key)}
                                className="text-gray-300 hover:text-red-500 transition-colors p-0.5"
                                title="Sao chép"
                              >
                                {copied === row.key ? <CheckCheck className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Deposit refund reminder */}
                    {selectedPayment === "deposit" && (
                      <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                        <div className="flex items-start gap-2">
                          <Shield className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-green-800">Cam kết hoàn tiền cọc</p>
                            <p className="text-[11px] text-green-700 mt-0.5 leading-relaxed">
                              Cọc <strong>{formatPrice(depositAmount)}</strong> hoàn trả 100% khi giao thành công. Còn lại <strong>{formatPrice(remainingCOD)}</strong> trả khi nhận hàng.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirm button / Countdown */}
                {countdownActive ? (
                  <div className="mt-5 flex flex-col items-center gap-3 py-4">
                    {/* Circular countdown */}
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="35" stroke="#e5e7eb" strokeWidth="5" fill="none" />
                        <circle
                          cx="40" cy="40" r="35"
                          stroke="#16a34a"
                          strokeWidth="5"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 35}
                          strokeDashoffset={2 * Math.PI * 35 * (1 - countdownSeconds / countdownTotal)}
                          className="transition-all duration-1000 ease-linear"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-extrabold text-green-600">{countdownSeconds}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-800 flex items-center gap-2 justify-center">
                        <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                        Đang xác nhận giao dịch...
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Vui lòng chờ trong giây lát</p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleConfirmPayment}
                    disabled={submitting}
                    className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl text-sm active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Tôi đã chuyển khoản xong
                  </button>
                )}
                <p className="text-center text-[11px] text-gray-400 mt-2">
                  Bước tiếp theo: Điền thông tin nhận hàng
                </p>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* STEP 3: Success + Customer Info Form                           */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="p-5">
              <div className="max-w-2xl mx-auto">
                {/* Success indicator */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {infoSubmitted ? "Đặt hàng hoàn tất! 🎉" : "Thanh toán thành công! ✅"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {infoSubmitted
                      ? "Kỹ thuật viên sẽ liên hệ qua Zalo trong vòng 30 phút"
                      : "Vui lòng điền thông tin giao hàng để hoàn tất đơn hàng"
                    }
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-5">
                  {/* Left: Customer Info Form / Submitted Info */}
                  <div className="flex-1">
                    {!infoSubmitted ? (
                      <form onSubmit={handleSubmitInfo} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                            <MapPin className="w-3 h-3 text-white" />
                          </div>
                          <h4 className="text-sm font-bold text-gray-900">Thông tin giao hàng</h4>
                          <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">Bắt buộc</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              <User className="w-3 h-3 inline mr-1" />
                              Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Nguyễn Văn A"
                              required
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 focus:bg-white transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              <Phone className="w-3 h-3 inline mr-1" />
                              Số điện thoại Zalo <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                              placeholder="0912 345 678"
                              required
                              minLength={9}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            Địa chỉ nhận hàng <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 focus:bg-white transition-all"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={infoSubmitting || !name.trim() || !phone.trim() || !address.trim()}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                        >
                          {infoSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          {infoSubmitting ? "Đang gửi..." : "Xác nhận thông tin giao hàng"}
                        </button>
                      </form>
                    ) : (
                      /* Show submitted info */
                      <div className="space-y-4">
                        <div className="bg-white rounded-2xl border border-green-200 p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-900">Thông tin giao hàng đã xác nhận</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm text-gray-700"><span className="font-medium">Họ tên:</span> {name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm text-gray-700"><span className="font-medium">Zalo:</span> {phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm text-gray-700"><span className="font-medium">Địa chỉ:</span> {address}</span>
                            </div>
                          </div>
                        </div>

                        {/* Zalo contact */}
                        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                          <p className="text-sm text-blue-800 font-medium mb-2">
                            💬 Liên hệ trực tiếp qua Zalo:
                          </p>
                          <a
                            href="https://zalo.me/0763068614"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-blue-700 transition-all active:scale-95"
                          >
                            Nhắn Zalo ngay
                          </a>
                        </div>

                        <button
                          onClick={() => {
                            clearCart();
                            onClose();
                            navigate("/orders");
                          }}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          📦 Vào Kho Hàng xác nhận đơn
                        </button>
                        <button
                          onClick={() => {
                            clearCart();
                            onClose();
                          }}
                          className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50 transition-all"
                        >
                          Quay lại trang chủ
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right: Order Recap */}
                  <div className="lg:w-[280px] shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Đơn hàng #{orderCode}</h4>

                      {/* Cart items mini */}
                      {cart.length > 0 && (
                        <div className="space-y-2 pb-3 border-b border-gray-100">
                          {cart.map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <img src={item.image} alt="" className="w-8 h-8 rounded border border-gray-100 object-cover shrink-0" />
                              <span className="flex-1 truncate text-xs text-gray-600">{item.name}</span>
                              <span className="text-xs font-medium text-gray-800">x{item.quantity || 1}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Phương thức</span>
                          <span className="font-semibold text-gray-800">
                            {selectedPayment === "deposit" ? "Cọc 10%" : "Thanh toán full"}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Đã chuyển khoản</span>
                          <span className="font-bold text-green-600">{formatPrice(transferAmount)}</span>
                        </div>
                        {selectedPayment === "deposit" && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Trả khi nhận</span>
                            <span className="font-semibold text-gray-800">{formatPrice(remainingCOD)}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-100 pt-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="font-bold text-gray-800">Tổng đơn</span>
                            <span className="font-extrabold text-red-600">{formatPrice(displayTotal)}</span>
                          </div>
                        </div>
                      </div>

                      {selectedPayment === "deposit" && (
                        <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                          <p className="text-[10px] text-green-700 font-medium leading-relaxed">
                            🔄 Cọc {formatPrice(depositAmount)} hoàn trả sau giao hàng thành công
                          </p>
                        </div>
                      )}

                      {/* Trust badges mini */}
                      <div className="pt-2 border-t border-gray-100 space-y-1.5">
                        {[
                          { icon: ShieldCheck, text: "Hàng chính hãng 100%", color: "text-green-600" },
                          { icon: RotateCcw, text: "Đổi trả trong 7 ngày", color: "text-orange-500" },
                          { icon: Truck, text: selectedPayment === "full" ? "Miễn phí vận chuyển" : "Giao hàng toàn quốc", color: "text-blue-600" },
                        ].map(({ icon: Icon, text, color }, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <Icon className={`w-3 h-3 ${color} shrink-0`} />
                            <span className="text-[10px] text-gray-500 font-medium">{text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPopup;
