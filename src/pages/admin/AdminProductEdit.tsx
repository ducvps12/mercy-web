import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft, Save, Loader2, Plus, Trash2, GripVertical,
  ImageIcon, FileText, Tag, Settings, BarChart3, Link2, Zap, Star, MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPut } from "@/lib/api";
import { formatPrice } from "@/data/products";

interface ImageItem { id?: number; url: string; sortOrder?: number }
interface SpecItem { id?: number; name: string; value: string; sortOrder?: number }
interface VariantItem { id?: number; name: string; isActive: boolean }
interface ReviewItem { id?: number; name: string; avatarLetter?: string; avatarColor?: string; rating: number; date: string; verified: boolean; text: string; helpful: number; imageUrl?: string; isActive?: boolean }

interface ProductDetail {
  id: number;
  productId: string;
  sku: string;
  name: string;
  shortName: string;
  categoryId: number | null;
  categoryName: string;
  price: number;
  originalPrice: number;
  discount: number;
  badge: string;
  rating: number;
  sold: number;
  stock: number;
  brand: string;
  description: string;
  seoTags: string;
  shopeeUrl: string;
  tiktokUrl: string;
  isFlashSale: boolean;
  flashSalePercent: number;
  isActive: boolean;
  images: ImageItem[];
  specs: SpecItem[];
  variants: VariantItem[];
  reviews: ReviewItem[];
}

