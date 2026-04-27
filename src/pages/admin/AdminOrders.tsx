import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, PackageOpen, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiGet, apiPut } from "@/lib/api";

interface Order {
  id: number;
  orderCode: string;
  userId: number | null;
  total: number;
  status: string;
  paymentMethod: string;
  refCode: string | null;
  affiliateCode: string | null;
  bankVerified: boolean;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "Chờ xác nhận", variant: "outline" },
  confirmed: { label: "Đã xác nhận", variant: "default" },
  shipping: { label: "Đang giao", variant: "secondary" },
  delivered: { label: "Hoàn thành", variant: "default" },
  cancelled: { label: "Đã hủy (Chưa hoàn tiền)", variant: "destructive" },
  refunded: { label: "Đã hủy & Hoàn tiền", variant: "destructive" },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await apiGet<Order[]>("/admin/orders");
      setOrders(data);
    } catch (err: any) {
      toast.error(err.message || "Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await apiPut(`/admin/orders/${id}/status`, { status });
      await loadOrders();
      toast.success("Đã cập nhật trạng thái");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (n: number) =>
    "₫" + n.toLocaleString("vi-VN");

  return (
    <AdminLayout title="Đơn hàng">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm mã đơn hàng..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={loadOrders} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Làm mới
          </Button>
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">Mã đơn</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Tổng tiền</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Thanh toán</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Trạng thái</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Bank</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Ref</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Ngày đặt</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const sc = statusConfig[order.status] || { label: order.status, variant: "outline" as const };
                      return (
                        <tr key={order.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="p-4 font-mono font-medium text-foreground">{order.orderCode}</td>
                          <td className="p-4 font-medium text-foreground">{formatPrice(order.total)}</td>
                          <td className="p-4">
                            {order.paymentMethod === 'deposit' ? (
                              <Badge variant="outline" className="text-purple-600 bg-purple-50 border-purple-200">Cọc 10%</Badge>
                            ) : order.paymentMethod === 'full' ? (
                              <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Toàn bộ</Badge>
                            ) : order.paymentMethod === 'cod' ? (
                              <Badge variant="outline" className="text-orange-600 bg-orange-50 border-orange-200">COD</Badge>
                            ) : (
                              <Badge variant="outline">{order.paymentMethod}</Badge>
                            )}
                          </td>
                          <td className="p-4">
                            <Badge variant={sc.variant}>{sc.label}</Badge>
                          </td>
                          <td className="p-4">
                            {order.bankVerified ? (
                              <span className="text-green-600 text-xs font-medium">✅ Verified</span>
                            ) : (
                              <span className="text-muted-foreground text-xs">Chưa xác nhận</span>
                            )}
                          </td>
                          <td className="p-4 text-muted-foreground text-xs">
                            {order.affiliateCode || "—"}
                          </td>
                          <td className="p-4 text-muted-foreground text-xs">
                            {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="p-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus(order.id, e.target.value)}
                              className="text-xs border border-border rounded px-2 py-1 bg-background"
                            >
                              <option value="pending">Chờ xác nhận</option>
                              <option value="confirmed">Đã xác nhận (Đã thu tiền)</option>
                              <option value="shipping">Đang giao hàng</option>
                              <option value="delivered">Đã giao hoàn thành</option>
                              <option value="cancelled">Đã hủy (Chưa hoàn tiền)</option>
                              <option value="refunded">Đã hủy & Đã hoàn tiền</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <PackageOpen className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">Chưa có đơn hàng nào</p>
                <p className="text-xs mt-1">Đơn hàng từ checkout sẽ hiển thị ở đây</p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          📊 Dữ liệu từ MySQL ({orders.length} đơn hàng)
        </p>
      </div>
    </AdminLayout>
  );
}
