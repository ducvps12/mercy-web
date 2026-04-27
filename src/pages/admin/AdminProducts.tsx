import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, Trash2, Loader2, RefreshCw, Eye } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiDelete } from "@/lib/api";
import { formatPrice } from "@/data/products";

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  originalPrice: number | null;
  description: string;
  category: string;
  image: string;
  images: string;
  sold?: number;
  stock?: number;
  isActive?: boolean;
}

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [useApi, setUseApi] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await apiGet<Product[]>("/admin/products");
      setProducts(data);
      setUseApi(true);
    } catch (err: any) {
      toast.error(err.message || "Không thể tải danh sách sản phẩm");
      setProducts([]);
      setUseApi(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete
  const deleteProduct = async (id: number, name: string) => {
    if (!useApi) {
      toast.error("Cần kết nối server MySQL để xóa sản phẩm");
      return;
    }
    if (!confirm(`Xác nhận xóa "${name}"?`)) return;
    try {
      await apiDelete(`/admin/products/${id}`);
      await loadProducts();
      toast.success("Đã xóa sản phẩm");
    } catch (err: any) {
      toast.error(err.message || "Lỗi xóa");
    }
  };

  return (
    <AdminLayout title="Sản phẩm">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm sản phẩm..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadProducts} disabled={loading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate("/admin/products/new")}>
              <Plus className="h-4 w-4" /> Thêm sản phẩm
            </Button>
          </div>
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">Sản phẩm</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Danh mục</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Giá bán</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Giá gốc</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">SKU</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                        onClick={() => useApi && navigate(`/admin/products/${product.id}`)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                              {product.image && <img src={product.image} alt="" className="w-full h-full object-cover" />}
                            </div>
                            <span className="font-medium text-foreground text-xs leading-tight line-clamp-2 max-w-[200px]">{product.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground text-xs">{product.category}</td>
                        <td className="p-4 font-medium text-red-600 text-xs">{formatPrice(product.price)}</td>
                        <td className="p-4 text-muted-foreground text-xs line-through">{product.originalPrice ? formatPrice(product.originalPrice) : "—"}</td>
                        <td className="p-4 text-muted-foreground text-xs font-mono">{product.sku}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => navigate(`/admin/products/${product.id}`)}
                              className="p-1.5 rounded hover:bg-primary/10 transition-colors"
                              title="Chỉnh sửa chi tiết"
                            >
                              <Edit className="h-4 w-4 text-primary" />
                            </button>
                            <button
                              onClick={() => window.open(`/product/${product.sku}`, "_blank")}
                              className="p-1.5 rounded hover:bg-muted transition-colors"
                              title="Xem trang sản phẩm"
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id, product.name)}
                              className="p-1.5 rounded hover:bg-destructive/10 transition-colors"
                              title="Xóa sản phẩm"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground text-center">
          {useApi ? "📊" : "📁"} {useApi ? "Dữ liệu từ MySQL" : "Đang dùng catalog tĩnh (server chưa kết nối)"} • {filteredProducts.length} sản phẩm
        </p>
      </div>
    </AdminLayout>
  );
}
