import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, GripVertical, Image as ImageIcon, Megaphone, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";

/* ═══════════════════════════════════════════
   Types & storage helpers
   ═══════════════════════════════════════════ */
export interface BannerItem {
  id: number;
  image: string;
  alt: string;
  link: string;
}

// ── Hero banner (single top banner) ──
const HERO_STORAGE_KEY = "mercy_hero_banner";
const defaultHero: BannerItem = {
  id: 1,
  image: "/banner2/img.png",
  alt: "Đại lễ 30/4 - 1/5: Giảm 20% toàn shop",
  link: "/shop",
};

export function getHeroBanner(): BannerItem {
  try {
    const saved = localStorage.getItem(HERO_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultHero;
}

function saveHeroBanner(banner: BannerItem) {
  localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(banner));
}

// ── Promo banners (carousel banners below hero) ──
const PROMO_STORAGE_KEY = "mercy_promo_banners";

const defaultPromos: BannerItem[] = [
  { id: 1, image: "/banners/banner/1.png", alt: "Ưu đãi 30/4 - 1/5", link: "/shop" },
  { id: 2, image: "/banners/banner/2.png", alt: "Baby3 Three Thông Minh", link: "/shop?category=Robot+AI" },
  { id: 3, image: "/banners/banner/3.png", alt: "Thunder Sale Smart Glasses", link: "/shop?category=Kính+Thông+Minh+AI" },
  { id: 4, image: "/banners/banner/4.png", alt: "Quà tặng Bao Da Cao Cấp", link: "/shop?category=Phụ+Kiện" },
];

export function getPromoBanners(): BannerItem[] {
  try {
    const saved = localStorage.getItem(PROMO_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return defaultPromos;
}

function savePromoBanners(banners: BannerItem[]) {
  localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(banners));
}

/* ═══════════════════════════════════════════
   Image Upload Component
   ═══════════════════════════════════════════ */
const ImageUploader = ({
  currentImage,
  onImageChange,
}: {
  currentImage: string;
  onImageChange: (url: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File quá lớn (tối đa 10MB)");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api/banners/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onImageChange(data.url);
      toast.success("Đã tải ảnh lên thành công!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Tải ảnh lên thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleUpload(file);
    }
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      {currentImage && (
        <div className="rounded-lg overflow-hidden border border-border bg-gray-50">
          <img
            src={currentImage}
            alt="Preview"
            className="w-full h-40 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
      )}

      {/* Upload zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
          dragOver
            ? "border-red-400 bg-red-50"
            : "border-gray-300 hover:border-red-300 hover:bg-red-50/50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
            <p className="text-sm text-gray-600">Đang tải lên...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-red-600">Nhấn để tải ảnh</span> hoặc kéo thả vào đây
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP (tối đa 10MB)</p>
          </div>
        )}
      </div>

      {/* URL input fallback */}
      <div>
        <Label className="text-xs text-gray-500">Hoặc nhập URL ảnh</Label>
        <Input
          value={currentImage}
          onChange={(e) => onImageChange(e.target.value)}
          placeholder="/banners/banner/1.png hoặc https://..."
          className="mt-1"
        />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Admin Banners Page
   ═══════════════════════════════════════════ */
const AdminBanners = () => {
  // Hero banner state
  const [hero, setHero] = useState<BannerItem>(defaultHero);
  const [heroDialogOpen, setHeroDialogOpen] = useState(false);
  const [heroForm, setHeroForm] = useState({ image: "", alt: "", link: "" });

  // Promo banners state
  const [promos, setPromos] = useState<BannerItem[]>([]);
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<BannerItem | null>(null);
  const [promoForm, setPromoForm] = useState({ image: "", alt: "", link: "/shop" });
  const [deletePromoId, setDeletePromoId] = useState<number | null>(null);

  useEffect(() => {
    setHero(getHeroBanner());
    setPromos(getPromoBanners());
  }, []);

  /* ── Hero banner handlers ── */
  const openEditHero = () => {
    setHeroForm({ image: hero.image, alt: hero.alt, link: hero.link });
    setHeroDialogOpen(true);
  };

  const saveHeroHandler = () => {
    if (!heroForm.image.trim() || !heroForm.alt.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    const updated = { ...hero, ...heroForm };
    setHero(updated);
    saveHeroBanner(updated);
    setHeroDialogOpen(false);
    toast.success("Đã cập nhật banner đầu trang");
  };

  /* ── Promo banner handlers ── */
  const openAddPromo = () => {
    setEditingPromo(null);
    setPromoForm({ image: "", alt: "", link: "/shop" });
    setPromoDialogOpen(true);
  };

  const openEditPromo = (banner: BannerItem) => {
    setEditingPromo(banner);
    setPromoForm({ image: banner.image, alt: banner.alt, link: banner.link });
    setPromoDialogOpen(true);
  };

  const savePromoHandler = () => {
    if (!promoForm.image.trim() || !promoForm.alt.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    let updated: BannerItem[];
    if (editingPromo) {
      updated = promos.map((b) =>
        b.id === editingPromo.id ? { ...b, ...promoForm } : b
      );
      toast.success("Đã cập nhật banner khuyến mãi");
    } else {
      const newId = Math.max(0, ...promos.map((b) => b.id)) + 1;
      updated = [...promos, { id: newId, ...promoForm }];
      toast.success("Đã thêm banner khuyến mãi");
    }
    setPromos(updated);
    savePromoBanners(updated);
    setPromoDialogOpen(false);
  };

  const deletePromo = (id: number) => {
    const updated = promos.filter((b) => b.id !== id);
    setPromos(updated);
    savePromoBanners(updated);
    setDeletePromoId(null);
    toast.success("Đã xóa banner");
  };

  const movePromo = (index: number, dir: "up" | "down") => {
    const swap = dir === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= promos.length) return;
    const updated = [...promos];
    [updated[index], updated[swap]] = [updated[swap], updated[index]];
    setPromos(updated);
    savePromoBanners(updated);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý Banner</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Quản lý banner đầu trang và các banner khuyến mãi trên trang chủ. Tải ảnh mới hoặc nhập URL.
          </p>
        </div>

        {/* ═══ Section 1: Hero Banner ═══ */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Banner Đầu Trang (Hero)</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Ảnh quảng cáo lớn phía trên trang chủ</p>
                </div>
              </div>
              <Button onClick={openEditHero} variant="outline" className="gap-2">
                <Pencil className="h-4 w-4" />
                Chỉnh sửa
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl overflow-hidden border border-border bg-gradient-to-b from-red-500/10 to-transparent">
              <img
                src={hero.image}
                alt={hero.alt}
                className="w-full h-auto max-h-[200px] object-contain"
              />
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">Mô tả:</span>
              <span className="font-medium text-foreground">{hero.alt}</span>
            </div>
            <div className="mt-1 flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">Liên kết:</span>
              <span className="font-medium text-blue-600">{hero.link}</span>
            </div>
          </CardContent>
        </Card>

        {/* ═══ Section 2: Promo Banners ═══ */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Megaphone className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Banner Khuyến Mãi ({promos.length})</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Các banner hiển thị carousel bên dưới hero</p>
                </div>
              </div>
              <Button onClick={openAddPromo} className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm banner
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {promos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>Chưa có banner khuyến mãi nào</p>
                <Button onClick={openAddPromo} variant="outline" className="mt-3 gap-2">
                  <Plus className="h-4 w-4" />
                  Thêm banner đầu tiên
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {promos.map((banner, index) => (
                  <div
                    key={banner.id}
                    className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors"
                  >
                    {/* Reorder buttons */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => movePromo(index, "up")}
                        disabled={index === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      >
                        ▲
                      </button>
                      <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                      <button
                        onClick={() => movePromo(index, "down")}
                        disabled={index === promos.length - 1}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Preview image */}
                    <div className="w-40 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={banner.image}
                        alt={banner.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{banner.alt}</p>
                      <p className="text-xs text-muted-foreground truncate">{banner.link}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Vị trí: {index + 1}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditPromo(banner)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeletePromoId(banner.id)}
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ═══ Hero Edit Dialog ═══ */}
        <Dialog open={heroDialogOpen} onOpenChange={setHeroDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa Banner Đầu Trang</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Hình ảnh banner</Label>
                <div className="mt-2">
                  <ImageUploader
                    currentImage={heroForm.image}
                    onImageChange={(url) => setHeroForm({ ...heroForm, image: url })}
                  />
                </div>
              </div>
              <div>
                <Label>Mô tả (alt text)</Label>
                <Input
                  value={heroForm.alt}
                  onChange={(e) => setHeroForm({ ...heroForm, alt: e.target.value })}
                  placeholder="Mô tả banner"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Liên kết</Label>
                <Input
                  value={heroForm.link}
                  onChange={(e) => setHeroForm({ ...heroForm, link: e.target.value })}
                  placeholder="/shop hoặc https://..."
                  className="mt-1.5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setHeroDialogOpen(false)}>Hủy</Button>
              <Button onClick={saveHeroHandler}>Cập nhật</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ═══ Promo Add/Edit Dialog ═══ */}
        <Dialog open={promoDialogOpen} onOpenChange={setPromoDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingPromo ? "Chỉnh sửa banner khuyến mãi" : "Thêm banner khuyến mãi"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Hình ảnh banner</Label>
                <div className="mt-2">
                  <ImageUploader
                    currentImage={promoForm.image}
                    onImageChange={(url) => setPromoForm({ ...promoForm, image: url })}
                  />
                </div>
              </div>
              <div>
                <Label>Mô tả (alt text)</Label>
                <Input
                  value={promoForm.alt}
                  onChange={(e) => setPromoForm({ ...promoForm, alt: e.target.value })}
                  placeholder="Mô tả banner"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Liên kết</Label>
                <Input
                  value={promoForm.link}
                  onChange={(e) => setPromoForm({ ...promoForm, link: e.target.value })}
                  placeholder="/shop hoặc https://..."
                  className="mt-1.5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPromoDialogOpen(false)}>Hủy</Button>
              <Button onClick={savePromoHandler}>
                {editingPromo ? "Cập nhật" : "Thêm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ═══ Delete Confirmation ═══ */}
        <Dialog open={deletePromoId !== null} onOpenChange={() => setDeletePromoId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa banner?</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-sm">
              Hành động này không thể hoàn tác.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletePromoId(null)}>Hủy</Button>
              <Button
                variant="destructive"
                onClick={() => deletePromoId !== null && deletePromo(deletePromoId)}
              >
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminBanners;
