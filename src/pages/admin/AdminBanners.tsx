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
import { Plus, Pencil, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import banner1 from "@/assets/banners/banner-1.jpg";
import banner2 from "@/assets/banners/banner-2.jpg";
import banner3 from "@/assets/banners/banner-3.jpg";
import banner4 from "@/assets/banners/banner-4.jpg";

export interface BannerItem {
  id: number;
  image: string;
  alt: string;
  link: string;
}

const defaultBanners: BannerItem[] = [
  { id: 1, image: banner1, alt: "Phụ kiện công nghệ", link: "#" },
  { id: 2, image: banner2, alt: "Samsung Galaxy", link: "#" },
  { id: 3, image: banner3, alt: "Smart Home", link: "#" },
  { id: 4, image: banner4, alt: "Camera hành động", link: "#" },
];

const STORAGE_KEY = "mercy_banners";

export function getBanners(): BannerItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultBanners;
}

function saveBanners(banners: BannerItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
}

const AdminBanners = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [form, setForm] = useState({ image: "", alt: "", link: "#" });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    setBanners(getBanners());
  }, []);

  const openAdd = () => {
    setEditingBanner(null);
    setForm({ image: "", alt: "", link: "#" });
    setDialogOpen(true);
  };

  const openEdit = (banner: BannerItem) => {
    setEditingBanner(banner);
    setForm({ image: banner.image, alt: banner.alt, link: banner.link });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.image.trim() || !form.alt.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    let updated: BannerItem[];
    if (editingBanner) {
      updated = banners.map((b) =>
        b.id === editingBanner.id
          ? { ...b, image: form.image, alt: form.alt, link: form.link }
          : b
      );
      toast.success("Đã cập nhật banner");
    } else {
      const newId = Math.max(0, ...banners.map((b) => b.id)) + 1;
      updated = [...banners, { id: newId, image: form.image, alt: form.alt, link: form.link }];
      toast.success("Đã thêm banner mới");
    }

    setBanners(updated);
    saveBanners(updated);
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    const updated = banners.filter((b) => b.id !== id);
    setBanners(updated);
    saveBanners(updated);
    setDeleteId(null);
    toast.success("Đã xóa banner");
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...banners];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setBanners(updated);
    saveBanners(updated);
  };

  const moveDown = (index: number) => {
    if (index === banners.length - 1) return;
    const updated = [...banners];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setBanners(updated);
    saveBanners(updated);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quản lý Banner</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Thêm, sửa, xóa và sắp xếp các banner trên trang chủ
            </p>
          </div>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm banner
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Danh sách banner ({banners.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {banners.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>Chưa có banner nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {banners.map((banner, index) => (
                  <div
                    key={banner.id}
                    className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      >
                        ▲
                      </button>
                      <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === banners.length - 1}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      >
                        ▼
                      </button>
                    </div>

                    <div className="w-32 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={banner.image}
                        alt={banner.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{banner.alt}</p>
                      <p className="text-xs text-muted-foreground truncate">{banner.link}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Vị trí: {index + 1}</p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEdit(banner)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteId(banner.id)}
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

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? "Chỉnh sửa banner" : "Thêm banner mới"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>URL hình ảnh</Label>
                <Input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://example.com/banner.jpg"
                  className="mt-1.5"
                />
                {form.image && (
                  <div className="mt-2 rounded-md overflow-hidden border border-border">
                    <img src={form.image} alt="Preview" className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>
              <div>
                <Label>Mô tả (alt text)</Label>
                <Input
                  value={form.alt}
                  onChange={(e) => setForm({ ...form, alt: e.target.value })}
                  placeholder="Mô tả banner"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Liên kết</Label>
                <Input
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://example.com/promo"
                  className="mt-1.5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSave}>
                {editingBanner ? "Cập nhật" : "Thêm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa banner?</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-sm">
              Hành động này không thể hoàn tác.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteId !== null && handleDelete(deleteId)}
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