export default function AdminProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "images" | "specs" | "variants" | "reviews" | "seo">("info");

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await apiGet<ProductDetail>(`/admin/products/${id}`);
      setProduct(data);
    } catch (err: any) {
      toast.error(err.message || "Không thể tải sản phẩm");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!product) return;
    setSaving(true);
    try {
      await apiPut(`/admin/products/${id}`, {
        name: product.name,
        shortName: product.shortName,
        sku: product.sku,
        categoryName: product.categoryName,
        categoryId: product.categoryId,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        badge: product.badge,
        rating: product.rating,
        sold: product.sold,
        stock: product.stock,
        brand: product.brand,
        description: product.description,
        seoTags: product.seoTags,
        shopeeUrl: product.shopeeUrl,
        tiktokUrl: product.tiktokUrl,
        isFlashSale: product.isFlashSale,
        flashSalePercent: product.flashSalePercent,
        isActive: product.isActive,
        images: product.images,
        specs: product.specs,
        variants: product.variants,
        reviews: product.reviews,
      });
      toast.success("Đã lưu thay đổi!");
    } catch (err: any) {
      toast.error(err.message || "Lỗi lưu sản phẩm");
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof ProductDetail, value: any) => {
    if (!product) return;
    setProduct({ ...product, [field]: value });
  };

  // Image helpers
  const addImage = () => {
    if (!product) return;
    setProduct({ ...product, images: [...product.images, { url: "", sortOrder: product.images.length }] });
  };
  const removeImage = (idx: number) => {
    if (!product) return;
    setProduct({ ...product, images: product.images.filter((_, i) => i !== idx) });
  };
  const updateImage = (idx: number, url: string) => {
    if (!product) return;
    const imgs = [...product.images];
    imgs[idx] = { ...imgs[idx], url };
    setProduct({ ...product, images: imgs });
  };

  // Spec helpers
  const addSpec = () => {
    if (!product) return;
    setProduct({ ...product, specs: [...product.specs, { name: "", value: "", sortOrder: product.specs.length }] });
  };
  const removeSpec = (idx: number) => {
    if (!product) return;
    setProduct({ ...product, specs: product.specs.filter((_, i) => i !== idx) });
  };
  const updateSpec = (idx: number, field: "name" | "value", val: string) => {
    if (!product) return;
    const s = [...product.specs];
    s[idx] = { ...s[idx], [field]: val };
    setProduct({ ...product, specs: s });
  };

  // Variant helpers
  const addVariant = () => {
    if (!product) return;
    setProduct({ ...product, variants: [...product.variants, { name: "", isActive: true }] });
  };
  const removeVariant = (idx: number) => {
    if (!product) return;
    setProduct({ ...product, variants: product.variants.filter((_, i) => i !== idx) });
  };
  const updateVariant = (idx: number, field: "name" | "isActive", val: any) => {
    if (!product) return;
    const v = [...product.variants];
    v[idx] = { ...v[idx], [field]: val };
    setProduct({ ...product, variants: v });
  };

  // Review helpers
  const addReview = () => {
    if (!product) return;
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    setProduct({ ...product, reviews: [...product.reviews, { name: "", rating: 5, date: dateStr, verified: true, text: "", helpful: 0, isActive: true }] });
  };
  const removeReview = (idx: number) => {
    if (!product) return;
    setProduct({ ...product, reviews: product.reviews.filter((_, i) => i !== idx) });
  };
  const updateReview = (idx: number, field: keyof ReviewItem, val: any) => {
    if (!product) return;
    const r = [...product.reviews];
    r[idx] = { ...r[idx], [field]: val };
    setProduct({ ...product, reviews: r });
  };

  if (loading) {
    return (
      <AdminLayout title="Đang tải...">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  if (!product) return null;

  const tabs = [
    { id: "info" as const, label: "Thông tin", icon: FileText },
    { id: "images" as const, label: "Hình ảnh", icon: ImageIcon, count: product.images.length },
    { id: "specs" as const, label: "Thông số", icon: Settings, count: product.specs.length },
    { id: "variants" as const, label: "Biến thể", icon: Tag, count: product.variants.length },
    { id: "reviews" as const, label: "Đánh giá", icon: MessageSquare, count: product.reviews.length },
    { id: "seo" as const, label: "SEO & Liên kết", icon: Link2 },
  ];

  const discountPercent = product.originalPrice > 0
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <AdminLayout title="Chỉnh sửa sản phẩm">
      <div className="space-y-4 max-w-[1200px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/products")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-foreground leading-tight">{product.shortName || product.name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">SKU: {product.sku} • ID: {product.productId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-3">
              <Switch
                checked={product.isActive}
                onCheckedChange={(v) => update("isActive", v)}
              />
              <span className="text-sm text-muted-foreground">{product.isActive ? "Đang bán" : "Tạm ẩn"}</span>
            </div>
            <Button onClick={handleSave} disabled={saving} className="gap-2 bg-primary hover:bg-primary/90">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lưu thay đổi
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Giá bán</p>
              <p className="text-lg font-bold text-red-600">{formatPrice(product.price)}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Giá gốc</p>
              <p className="text-lg font-bold text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
              {discountPercent > 0 && <span className="text-xs text-green-600 font-medium">-{discountPercent}%</span>}
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Đã bán</p>
              <p className="text-lg font-bold text-foreground">{product.sold}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Tồn kho</p>
              <p className={`text-lg font-bold ${product.stock < 10 ? "text-red-600" : "text-foreground"}`}>{product.stock}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/50 p-1 rounded-xl overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                ${activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {"count" in tab && tab.count !== undefined && (
                <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "info" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Basic info */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Tên sản phẩm</Label>
                  <Input value={product.name} onChange={(e) => update("name", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Tên ngắn</Label>
                    <Input value={product.shortName} onChange={(e) => update("shortName", e.target.value)} placeholder="Tên viết tắt" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">SKU</Label>
                    <Input value={product.sku} onChange={(e) => update("sku", e.target.value)} className="font-mono" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Danh mục</Label>
                    <Input value={product.categoryName} onChange={(e) => update("categoryName", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Thương hiệu</Label>
                    <Input value={product.brand} onChange={(e) => update("brand", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Badge</Label>
                  <Input value={product.badge} onChange={(e) => update("badge", e.target.value)} placeholder="HOT, MỚI, BESTSELLER..." />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Giá & Kho hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Giá bán (₫)</Label>
                    <Input type="number" value={product.price} onChange={(e) => update("price", Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Giá gốc (₫)</Label>
                    <Input type="number" value={product.originalPrice} onChange={(e) => update("originalPrice", Number(e.target.value))} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Giảm giá (%)</Label>
                    <Input type="number" value={product.discount} onChange={(e) => update("discount", Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Đã bán</Label>
                    <Input type="number" value={product.sold} onChange={(e) => update("sold", Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Tồn kho</Label>
                    <Input type="number" value={product.stock} onChange={(e) => update("stock", Number(e.target.value))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Đánh giá</Label>
                    <Input type="number" step="0.1" min="0" max="5" value={product.rating} onChange={(e) => update("rating", Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5 pt-5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Flash Sale</Label>
                      <Switch checked={product.isFlashSale} onCheckedChange={(v) => update("isFlashSale", v)} />
                    </div>
                    {product.isFlashSale && (
                      <Input type="number" value={product.flashSalePercent} onChange={(e) => update("flashSalePercent", Number(e.target.value))} placeholder="% giảm Flash Sale" className="mt-1" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description (full width) */}
            <Card className="border-border lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Mô tả sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={product.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Nhập mô tả chi tiết sản phẩm..."
                />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "images" && (
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Hình ảnh sản phẩm ({product.images.length})</CardTitle>
              <Button size="sm" variant="outline" onClick={addImage} className="gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Thêm ảnh
              </Button>
            </CardHeader>
            <CardContent>
              {product.images.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Chưa có ảnh nào</p>
                  <Button size="sm" variant="outline" onClick={addImage} className="mt-3 gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Thêm ảnh đầu tiên
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {product.images.map((img, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg border border-border/50 hover:border-border transition-colors group">
                      <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                      <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0 border border-border">
                        {img.url ? (
                          <img src={img.url} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "")} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Input
                          value={img.url}
                          onChange={(e) => updateImage(idx, e.target.value)}
                          placeholder="/products/image.jpg hoặc https://..."
                          className="text-xs h-8"
                        />
                        {idx === 0 && <span className="text-[10px] text-primary font-medium">Ảnh chính</span>}
                      </div>
                      <button onClick={() => removeImage(idx)} className="p-1.5 rounded hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "specs" && (
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Thông số kỹ thuật ({product.specs.length})</CardTitle>
              <Button size="sm" variant="outline" onClick={addSpec} className="gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Thêm thông số
              </Button>
            </CardHeader>
            <CardContent>
              {product.specs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Chưa có thông số nào</p>
                  <Button size="sm" variant="outline" onClick={addSpec} className="mt-3 gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Thêm thông số
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-[40px_1fr_1.5fr_40px] gap-2 text-xs text-muted-foreground font-medium px-1 mb-1">
                    <span>#</span><span>Tên</span><span>Giá trị</span><span></span>
                  </div>
                  {product.specs.map((spec, idx) => (
                    <div key={idx} className="grid grid-cols-[40px_1fr_1.5fr_40px] gap-2 items-center group">
                      <span className="text-xs text-muted-foreground text-center">{idx + 1}</span>
                      <Input
                        value={spec.name}
                        onChange={(e) => updateSpec(idx, "name", e.target.value)}
                        placeholder="Camera, Pin, ..."
                        className="text-xs h-8"
                      />
                      <Input
                        value={spec.value}
                        onChange={(e) => updateSpec(idx, "value", e.target.value)}
                        placeholder="32MP, 270mAh, ..."
                        className="text-xs h-8"
                      />
                      <button onClick={() => removeSpec(idx)} className="p-1.5 rounded hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "variants" && (
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Biến thể sản phẩm ({product.variants.length})</CardTitle>
              <Button size="sm" variant="outline" onClick={addVariant} className="gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Thêm biến thể
              </Button>
            </CardHeader>
            <CardContent>
              {product.variants.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Chưa có biến thể nào</p>
                  <p className="text-xs mt-1">Ví dụ: Đen, Trắng, Combo...</p>
                  <Button size="sm" variant="outline" onClick={addVariant} className="mt-3 gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Thêm biến thể
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {product.variants.map((v, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg border border-border/50 hover:border-border transition-colors group">
                      <Input
                        value={v.name}
                        onChange={(e) => updateVariant(idx, "name", e.target.value)}
                        placeholder="Tên biến thể (Đen, Trắng...)"
                        className="text-sm h-9 flex-1"
                      />
                      <div className="flex items-center gap-2 shrink-0">
                        <Switch
                          checked={v.isActive}
                          onCheckedChange={(val) => updateVariant(idx, "isActive", val)}
                        />
                        <span className="text-xs text-muted-foreground w-10">{v.isActive ? "Bật" : "Tắt"}</span>
                      </div>
                      <button onClick={() => removeVariant(idx)} className="p-1.5 rounded hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "reviews" && (
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Đánh giá sản phẩm ({product.reviews.length})</CardTitle>
              <Button size="sm" variant="outline" onClick={addReview} className="gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Thêm đánh giá
              </Button>
            </CardHeader>
            <CardContent>
              {product.reviews.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Chưa có đánh giá nào</p>
                  <p className="text-xs mt-1">Thêm đánh giá để hiển thị ở trang sản phẩm</p>
                  <Button size="sm" variant="outline" onClick={addReview} className="mt-3 gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Thêm đánh giá
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {product.reviews.map((review, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-border/50 hover:border-border transition-colors group space-y-3">
                      {/* Row 1: Name, Rating, Date */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                          <div className={`w-8 h-8 rounded-full ${review.avatarColor || 'bg-red-500'} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                            {review.avatarLetter || review.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <Input
                            value={review.name}
                            onChange={(e) => updateReview(idx, "name", e.target.value)}
                            placeholder="Tên người đánh giá"
                            className="text-sm h-8 flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => updateReview(idx, "rating", s)}
                              className="p-0 transition-transform hover:scale-110"
                            >
                              <Star className={`w-4 h-4 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                            </button>
                          ))}
                        </div>
                        <Input
                          value={review.date}
                          onChange={(e) => updateReview(idx, "date", e.target.value)}
                          placeholder="DD/MM/YYYY"
                          className="text-xs h-8 w-28"
                        />
                        <div className="flex items-center gap-2 shrink-0">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <Switch
                              checked={review.verified}
                              onCheckedChange={(v) => updateReview(idx, "verified", v)}
                            />
                            <span className="text-[10px] text-muted-foreground">{review.verified ? "✓ Đã mua" : "Chưa xác nhận"}</span>
                          </label>
                        </div>
                        <button onClick={() => removeReview(idx)} className="p-1.5 rounded hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                      {/* Row 2: Review text */}
                      <textarea
                        value={review.text}
                        onChange={(e) => updateReview(idx, "text", e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-border bg-background p-2 text-xs resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Nội dung đánh giá..."
                      />
                      {/* Row 3: Extra fields */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-muted-foreground">👍</span>
                          <Input
                            type="number"
                            value={review.helpful}
                            onChange={(e) => updateReview(idx, "helpful", Number(e.target.value))}
                            className="text-xs h-7 w-16"
                            min={0}
                          />
                        </div>
                        <Input
                          value={review.imageUrl || ''}
                          onChange={(e) => updateReview(idx, "imageUrl", e.target.value)}
                          placeholder="URL ảnh đánh giá (tuỳ chọn)"
                          className="text-xs h-7 flex-1"
                        />
                        <select
                          value={review.avatarColor || 'bg-red-500'}
                          onChange={(e) => updateReview(idx, "avatarColor", e.target.value)}
                          className="text-xs h-7 rounded border border-border bg-background px-1"
                        >
                          <option value="bg-red-500">Đỏ</option>
                          <option value="bg-blue-500">Xanh dương</option>
                          <option value="bg-green-500">Xanh lá</option>
                          <option value="bg-pink-500">Hồng</option>
                          <option value="bg-purple-500">Tím</option>
                          <option value="bg-orange-500">Cam</option>
                          <option value="bg-emerald-500">Ngọc lục</option>
                          <option value="bg-cyan-500">Cyan</option>
                          <option value="bg-teal-500">Teal</option>
                          <option value="bg-indigo-500">Chàm</option>
                          <option value="bg-amber-600">Hổ phách</option>
                          <option value="bg-fuchsia-500">Hồng tím</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "seo" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Liên kết bán hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Link Shopee</Label>
                  <Input value={product.shopeeUrl} onChange={(e) => update("shopeeUrl", e.target.value)} placeholder="https://s.shopee.vn/..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Link TikTok Shop</Label>
                  <Input value={product.tiktokUrl} onChange={(e) => update("tiktokUrl", e.target.value)} placeholder="https://tiktok.com/..." />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">SEO Tags</Label>
                  <textarea
                    value={product.seoTags}
                    onChange={(e) => update("seoTags", e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="kính thông minh, mercy, bluetooth, camera"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bottom save bar */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border -mx-3 md:-mx-4 lg:-mx-6 px-3 md:px-4 lg:px-6 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/admin/products")} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2 bg-primary hover:bg-primary/90 min-w-[140px]">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
