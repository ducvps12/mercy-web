import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft, Save, Loader2, Plus, Trash2, GripVertical,
  ImageIcon, FileText, Tag, Settings, BarChart3, Link2, Zap, Star, MessageSquare,
  FolderOpen, Search, CheckSquare, Square, Filter, Play,
} from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPut, apiPost, API_BASE } from "@/lib/api";
import { formatPrice } from "@/data/products";
import { productDropdown } from "@/data/navigation";

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
  youtubeUrl: string;
  isFlashSale: boolean;
  flashSalePercent: number;
  isActive: boolean;
  featuresVn?: string;
  featuresEn?: string;
  footerInfo?: string;
  productionYear?: number;
  clearancePrice?: number;
  dailySalePrice?: number;
  campaignPrice?: number;
  offPlatformPrice?: number;
  warrantyData?: string;
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

  // Media picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerMode, setMediaPickerMode] = useState<"replace" | "add">("add");
  const [mediaPickerIndex, setMediaPickerIndex] = useState<number>(-1);
  const [mediaFiles, setMediaFiles] = useState<{filename:string;url:string;size:number;group:string;type:string}[]>([]);
  const [mediaGroups, setMediaGroups] = useState<string[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaFilterGroup, setMediaFilterGroup] = useState("all");
  const [mediaSelected, setMediaSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      if (id === "new") {
        setProduct({
          id: 0,
          productId: "",
          sku: "",
          name: "",
          shortName: "",
          categoryId: null,
          categoryName: "",
          price: 0,
          originalPrice: 0,
          discount: 0,
          badge: "",
          rating: 5,
          sold: 0,
          stock: 100,
          brand: "Mercy Tech Global",
          description: "",
          seoTags: "",
          shopeeUrl: "",
          tiktokUrl: "",
          youtubeUrl: "",
          isFlashSale: false,
          flashSalePercent: 0,
          isActive: true,
          featuresVn: "",
          featuresEn: "",
          footerInfo: "",
          productionYear: new Date().getFullYear(),
          clearancePrice: 0,
          dailySalePrice: 0,
          campaignPrice: 0,
          offPlatformPrice: 0,
          warrantyData: "",
          images: [],
          specs: [],
          variants: [],
          reviews: []
        });
      } else {
        const data = await apiGet<ProductDetail>(`/admin/products/${id}`);
        setProduct(data);
      }
    } catch (err: any) {
      toast.error(err.message || "Không thể tải sản phẩm");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!product) return;

    if (!product.name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return;
    }

    setSaving(true);
    try {
      const payload = {
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
        youtubeUrl: product.youtubeUrl,
        isFlashSale: product.isFlashSale,
        flashSalePercent: product.flashSalePercent,
        isActive: product.isActive,
        featuresVn: product.featuresVn,
        featuresEn: product.featuresEn,
        footerInfo: product.footerInfo,
        productionYear: product.productionYear,
        clearancePrice: product.clearancePrice,
        dailySalePrice: product.dailySalePrice,
        campaignPrice: product.campaignPrice,
        offPlatformPrice: product.offPlatformPrice,
        warrantyData: product.warrantyData,
        images: product.images,
        specs: product.specs,
        variants: product.variants,
        reviews: product.reviews,
      };

      if (id === "new") {
        const res = await apiPost("/admin/products", payload);
        toast.success("Đã tạo sản phẩm thành công!");
        navigate(`/admin/products/${res.id}`, { replace: true });
        // update url without keeping "new" in history
      } else {
        await apiPut(`/admin/products/${id}`, payload);
        toast.success("Đã lưu thay đổi!");
      }
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

  // Media picker helpers
  const loadMediaFiles = useCallback(async () => {
    setMediaLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string,string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/media/list`, { headers });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMediaFiles(data.files || []);
      setMediaGroups(data.groups || []);
    } catch { toast.error("Lỗi tải kho ảnh"); }
    finally { setMediaLoading(false); }
  }, []);

  const openMediaPicker = (mode: "replace" | "add", index = -1) => {
    setMediaPickerMode(mode);
    setMediaPickerIndex(index);
    setMediaSelected(new Set());
    setMediaSearch("");
    setMediaFilterGroup("all");
    setMediaPickerOpen(true);
    if (mediaFiles.length === 0) loadMediaFiles();
  };

  const confirmMediaPicker = () => {
    if (!product) return;
    const urls = Array.from(mediaSelected);
    if (urls.length === 0) { toast.error("Chưa chọn ảnh nào"); return; }
    if (mediaPickerMode === "replace" && mediaPickerIndex >= 0) {
      // Replace single image
      const imgs = [...product.images];
      imgs[mediaPickerIndex] = { ...imgs[mediaPickerIndex], url: urls[0] };
      setProduct({ ...product, images: imgs });
    } else {
      // Add multiple images
      const newImgs = urls.map((url, i) => ({ url, sortOrder: product.images.length + i }));
      setProduct({ ...product, images: [...product.images, ...newImgs] });
    }
    setMediaPickerOpen(false);
    toast.success(`Đã ${mediaPickerMode === "replace" ? "thay" : "thêm"} ${urls.length} ảnh`);
  };

  const toggleMediaSelect = (url: string) => {
    const s = new Set(mediaSelected);
    if (mediaPickerMode === "replace") {
      // Single select for replace
      s.clear(); s.add(url);
    } else {
      if (s.has(url)) s.delete(url); else s.add(url);
    }
    setMediaSelected(s);
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
                    <select
                      value={product.categoryName}
                      onChange={(e) => update("categoryName", e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Chọn danh mục...</option>
                      {productDropdown.map((cat) => (
                        <optgroup key={cat.title} label={cat.title}>
                          <option value={cat.title}>{cat.title}</option>
                          {cat.items.map((item) => (
                            <option key={item.name} value={item.name}>--- {item.name}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
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
                
                {/* Advanced Pricing */}
                <div className="pt-5 border-t border-border mt-5">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3">Mở rộng (Hệ thống giá phụ)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Xả hàng (₫)</Label>
                      <Input type="number" value={product.clearancePrice || 0} onChange={(e) => update("clearancePrice", Number(e.target.value))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Sale Daily (₫)</Label>
                      <Input type="number" value={product.dailySalePrice || 0} onChange={(e) => update("dailySalePrice", Number(e.target.value))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Campaign (₫)</Label>
                      <Input type="number" value={product.campaignPrice || 0} onChange={(e) => update("campaignPrice", Number(e.target.value))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Ngoại Sàn (₫)</Label>
                      <Input type="number" value={product.offPlatformPrice || 0} onChange={(e) => update("offPlatformPrice", Number(e.target.value))} />
                    </div>
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

            {/* Features (VN & EN) */}
            <Card className="border-border lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Tính năng (VN & EN)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Tính năng Tiếng Việt</Label>
                  <textarea
                    value={product.featuresVn || ""}
                    onChange={(e) => update("featuresVn", e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Mỗi tính năng 1 dòng..."
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Tính năng Tiếng Anh (Tùy chọn)</Label>
                  <textarea
                    value={product.featuresEn || ""}
                    onChange={(e) => update("featuresEn", e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Each feature on a new line..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Footer Rules & Warranty Details */}
            <Card className="border-border lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Chính sách & Chân trang</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium mb-1.5 block">Chính sách chân trang</Label>
                    <textarea
                      value={product.footerInfo || ""}
                      onChange={(e) => update("footerInfo", e.target.value)}
                      rows={5}
                      className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Thông tin chung ở chân trạng, ví dụ: 'Bản quyền...', 'Hotline...'"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium mb-1.5 block">Dữ liệu bảo hành (Warranty Packages)</Label>
                    <textarea
                      value={product.warrantyData || ""}
                      onChange={(e) => update("warrantyData", e.target.value)}
                      rows={5}
                      className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Nhập ghi chú gói bảo hành cụ thể cho sản phẩm, vd: BH 3 T: 550k"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "images" && (
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Hình ảnh sản phẩm ({product.images.length})</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openMediaPicker("add")} className="gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5" /> Chọn từ kho
                </Button>
                <Button size="sm" variant="outline" onClick={addImage} className="gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Thêm thủ công
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {product.images.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Chưa có ảnh nào</p>
                  <div className="flex gap-2 justify-center mt-3">
                    <Button size="sm" variant="outline" onClick={() => openMediaPicker("add")} className="gap-1.5">
                      <FolderOpen className="w-3.5 h-3.5" /> Chọn từ kho ảnh
                    </Button>
                    <Button size="sm" variant="ghost" onClick={addImage} className="gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> Nhập URL thủ công
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {product.images.map((img, idx) => (
                    <div key={idx} className={`flex items-center gap-3 p-2 rounded-lg border transition-colors group ${
                      idx === 0 ? 'border-primary/30 bg-primary/5' : 'border-border/50 hover:border-border'
                    }`}>
                      <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                      <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0 border border-border relative">
                        {img.url ? (
                          <img src={img.url} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "")} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                        {idx === 0 && (
                          <div className="absolute top-0.5 left-0.5 bg-primary text-white text-[8px] font-bold px-1 rounded">★</div>
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
                      {/* Set as main image */}
                      {idx !== 0 && (
                        <button
                          onClick={() => {
                            const imgs = [...product.images];
                            const [moved] = imgs.splice(idx, 1);
                            imgs.unshift(moved);
                            setProduct({ ...product, images: imgs });
                          }}
                          className="p-1.5 rounded hover:bg-amber-100 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Đặt làm ảnh chính"
                        >
                          <Star className="w-4 h-4 text-amber-500" />
                        </button>
                      )}
                      <button onClick={() => openMediaPicker("replace", idx)} className="p-1.5 rounded hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" title="Chọn từ kho">
                        <FolderOpen className="w-4 h-4 text-primary" />
                      </button>
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
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Video YouTube
                  </Label>
                  <Input value={product.youtubeUrl} onChange={(e) => update("youtubeUrl", e.target.value)} placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..." />
                  <p className="text-[10px] text-muted-foreground">Nhập link YouTube — video sẽ được nhúng trên trang chi tiết sản phẩm</p>
                  {product.youtubeUrl && (() => {
                    const url = product.youtubeUrl;
                    let videoId = '';
                    try {
                      if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split(/[?&#]/)[0] || '';
                      else if (url.includes('youtube.com/watch')) videoId = new URL(url).searchParams.get('v') || '';
                      else if (url.includes('youtube.com/embed/')) videoId = url.split('youtube.com/embed/')[1]?.split(/[?&#]/)[0] || '';
                    } catch {}
                    if (!videoId) return null;
                    return (
                      <div className="mt-2 rounded-lg overflow-hidden border border-border aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                          title="YouTube preview"
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    );
                  })()}
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

      {/* ═══ Media Picker Dialog ═══ */}
      <Dialog open={mediaPickerOpen} onOpenChange={setMediaPickerOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              {mediaPickerMode === "replace" ? "Chọn media thay thế" : "Chọn media từ kho"}
              {mediaSelected.size > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Đã chọn {mediaSelected.size}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* Toolbar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input value={mediaSearch} onChange={e => setMediaSearch(e.target.value)}
                placeholder="Tìm ảnh..." className="pl-8 h-8 text-xs" />
            </div>
            <select value={mediaFilterGroup} onChange={e => setMediaFilterGroup(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <option value="all">Tất cả</option>
              {mediaGroups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto min-h-0 -mx-1 px-1">
            {mediaLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (() => {
              const filteredMedia = mediaFiles.filter(f => {
                if (mediaFilterGroup !== "all" && f.group !== mediaFilterGroup) return false;
                if (mediaSearch && !f.filename.toLowerCase().includes(mediaSearch.toLowerCase())) return false;
                return true;
              });
              if (filteredMedia.length === 0) return (
                <div className="text-center py-16 text-muted-foreground">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Không tìm thấy ảnh</p>
                </div>
              );
              return (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 py-2">
                  {filteredMedia.map(file => {
                    const isSelected = mediaSelected.has(file.url);
                    return (
                      <div key={file.filename}
                        className={`relative rounded-lg border overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? "ring-2 ring-primary border-primary" : "border-border hover:border-primary/40"
                        }`}
                        onClick={() => toggleMediaSelect(file.url)}>
                        <div className="absolute top-1 left-1 z-10">
                          {isSelected
                            ? <CheckSquare className="w-4 h-4 text-primary drop-shadow" />
                            : <Square className="w-4 h-4 text-white/70 drop-shadow" />}
                        </div>
                        <div className="aspect-square bg-muted/50 overflow-hidden relative">
                          {file.type === 'video' ? (
                            <>
                              <video src={file.url} className="w-full h-full object-cover" muted preload="metadata" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow">
                                  <Play className="w-3 h-3 text-gray-800 ml-0.5" />
                                </div>
                              </div>
                              <div className="absolute top-0.5 right-0.5">
                                <span className="text-[7px] font-bold text-white bg-blue-600 px-1 py-0.5 rounded">VIDEO</span>
                              </div>
                            </>
                          ) : (
                            <img src={file.url} alt={file.filename} loading="lazy"
                              className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="p-1.5 bg-background">
                          <p className="text-[10px] font-medium truncate" title={file.filename}>{file.filename}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMediaPickerOpen(false)}>Hủy</Button>
            <Button onClick={confirmMediaPicker} disabled={mediaSelected.size === 0} className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              {mediaPickerMode === "replace"
                ? "Thay ảnh"
                : `Thêm ${mediaSelected.size} ảnh`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
