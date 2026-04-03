import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";

const posts = [
  { id: 1, title: "Xu hướng giày sneaker 2026", category: "Xu hướng", status: "Đã xuất bản", date: "01/04/2026", views: 1240 },
  { id: 2, title: "Cách phối đồ với giày thể thao", category: "Hướng dẫn", status: "Đã xuất bản", date: "28/03/2026", views: 890 },
  { id: 3, title: "Top 10 đôi giày bán chạy tháng 3", category: "Đánh giá", status: "Bản nháp", date: "25/03/2026", views: 0 },
  { id: 4, title: "Nike Air Max Day 2026 - Tổng hợp", category: "Sự kiện", status: "Đã xuất bản", date: "20/03/2026", views: 2100 },
  { id: 5, title: "Bảo quản giày da đúng cách", category: "Hướng dẫn", status: "Bản nháp", date: "18/03/2026", views: 0 },
];

const statusVariant = (s: string) => s === "Đã xuất bản" ? "default" as const : "outline" as const;

export default function AdminPosts() {
  return (
    <AdminLayout title="Bài viết">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm bài viết..." className="pl-9" />
          </div>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Viết bài mới
          </Button>
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-medium text-muted-foreground">Tiêu đề</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Danh mục</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Trạng thái</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Ngày tạo</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Lượt xem</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-medium text-foreground max-w-[250px] truncate">{post.title}</td>
                      <td className="p-4 text-muted-foreground">{post.category}</td>
                      <td className="p-4"><Badge variant={statusVariant(post.status)}>{post.status}</Badge></td>
                      <td className="p-4 text-muted-foreground">{post.date}</td>
                      <td className="p-4 text-foreground flex items-center gap-1"><Eye className="h-3 w-3 text-muted-foreground" />{post.views.toLocaleString()}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded hover:bg-muted transition-colors"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                          <button className="p-1.5 rounded hover:bg-destructive/10 transition-colors"><Trash2 className="h-4 w-4 text-destructive" /></button>
                        </div>
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
