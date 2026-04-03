import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const orders = [
  { id: "#ORD-001", customer: "Nguyễn Văn A", date: "01/04/2026", amount: "₫2,450,000", items: 3, status: "Hoàn thành", variant: "default" as const },
  { id: "#ORD-002", customer: "Trần Thị B", date: "01/04/2026", amount: "₫1,890,000", items: 2, status: "Đang giao", variant: "secondary" as const },
  { id: "#ORD-003", customer: "Lê Văn C", date: "31/03/2026", amount: "₫3,200,000", items: 4, status: "Chờ xử lý", variant: "outline" as const },
  { id: "#ORD-004", customer: "Phạm Thị D", date: "31/03/2026", amount: "₫980,000", items: 1, status: "Hoàn thành", variant: "default" as const },
  { id: "#ORD-005", customer: "Hoàng Văn E", date: "30/03/2026", amount: "₫4,100,000", items: 5, status: "Đã hủy", variant: "destructive" as const },
  { id: "#ORD-006", customer: "Đỗ Thị F", date: "30/03/2026", amount: "₫1,650,000", items: 2, status: "Đang giao", variant: "secondary" as const },
];

export default function AdminOrders() {
  return (
    <AdminLayout title="Đơn hàng">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm đơn hàng..." className="pl-9" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Bộ lọc
          </Button>
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-medium text-muted-foreground">Mã đơn</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Khách hàng</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Ngày</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Sản phẩm</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Tổng tiền</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-medium text-foreground">{order.id}</td>
                      <td className="p-4 text-foreground">{order.customer}</td>
                      <td className="p-4 text-muted-foreground">{order.date}</td>
                      <td className="p-4 text-muted-foreground">{order.items} items</td>
                      <td className="p-4 font-medium text-foreground">{order.amount}</td>
                      <td className="p-4">
                        <Badge variant={order.variant}>{order.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
