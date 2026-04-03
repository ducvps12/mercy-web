import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

const products = [
  { id: 1, name: "Nike Air Max 90", category: "Giày", price: "₫3,200,000", stock: 45, image: "/placeholder.svg" },
  { id: 2, name: "Adidas Ultraboost 22", category: "Giày", price: "₫4,100,000", stock: 32, image: "/placeholder.svg" },
  { id: 3, name: "Jordan 1 Retro High", category: "Giày", price: "₫5,500,000", stock: 18, image: "/placeholder.svg" },
  { id: 4, name: "New Balance 550", category: "Giày", price: "₫2,800,000", stock: 56, image: "/placeholder.svg" },
  { id: 5, name: "Converse Chuck 70", category: "Giày", price: "₫1,900,000", stock: 72, image: "/placeholder.svg" },
];

export default function AdminProducts() {
  return (
    <AdminLayout title="Sản phẩm">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm sản phẩm..." className="pl-9" />
          </div>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Thêm sản phẩm
          </Button>
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-medium text-muted-foreground">Sản phẩm</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Danh mục</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Giá</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Tồn kho</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden">
                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="font-medium text-foreground">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{product.category}</td>
                      <td className="p-4 font-medium text-foreground">{product.price}</td>
                      <td className="p-4">
                        <span className={`text-sm font-medium ${product.stock < 20 ? "text-destructive" : "text-green-600"}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded hover:bg-muted transition-colors">
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-destructive/10 transition-colors">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
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
