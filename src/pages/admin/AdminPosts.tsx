import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, Eye, Loader2, Newspaper, RefreshCw, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "@/lib/api";
import { ImagePicker } from "@/components/admin/ImagePicker";

interface AdminArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
  views: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
  category: "Tin Tức",
  author: "Mercy",
  date: "",
  isPublished: true,
};

export default function AdminPosts() {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminArticle | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiGet<AdminArticle[]>("/admin/articles");
      setArticles(Array.isArray(data) ? data : []);
    } catch (e: any) {
      toast.error(e.message || "Không tải được bài viết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return articles.filter((a) => {
      const matchStatus =
        statusFilter === "all" ? true : statusFilter === "published" ? a.isPublished : !a.isPublished;
      const matchSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        (a.category || "").toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [articles, statusFilter, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, date: new Date().toLocaleDateString("vi-VN") });
    setDialogOpen(true);
  };

  const openEdit = (a: AdminArticle) => {
    setEditing(a);
    setForm({
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt || "",
      content: a.content || "",
      image: a.image || "",
      category: a.category || "Tin Tức",
      author: a.author || "Mercy",
      date: a.date || "",
      isPublished: a.isPublished,
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await apiPut(`/admin/articles/${editing.id}`, form);
        toast.success("Đã cập nhật bài viết");
      } else {
        await apiPost("/admin/articles", form);
        toast.success("Đã tạo bài viết");
      }
      setDialogOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.message || "Lỗi lưu");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (a: AdminArticle) => {
    try {
      await apiPatch(`/admin/articles/${a.id}/toggle`);
      load();
    } catch (e: any) {
      toast.error(e.message || "Lỗi");
    }
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    try {
      await apiDelete(`/admin/articles/${deleteId}`);
      toast.success("Đã xóa bài viết");
      setDeleteId(null);
      load();
    } catch (e: any) {
      toast.error(e.message || "Lỗi xóa");
    }
  };

  return (
    <AdminLayout title="Bài viết">
      <div className="space-y-4">
        {/* Header / actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm bài viết theo tiêu đề, slug, danh mục..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-sm border border-border rounded-md px-3 bg-background"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
            </select>
            <Button variant="outline" onClick={load} disabled={loading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" /> Bài viết mới
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card className="border-border">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="mb-3">Chưa có bài viết nào phù hợp</p>
                <Button onClick={openCreate} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" /> Tạo bài đầu tiên
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">Tiêu đề</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Danh mục</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Trạng thái</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Ngày</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Lượt xem</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a) => (
                      <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {a.image ? (
                              <img src={a.image} alt="" className="w-10 h-10 rounded-md object-cover bg-muted shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                                <Newspaper className="w-4 h-4 text-muted-foreground" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-foreground line-clamp-1 max-w-[280px]">{a.title}</p>
                              <p className="text-[11px] text-muted-foreground font-mono truncate max-w-[280px]">/{a.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{a.category}</td>
                        <td className="p-4">
                          <Badge variant={a.isPublished ? "default" : "outline"}>
                            {a.isPublished ? "Đã xuất bản" : "Bản nháp"}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground text-xs">{a.date}</td>
                        <td className="p-4 text-muted-foreground text-xs">{a.views}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEdit(a)}
                              className="p-1.5 rounded hover:bg-primary/10 text-primary"
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => togglePublish(a)}
                              className="p-1.5 rounded hover:bg-muted text-muted-foreground"
                              title={a.isPublished ? "Chuyển về nháp" : "Xuất bản"}
                            >
                              {a.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => window.open(`/news/${a.slug}`, "_blank")}
                              className="p-1.5 rounded hover:bg-muted text-muted-foreground"
                              title="Xem trên website"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteId(a.id)}
                              className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                              title="Xóa"
                            >
                              <Trash2 className="h-4 w-4" />
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
          {filtered.length} / {articles.length} bài viết
        </p>
      </div>

      {/* ═══ Create / Edit Dialog ═══ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editing ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div>
              <Label className="text-xs font-semibold">Tiêu đề *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="VD: Mercy ra mắt MCK 6.0..."
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Slug (URL)</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="Để trống → tự sinh từ tiêu đề"
                  className="mt-1.5 font-mono text-xs"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Danh mục</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Tin Tức / Hướng dẫn / Đánh giá..."
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Tác giả</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="Mercy"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Ngày đăng (hiển thị)</Label>
                <Input
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  placeholder="DD/MM/YYYY"
                  className="mt-1.5"
                />
              </div>
            </div>

            <ImagePicker
              label="Ảnh đại diện bài viết"
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
              hint="Tỷ lệ 16:10 sẽ hiển thị đẹp nhất ở danh sách"
            />

            <div>
              <Label className="text-xs font-semibold">Mô tả ngắn (excerpt)</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="2-3 câu tóm tắt hiển thị ở thẻ bài viết"
                rows={3}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Nội dung (Markdown)</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="# Tiêu đề\n\nNội dung bài viết..."
                rows={12}
                className="mt-1.5 font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Hỗ trợ Markdown: # heading, **bold**, *italic*, danh sách - item...
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Switch
                checked={form.isPublished}
                onCheckedChange={(v) => setForm({ ...form, isPublished: v })}
              />
              <Label className="cursor-pointer text-sm">
                {form.isPublished ? "Xuất bản (hiển thị trên website)" : "Lưu nháp (chưa hiện)"}
              </Label>
            </div>
          </div>

          <DialogFooter className="border-t pt-3 mt-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Hủy
            </Button>
            <Button onClick={save} disabled={saving} className="gap-1.5">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? "Cập nhật" : "Tạo bài"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ Delete confirmation ═══ */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa bài viết?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Hành động này không thể hoàn tác.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Hủy</Button>
            <Button variant="destructive" onClick={confirmDelete}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
