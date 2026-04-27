import { useState, useEffect } from "react";
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
import { Plus, Pencil, Trash2, GripVertical, Image as ImageIcon, Megaphone } from "lucide-react";
import { toast } from "sonner";

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
  image: "/header-img.png",
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

// ── Promo banners (dual banners below hero) ──
const PROMO_STORAGE_KEY = "mercy_promo_banners";

const defaultPromos: BannerItem[] = [
  {
    id: 1,
    image: "/banners/promo-combo.png",
    alt: "Combo Phụ Kiện Giảm Sốc",
    link: "/shop"
  },
  {
    id: 2,
    image: "/banners/promo-flash-sale.png",
    alt: "Flash Sale Mỗi Ngày",
    link: "/shop"
  }
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
  const [promoForm, setPromoForm] = useState({ image: "", alt: "", link: "#" });
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
    setPromoForm({ image: "", alt: "", link: "#" });
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
            Quản lý banner đầu trang và các banner khuyến mãi trên trang chủ
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
                  <p className="text-xs text-muted-foreground mt-0.5">Các banner nhỏ hiển thị bên dưới banner đầu trang</p>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa Banner Đầu Trang</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>URL hình ảnh</Label>
                <Input
                  value={heroForm.image}
                  onChange={(e) => setHeroForm({ ...heroForm, image: e.target.value })}
                  placeholder="/header-img.png hoặc https://..."
                  className="mt-1.5"
                />
                {heroForm.image && (
                  <div className="mt-2 rounded-md overflow-hidden border border-border">
                    <img src={heroForm.image} alt="Preview" className="w-full h-32 object-contain bg-gray-50" />
                  </div>
                )}
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPromo ? "Chỉnh sửa banner khuyến mãi" : "Thêm banner khuyến mãi"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>URL hình ảnh</Label>
                <Input
                  value={promoForm.image}
                  onChange={(e) => setPromoForm({ ...promoForm, image: e.target.value })}
                  placeholder="/banners/your-banner.png"
                  className="mt-1.5"
                />
                {promoForm.image && (
                  <div className="mt-2 rounded-md overflow-hidden border border-border">
                    <img src={promoForm.image} alt="Preview" className="w-full h-32 object-cover" />
                  </div>
                )}
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
