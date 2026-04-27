import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, History, Loader2, PackageOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { apiGet } from "@/lib/api";

interface OrderItem {
  id: string;
  total: number;
  status: string;
  date: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  joined: string;
  orderList: OrderItem[];
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await apiGet("/admin/customers");
        setCustomers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Chờ xử lý</span>;
      case 'confirmed': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Đã xác nhận</span>;
      case 'shipping': return <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">Đang giao</span>;
      case 'delivered': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Đã giao</span>;
      case 'cancelled': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Đã hủy</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <AdminLayout title="Khách hàng">
      <div className="space-y-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm khách hàng (Tên, Email, SĐT)..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-16 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : filtered.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">Khách hàng</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Liên hệ</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Đơn hàng</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Đã chi</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Ngày tham gia</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                              {c.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-foreground">{c.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          <div className="flex flex-col text-xs">
                            <span className="font-medium text-foreground">{c.phone}</span>
                            <span>{c.email}</span>
                          </div>
                        </td>
                        <td className="p-4 text-foreground font-semibold">{c.orders}</td>
                        <td className="p-4 font-bold text-primary">{c.spent.toLocaleString('vi-VN')}₫</td>
                        <td className="p-4 text-muted-foreground text-xs">{new Date(c.joined).toLocaleDateString('vi-VN')}</td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(c)} className="gap-2">
                            <History className="w-4 h-4" /> Lịch sử
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Users className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">Chưa có khách hàng nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="sm:max-w-[600px] bg-background max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Lịch sử mua hàng của {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              Số điện thoại: {selectedCustomer?.phone} | Mức chi tiêu: <span className="font-bold text-primary">{selectedCustomer?.spent.toLocaleString('vi-VN')}₫</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto mt-4 px-1">
            {selectedCustomer?.orderList && selectedCustomer.orderList.length > 0 ? (
              <div className="space-y-3">
                {selectedCustomer.orderList.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(order => (
                  <div key={order.id} className="p-3 border border-border rounded-lg flex items-center justify-between hover:bg-muted/10 transition-colors">
                    <div>
                      <div className="font-semibold text-sm">Mã ĐH: {order.id}</div>
                      <div className="text-xs text-muted-foreground">{new Date(order.date).toLocaleString('vi-VN')}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="font-bold text-sm">{order.total.toLocaleString('vi-VN')}₫</div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <PackageOpen className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">Người này chưa có đơn hàng nào</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
