import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw, Landmark, ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatPrice } from "@/data/products";
import { apiGet } from "@/lib/api";
import { BANK_HISTORY_API_PATH } from "@/lib/config";

interface BankTransaction {
  transactionNumber: number;
  postingDate: number;
  amount: number;
  description: string;
  senderName?: string;
  type: string;
}

export default function AdminBankHistory() {
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await apiGet<{ data?: BankTransaction[] }>(BANK_HISTORY_API_PATH);
      if (data.data && Array.isArray(data.data)) {
        setTransactions(data.data);
      } else {
        toast.error("Format data không đúng");
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải lịch sử nạp tiền");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <AdminLayout title="Lịch sử giao dịch ACB">
      <div className="flex flex-col gap-6 p-1 md:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Landmark className="w-6 h-6 text-primary" /> Lịch sử nạp tiền ACB
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Tra cứu biến động số dư theo thời gian thực</p>
          </div>
          <Button onClick={fetchHistory} disabled={loading} variant="outline" className="gap-2 shrink-0">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Làm mới dữ liệu
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Đang kết nối API ngân hàng...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                <ArrowDownToLine className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p>Chưa có giao dịch mới.</p>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary text-secondary-foreground text-xs uppercase">
                    <tr>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Thời gian (ACB)</th>
                      <th className="px-6 py-4 font-semibold">Mã GD</th>
                      <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Biến động</th>
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Người chuyển</th>
                      <th className="px-6 py-4 font-semibold w-full">Nội dung chuyển khoản</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {transactions.map((t, idx) => (
                      <tr key={idx} className="hover:bg-secondary/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                          {new Date(t.postingDate).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                          })}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{t.transactionNumber || '-'}</td>
                        <td className="px-6 py-4 text-right font-bold text-green-600 whitespace-nowrap">
                          +{formatPrice(t.amount)}đ
                        </td>
                        <td className="px-6 py-4 font-medium">{t.senderName || "Không ghi/Ẩn danh"}</td>
                        <td className="px-6 py-4 text-muted-foreground leading-relaxed">{t.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
