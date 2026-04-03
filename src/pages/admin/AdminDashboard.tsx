import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const stats = [
  { label: "Doanh thu", value: "₫128.5M", change: "+12.5%", up: true, icon: DollarSign },
  { label: "Đơn hàng", value: "1,284", change: "+8.2%", up: true, icon: ShoppingCart },
  { label: "Khách hàng", value: "3,542", change: "+15.3%", up: true, icon: Users },
  { label: "Tỷ lệ chuyển đổi", value: "3.24%", change: "-0.4%", up: false, icon: TrendingUp },
];

const revenueData = [
  { name: "T1", value: 65 },
  { name: "T2", value: 78 },
  { name: "T3", value: 90 },
  { name: "T4", value: 81 },
  { name: "T5", value: 95 },
  { name: "T6", value: 110 },
  { name: "T7", value: 128 },
];

const categoryData = [
  { name: "Giày", value: 45 },
  { name: "Áo", value: 32 },
  { name: "Quần", value: 28 },
  { name: "Phụ kiện", value: 18 },
  { name: "Túi", value: 12 },
];

const recentOrders = [
  { id: "#ORD-001", customer: "Nguyễn Văn A", amount: "₫2,450,000", status: "Hoàn thành", statusColor: "bg-green-100 text-green-700" },
  { id: "#ORD-002", customer: "Trần Thị B", amount: "₫1,890,000", status: "Đang giao", statusColor: "bg-blue-100 text-blue-700" },
  { id: "#ORD-003", customer: "Lê Văn C", amount: "₫3,200,000", status: "Chờ xử lý", statusColor: "bg-yellow-100 text-yellow-700" },
  { id: "#ORD-004", customer: "Phạm Thị D", amount: "₫980,000", status: "Hoàn thành", statusColor: "bg-green-100 text-green-700" },
  { id: "#ORD-005", customer: "Hoàng Văn E", amount: "₫4,100,000", status: "Đã hủy", statusColor: "bg-red-100 text-red-700" },
];

const topProducts = [
  { name: "Nike Air Max 90", sold: 128, revenue: "₫25.6M" },
  { name: "Adidas Ultraboost", sold: 96, revenue: "₫19.2M" },
  { name: "Jordan 1 Retro", sold: 84, revenue: "₫33.6M" },
  { name: "New Balance 550", sold: 72, revenue: "₫14.4M" },
];

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-4 md:space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-3 md:p-5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <span
                    className={`flex items-center gap-0.5 text-[10px] md:text-xs font-medium ${
                      stat.up ? "text-green-600" : "text-destructive"
                    }`}
                  >
                    {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.change}
                  </span>
                </div>
                <div className="mt-2 md:mt-3">
                  <p className="text-lg md:text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          <Card className="lg:col-span-2 border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Doanh thu theo tháng</CardTitle>
              <button className="p-1 hover:bg-muted rounded">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(36, 82%, 52%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(36, 82%, 52%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(220, 10%, 46%)" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(220, 10%, 46%)" }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(36, 82%, 52%)"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Danh mục bán chạy</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} width={60} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(36, 82%, 52%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Đơn hàng gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left py-3 font-medium">Mã đơn</th>
                      <th className="text-left py-3 font-medium">Khách hàng</th>
                      <th className="text-left py-3 font-medium">Số tiền</th>
                      <th className="text-left py-3 font-medium">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 font-medium text-foreground">{order.id}</td>
                        <td className="py-3 text-foreground">{order.customer}</td>
                        <td className="py-3 text-foreground">{order.amount}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Sản phẩm bán chạy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, i) => (
                  <div key={product.name} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sold} đã bán</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{product.revenue}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
