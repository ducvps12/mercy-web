import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Package, Users, AlertTriangle, CheckCircle } from "lucide-react";

const notifications = [
  { id: 1, type: "order", icon: Package, title: "Đơn hàng mới #ORD-128", desc: "Khách hàng Nguyễn Văn A vừa đặt đơn ₫3,200,000", time: "5 phút trước", read: false },
  { id: 2, type: "stock", icon: AlertTriangle, title: "Sắp hết hàng", desc: "Nike Air Max 90 - chỉ còn 3 sản phẩm", time: "30 phút trước", read: false },
  { id: 3, type: "user", icon: Users, title: "Khách hàng mới đăng ký", desc: "Trần Thị B vừa tạo tài khoản", time: "1 giờ trước", read: false },
  { id: 4, type: "order", icon: CheckCircle, title: "Đơn hàng hoàn thành", desc: "Đơn #ORD-125 đã giao thành công", time: "2 giờ trước", read: true },
  { id: 5, type: "order", icon: Package, title: "Đơn hàng mới #ORD-127", desc: "Khách hàng Lê Văn C vừa đặt đơn ₫1,890,000", time: "3 giờ trước", read: true },
  { id: 6, type: "stock", icon: AlertTriangle, title: "Hết hàng", desc: "Jordan 1 Retro High - Size 42 đã hết hàng", time: "5 giờ trước", read: true },
];

const iconBg: Record<string, string> = {
  order: "bg-primary/10 text-primary",
  stock: "bg-destructive/10 text-destructive",
  user: "bg-green-100 text-green-600",
};

export default function AdminNotifications() {
  return (
    <AdminLayout title="Thông báo">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{notifications.filter((n) => !n.read).length} thông báo chưa đọc</p>
          <button className="text-sm text-primary hover:underline">Đánh dấu tất cả đã đọc</button>
        </div>

        <Card className="border-border">
          <CardContent className="p-0 divide-y divide-border">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-4 p-4 transition-colors hover:bg-muted/20 ${!n.read ? "bg-primary/[0.03]" : ""}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg[n.type]}`}>
                  <n.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.read ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}>{n.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.desc}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{n.time}</p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
