import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, Loader2, RefreshCw, Eye, Zap, ArrowRight, ImageIcon, CheckCircle2, AlertCircle, XCircle, Layers } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiDelete, apiPost } from "@/lib/api";
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
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [newestFirst, setNewestFirst] = useState(false);
  const [catSyncLoading, setCatSyncLoading] = useState(false);

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
  const deleteProduct = async (e: React.MouseEvent, id: number, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!useApi) {
      toast.error("Cần kết nối server MySQL để xóa sản phẩm");
      return;
    }
    if (!confirm(`Xác nhận xóa "${name}"?`)) return;
    try {
      await apiDelete(`/admin/products/${id}`);
      toast.success("Đã xóa sản phẩm");
      await loadProducts();
    } catch (err: any) {
      toast.error(err.message || "Lỗi xóa");
    }
  };

  // Sync images
  const handleSyncImages = async () => {
    setSyncLoading(true);
    try {
      const data = await apiPost<any>("/admin/sync-images", { newestFirst });
      setSyncResult(data);
      setSyncDialogOpen(true);
      if (data.fixed > 0) {
        toast.success(`Đã đồng bộ ${data.fixed} sản phẩm`);
        loadProducts();
      } else {
        toast.info("Tất cả ảnh đã đúng, không cần thay đổi");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi đồng bộ ảnh");
    } finally {
      setSyncLoading(false);
    }
  };

  // Sync categories
  const handleSyncCategories = async () => {
    setCatSyncLoading(true);
    try {
      const data = await apiPost<any>("/admin/sync-categories");
      if (data.fixed > 0) {
        toast.success(`Đã đồng bộ ${data.fixed} danh mục`);
      } else {
        toast.info("Danh mục đã đúng, không cần thay đổi");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi đồng bộ danh mục");
    } finally {
      setCatSyncLoading(false);
    }
  };

  return (
    <AdminLayout title="Sản phẩm">
      <div className="space-y-4">
        {/* ═══ Quick link to Flash Sale management ═══ */}
        <button
          onClick={() => navigate("/admin/flash-sale")}
          className="w-full text-left rounded-xl border border-red-200 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 hover:shadow-md hover:-translate-y-0.5 transition-all p-4 flex items-center gap-3 group"
        >
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-sm shrink-0">
            <Zap className="h-5 w-5 text-white fill-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Quản lý Flash Sale</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tạo chiến dịch theo khung giờ, đếm ngược thực, % giảm và sản phẩm tham gia tại trang Flash Sale
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>

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
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={handleSyncCategories} disabled={catSyncLoading || loading} className="gap-2" title="Đồng bộ ảnh bìa danh mục từ sản phẩm">
              {catSyncLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
              <span className="hidden sm:inline">ĐB Danh mục</span>
            </Button>
            <Button variant="outline" onClick={handleSyncImages} disabled={syncLoading || loading} className="gap-2" title="Đồng bộ ảnh kho với sản phẩm theo SKU">
              {syncLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              <span className="hidden sm:inline">ĐB Ảnh</span>
            </Button>
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
                        onClick={(e) => {
                          // Only navigate if click didn't originate from action buttons
                          const target = e.target as HTMLElement;
                          if (target.closest('[data-actions]')) return;
                          useApi && navigate(`/admin/products/${product.id}`);
                        }}
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
                          <div className="flex items-center gap-2" data-actions onClick={(e) => e.stopPropagation()}>
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
                              onClick={(e) => deleteProduct(e, product.id, product.name)}
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

      {/* ═══ Sync Results Dialog ═══ */}
      <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" /> Kết quả đồng bộ ảnh
            </DialogTitle>
          </DialogHeader>
          {syncResult && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-green-50 rounded-lg p-2">
                  <p className="text-xs text-green-600">Đã sửa</p>
                  <p className="text-lg font-bold text-green-700">{syncResult.fixed}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2">
                  <p className="text-xs text-blue-600">Đúng rồi</p>
                  <p className="text-lg font-bold text-blue-700">{syncResult.skipped}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Ảnh trên disk</p>
                  <p className="text-lg font-bold text-gray-700">{syncResult.diskFiles}</p>
                </div>
              </div>
              {/* Detail table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left p-2 font-medium">SKU</th>
                      <th className="text-left p-2 font-medium">Sản phẩm</th>
                      <th className="text-center p-2 font-medium">Trạng thái</th>
                      <th className="text-center p-2 font-medium">Số ảnh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {syncResult.results?.map((r: any, i: number) => (
                      <tr key={i} className={`border-b last:border-0 ${
                        r.status === 'fixed' ? 'bg-green-50/50' : r.status === 'no_files' ? 'bg-yellow-50/50' : ''
                      }`}>
                        <td className="p-2 font-mono text-[11px]">{r.sku}</td>
                        <td className="p-2 truncate max-w-[180px]" title={r.name}>{r.name?.split(' ').slice(0, 4).join(' ')}...</td>
                        <td className="p-2 text-center">
                          {r.status === 'fixed' && <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle2 className="w-3.5 h-3.5" /> Đã sửa</span>}
                          {r.status === 'ok' && <span className="inline-flex items-center gap-1 text-blue-600"><CheckCircle2 className="w-3.5 h-3.5" /> OK</span>}
                          {r.status === 'no_files' && <span className="inline-flex items-center gap-1 text-yellow-600"><AlertCircle className="w-3.5 h-3.5" /> Không có ảnh</span>}
                        </td>
                        <td className="p-2 text-center">
                          {r.status === 'fixed' ? (
                            <span>{r.oldCount} → <span className="font-semibold text-green-600">{r.newCount}</span></span>
                          ) : r.status === 'ok' ? (
                            <span className="text-muted-foreground">{r.newCount}</span>
                          ) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1">
              <input
                type="checkbox"
                id="newestFirst"
                checked={newestFirst}
                onChange={(e) => setNewestFirst(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="newestFirst" className="text-xs text-muted-foreground cursor-pointer">
                Ảnh mới nhất làm ảnh chính
              </label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSyncImages} disabled={syncLoading} className="gap-1.5">
                {syncLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                Đồng bộ lại
              </Button>
              <Button variant="outline" onClick={() => setSyncDialogOpen(false)}>Đóng</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
