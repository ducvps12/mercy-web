import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Package, Users, AlertTriangle, CheckCircle } from "lucide-react";

const notifications: { id: number; type: string; icon: any; title: string; desc: string; time: string; read: boolean }[] = [];

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
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 p-4 transition-colors hover:bg-muted/20 ${!n.read ? "bg-primary/[0.03]" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg[n.type] || "bg-muted"}`}>
                    <n.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}>{n.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.desc}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{n.time}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Bell className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">Không có thông báo</p>
                <p className="text-xs mt-1">Thông báo mới sẽ hiển thị ở đây</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
