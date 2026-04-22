import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";

const visitData: { name: string; visits: number; orders: number }[] = [];
const sourceData: { name: string; value: number }[] = [];
const COLORS = ["hsl(220, 70%, 55%)", "hsl(0, 0%, 15%)", "hsl(36, 82%, 52%)", "hsl(15, 90%, 55%)", "hsl(210, 70%, 50%)"];

export default function AdminAnalytics() {
  return (
    <AdminLayout title="Thống kê">
      <div className="space-y-4">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Lượt truy cập & Đơn hàng (14 ngày)</CardTitle>
          </CardHeader>
          <CardContent>
            {visitData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={visitData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" stroke="hsl(0, 72%, 51%)" strokeWidth={2} name="Lượt truy cập" />
                  <Line type="monotone" dataKey="orders" stroke="hsl(220, 30%, 18%)" strokeWidth={2} name="Đơn hàng" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[320px] text-muted-foreground">
                <BarChart3 className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">Chưa có dữ liệu truy cập</p>
                <p className="text-xs mt-1">Cần tích hợp analytics để theo dõi</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Nguồn truy cập</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {sourceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={sourceData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {sourceData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[260px] text-muted-foreground">
                  <BarChart3 className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">Chưa có dữ liệu</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Tóm tắt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Tổng lượt truy cập", value: "—" },
                { label: "Tổng đơn hàng", value: "0" },
                { label: "Doanh thu tháng", value: "₫0" },
                { label: "Sản phẩm bán chạy nhất", value: "—" },
                { label: "Thời gian TB trên trang", value: "—" },
                { label: "Tỷ lệ thoát", value: "—" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
