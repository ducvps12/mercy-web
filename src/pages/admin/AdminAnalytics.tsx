import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const visitData = Array.from({ length: 14 }, (_, i) => ({
  name: `${i + 1}/03`,
  visits: Math.floor(Math.random() * 500 + 200),
  orders: Math.floor(Math.random() * 50 + 10),
}));

const sourceData = [
  { name: "Trực tiếp", value: 40 },
  { name: "Google", value: 30 },
  { name: "Facebook", value: 20 },
  { name: "Khác", value: 10 },
];

const COLORS = ["hsl(36, 82%, 52%)", "hsl(220, 30%, 18%)", "hsl(220, 10%, 60%)", "hsl(36, 90%, 60%)"];

export default function AdminAnalytics() {
  return (
    <AdminLayout title="Thống kê">
      <div className="space-y-4">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Lượt truy cập & Đơn hàng (14 ngày)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="hsl(36, 82%, 52%)" strokeWidth={2} name="Lượt truy cập" />
                <Line type="monotone" dataKey="orders" stroke="hsl(220, 30%, 18%)" strokeWidth={2} name="Đơn hàng" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Nguồn truy cập</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
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
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Tóm tắt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Tổng lượt truy cập", value: "12,480" },
                { label: "Tổng đơn hàng", value: "486" },
                { label: "Tỷ lệ thoát", value: "38.2%" },
                { label: "Thời gian trung bình", value: "4m 32s" },
                { label: "Trang/phiên", value: "3.8" },
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
