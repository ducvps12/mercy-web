import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Layers, Plus, Pencil, Trash2, GripVertical, Save, RotateCcw,
  FolderOpen, Search, CheckSquare, Square, Loader2, Eye,
  Image as ImageIcon, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import {
  CategoryItem, defaultCategories, getFeaturedCategories, saveFeaturedCategories,
} from "@/components/HeroSection";
import { API_BASE, apiPost } from "@/lib/api";

const gradientOptions = [
  { label: "Đỏ - Hồng", value: "from-red-500 via-rose-500 to-pink-500", lightBg: "from-red-50 via-rose-50 to-pink-50", border: "hover:border-red-300" },
  { label: "Xanh dương", value: "from-blue-500 via-indigo-500 to-violet-500", lightBg: "from-blue-50 via-indigo-50 to-violet-50", border: "hover:border-blue-300" },
  { label: "Xanh lá", value: "from-emerald-500 via-teal-500 to-cyan-500", lightBg: "from-emerald-50 via-teal-50 to-cyan-50", border: "hover:border-emerald-300" },
  { label: "Tím", value: "from-purple-500 via-violet-500 to-fuchsia-500", lightBg: "from-purple-50 via-violet-50 to-fuchsia-50", border: "hover:border-purple-300" },
  { label: "Cam - Vàng", value: "from-amber-500 via-orange-500 to-red-500", lightBg: "from-amber-50 via-orange-50 to-red-50", border: "hover:border-amber-300" },
  { label: "Hồng", value: "from-pink-500 via-fuchsia-500 to-purple-500", lightBg: "from-pink-50 via-fuchsia-50 to-purple-50", border: "hover:border-pink-300" },
  { label: "Cyan", value: "from-cyan-500 via-sky-500 to-blue-500", lightBg: "from-cyan-50 via-sky-50 to-blue-50", border: "hover:border-cyan-300" },
];

