import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";

const customers: { id: number; name: string; email: string; orders: number; spent: string; joined: string }[] = [];

export default function AdminCustomers() {
  return (
    <AdminLayout title="Khách hàng">
      <div className="space-y-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm khách hàng..." className="pl-9" />
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            {customers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">Khách hàng</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Đơn hàng</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Đã chi</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Ngày tham gia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                              {c.name.charAt(0)}
                            </div>
                            <span className="font-medium text-foreground">{c.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{c.email}</td>
                        <td className="p-4 text-foreground">{c.orders}</td>
                        <td className="p-4 font-medium text-foreground">{c.spent}</td>
                        <td className="p-4 text-muted-foreground">{c.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Users className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">Chưa có khách hàng nào</p>
                <p className="text-xs mt-1">Khách hàng đăng ký sẽ hiển thị ở đây</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