const iconOptions = [
  { label: "Tai nghe", value: "Headphones" },
  { label: "Camera", value: "Camera" },
  { label: "Ngôn ngữ", value: "Languages" },
  { label: "Robot", value: "Bot" },
  { label: "Kính", value: "Glasses" },
];

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [form, setForm] = useState<CategoryItem>({
    name: "", desc: "", iconName: "Glasses", gradient: gradientOptions[0].value,
    lightBg: gradientOptions[0].lightBg, borderHover: gradientOptions[0].border,
    image: "", count: 0, link: "",
  });
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [syncingImages, setSyncingImages] = useState(false);

  // Media picker
  const [pickerOpen, setPickerOpen] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<{ filename: string; url: string; group: string }[]>([]);
  const [mediaGroups, setMediaGroups] = useState<string[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaFilter, setMediaFilter] = useState("all");

  useEffect(() => {
    setCategories(getFeaturedCategories());
  }, []);

  const save = () => {
    saveFeaturedCategories(categories);
    setHasChanges(false);
    toast.success("Đã lưu danh mục! Trang chủ sẽ cập nhật ngay.");
  };

  const resetDefaults = () => {
    setCategories([...defaultCategories]);
    setHasChanges(true);
    toast.info("Đã khôi phục mặc định (nhấn Lưu để áp dụng)");
  };

  // Sync category images from products API
  const syncCategoryImages = async () => {
    setSyncingImages(true);
    try {
      const data = await apiPost<any>("/admin/sync-categories");
      // data.results has { id, name, slug, image } for each DB category
      let updated = 0;
      const newCategories = categories.map(cat => {
        const linkSlug = cat.link.replace(/^\/danh-muc\//, '');
        const matched = data.results?.find((r: any) =>
          r.slug === linkSlug || r.name.toLowerCase() === cat.name.toLowerCase()
        );
        if (matched?.image && cat.image !== matched.image) {
          updated++;
          return { ...cat, image: matched.image };
        }
        return cat;
      });

      setCategories(newCategories);
      if (updated > 0) {
        setHasChanges(true);
        toast.success(`Đã cập nhật ảnh cho ${updated} danh mục (nhấn Lưu để áp dụng)`);
      } else {
        toast.info("Ảnh danh mục đã đúng, không cần thay đổi");
      }
    } catch (err) {
      console.error('Sync category images error:', err);
      toast.error("Lỗi đồng bộ ảnh danh mục");
    } finally {
      setSyncingImages(false);
    }
  };

  // Edit / Add
  const openAdd = () => {
    setEditIndex(-1);
    setForm({
      name: "", desc: "", iconName: "Glasses", gradient: gradientOptions[0].value,
      lightBg: gradientOptions[0].lightBg, borderHover: gradientOptions[0].border,
      image: "", count: 0, link: "/shop",
    });
    setEditOpen(true);
  };

  const openEdit = (idx: number) => {
    setEditIndex(idx);
    setForm({ ...categories[idx] });
    setEditOpen(true);
  };

  const saveForm = () => {
    if (!form.name.trim() || !form.image.trim()) {
      toast.error("Vui lòng nhập tên và chọn ảnh bìa");
      return;
    }
    let updated: CategoryItem[];
    if (editIndex >= 0) {
      updated = categories.map((c, i) => i === editIndex ? { ...form } : c);
    } else {
      updated = [...categories, { ...form }];
    }
    setCategories(updated);
    setHasChanges(true);
    setEditOpen(false);
    toast.success(editIndex >= 0 ? "Đã cập nhật danh mục" : "Đã thêm danh mục mới");
  };

  // Delete
  const confirmDelete = () => {
    if (deleteIndex === null) return;
    setCategories(categories.filter((_, i) => i !== deleteIndex));
    setHasChanges(true);
    setDeleteIndex(null);
    toast.success("Đã xóa danh mục");
  };

  // Move
  const move = (idx: number, dir: "up" | "down") => {
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= categories.length) return;
    const updated = [...categories];
    [updated[idx], updated[swap]] = [updated[swap], updated[idx]];
    setCategories(updated);
    setHasChanges(true);
  };

  // Gradient change
  const setGradient = (gradientValue: string) => {
    const opt = gradientOptions.find(g => g.value === gradientValue);
    if (opt) setForm({ ...form, gradient: opt.value, lightBg: opt.lightBg, borderHover: opt.border });
  };

  // Media picker
  const loadMedia = useCallback(async () => {
    setMediaLoading(true);
    try {
      const token = localStorage.getItem("token");
      const h: Record<string, string> = {};
      if (token) h["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/media/list`, { headers: h });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMediaFiles(data.files || []);
      setMediaGroups(data.groups || []);
    } catch { toast.error("Lỗi tải kho ảnh"); }
    finally { setMediaLoading(false); }
  }, []);

  const openPicker = () => {
    setMediaSearch(""); setMediaFilter("all");
    setPickerOpen(true);
    if (mediaFiles.length === 0) loadMedia();
  };

  const pickImage = (url: string) => {
    setForm({ ...form, image: url });
    setPickerOpen(false);
  };

  const filteredMedia = mediaFiles.filter(f => {
    if (mediaFilter !== "all" && f.group !== mediaFilter) return false;
    if (mediaSearch && !f.filename.toLowerCase().includes(mediaSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminLayout title="Danh mục nổi bật">
      <div className="space-y-4 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Layers className="w-6 h-6 text-primary" /> Danh mục nổi bật
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Quản lý các danh mục hiển thị trên trang chủ. Thay đổi thứ tự, ảnh bìa, tên, mô tả.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={syncCategoryImages} disabled={syncingImages} className="gap-1.5">
              {syncingImages ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} ĐB Ảnh
            </Button>
            <Button variant="outline" size="sm" onClick={resetDefaults} className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Mặc định
            </Button>
            <Button variant="outline" size="sm" onClick={openAdd} className="gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Thêm
            </Button>
            <Button size="sm" onClick={save} disabled={!hasChanges} className="gap-1.5">
              <Save className="w-3.5 h-3.5" /> Lưu
            </Button>
          </div>
        </div>

        {hasChanges && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex items-center gap-2">
            <span className="font-medium">⚠️ Có thay đổi chưa lưu.</span> Nhấn "Lưu" để áp dụng lên trang chủ.
          </div>
        )}

        {/* Category list */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{categories.length} danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Chưa có danh mục nào</p>
                <Button variant="outline" onClick={openAdd} className="mt-3 gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Thêm danh mục
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((cat, idx) => (
                  <div key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-border transition-colors group">
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => move(idx, "up")} disabled={idx === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs">▲</button>
                      <GripVertical className="w-4 h-4 text-muted-foreground/40" />
                      <button onClick={() => move(idx, "down")} disabled={idx === categories.length - 1}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs">▼</button>
                    </div>

                    {/* Image preview */}
                    <div className="w-20 h-16 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">{cat.name}</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{cat.count} SP</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{cat.desc}</p>
                      <p className="text-[10px] text-muted-foreground/60 truncate mt-0.5">
                        Ảnh: <code className="bg-muted px-1 rounded">{cat.image}</code> • Link: {cat.link}
                      </p>
                    </div>

                    {/* Gradient preview */}
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${cat.gradient} shrink-0`} title="Màu gradient" />

                    {/* Actions */}
                    <div className="flex gap-1.5 shrink-0">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEdit(idx)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleteIndex(idx)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live preview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4" /> Xem trước trang chủ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
              {categories.map((cat, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-border">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-[10px] font-bold text-white">{cat.name}</p>
                    <p className="text-[8px] text-white/70">{cat.desc}</p>
                  </div>
                  <div className="absolute top-1 right-1">
                    <span className="text-[8px] text-white px-1 py-0.5 rounded bg-black/40">{cat.count} SP</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══ Edit/Add Dialog ═══ */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editIndex >= 0 ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Tên danh mục</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Kính Bluetooth" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Số sản phẩm</Label>
                <Input type="number" value={form.count} onChange={e => setForm({ ...form, count: Number(e.target.value) })}
                  className="h-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Mô tả ngắn</Label>
              <Input value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}
                placeholder="Nghe nhạc, gọi điện, trợ lý AI" className="h-9" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Đường dẫn (link)</Label>
              <Input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })}
                placeholder="/danh-muc/kinh-bluetooth" className="h-9" />
            </div>

            {/* Image picker */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Ảnh bìa</Label>
              <div className="flex gap-2">
                <Input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="/products/MCK5.0D-0.jpg" className="h-9 flex-1" />
                <Button variant="outline" size="sm" onClick={openPicker} className="gap-1 h-9 shrink-0">
                  <FolderOpen className="w-3.5 h-3.5" /> Kho ảnh
                </Button>
              </div>
              {form.image && (
                <div className="w-full h-32 rounded-lg overflow-hidden border border-border bg-muted mt-1">
                  <img src={form.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Icon */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Biểu tượng</Label>
              <select value={form.iconName} onChange={e => setForm({ ...form, iconName: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                {iconOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Gradient */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Màu chủ đạo</Label>
              <div className="grid grid-cols-4 gap-2">
                {gradientOptions.map(opt => (
                  <button key={opt.value}
                    onClick={() => setGradient(opt.value)}
                    className={`h-8 rounded-lg bg-gradient-to-r ${opt.value} border-2 transition-all ${
                      form.gradient === opt.value ? "border-foreground scale-105 shadow" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                    title={opt.label} />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Hủy</Button>
            <Button onClick={saveForm}>{editIndex >= 0 ? "Cập nhật" : "Thêm"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ Delete Dialog ═══ */}
      <Dialog open={deleteIndex !== null} onOpenChange={() => setDeleteIndex(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Xóa danh mục?</DialogTitle></DialogHeader>
          {deleteIndex !== null && (
            <p className="text-sm text-muted-foreground">
              Xóa danh mục <strong>"{categories[deleteIndex]?.name}"</strong>? Hành động này sẽ áp dụng sau khi bạn nhấn Lưu.
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteIndex(null)}>Hủy</Button>
            <Button variant="destructive" onClick={confirmDelete}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ Media Picker Dialog ═══ */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" /> Chọn ảnh bìa từ kho
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input value={mediaSearch} onChange={e => setMediaSearch(e.target.value)}
                placeholder="Tìm ảnh..." className="pl-8 h-8 text-xs" />
            </div>
            <select value={mediaFilter} onChange={e => setMediaFilter(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs">
              <option value="all">Tất cả</option>
              {mediaGroups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0">
            {mediaLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
            ) : filteredMedia.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground"><p className="text-sm">Không tìm thấy ảnh</p></div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 py-2">
                {filteredMedia.map(f => (
                  <button key={f.filename} onClick={() => pickImage(f.url)}
                    className="rounded-lg border border-border overflow-hidden hover:border-primary hover:shadow-md transition-all text-left">
                    <div className="aspect-square bg-muted overflow-hidden">
                      <img src={f.url} alt={f.filename} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-1.5"><p className="text-[10px] font-medium truncate">{f.filename}</p></div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
