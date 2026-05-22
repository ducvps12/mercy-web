import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus, Pencil, Trash2, GripVertical, Save, RotateCcw, Loader2, Play, ExternalLink, Film,
} from "lucide-react";
import { toast } from "sonner";
import {
  ReviewVideo, defaultReviews, getReviewVideos, saveReviewVideos,
} from "@/components/ReviewSection";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<ReviewVideo[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [form, setForm] = useState<ReviewVideo>({
    id: 0, videoId: "", title: "", productIndex: 0, thumbnail: "",
  });
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setReviews(getReviewVideos());
  }, []);

  const save = () => {
    saveReviewVideos(reviews);
    setHasChanges(false);
    toast.success("Đã lưu! Trang chủ sẽ cập nhật ngay.");
  };

  const resetDefaults = () => {
    setReviews([...defaultReviews]);
    setHasChanges(true);
    toast.info("Đã khôi phục mặc định (nhấn Lưu để áp dụng)");
  };

  // Add
  const openAdd = () => {
    setEditIndex(-1);
    setForm({
      id: Math.max(0, ...reviews.map(r => r.id)) + 1,
      videoId: "", title: "", productIndex: 0, thumbnail: "",
    });
    setEditOpen(true);
  };

  // Edit
  const openEdit = (idx: number) => {
    setEditIndex(idx);
    setForm({ ...reviews[idx] });
    setEditOpen(true);
  };

  const saveForm = () => {
    if (!form.videoId.trim() || !form.title.trim()) {
      toast.error("Vui lòng nhập Video ID và tiêu đề");
      return;
    }
    // Extract videoId if user pasted a full TikTok URL
    let videoId = form.videoId.trim();
    const urlMatch = videoId.match(/\/video\/(\d+)/);
    if (urlMatch) videoId = urlMatch[1];

    const finalForm = { ...form, videoId };

    let updated: ReviewVideo[];
    if (editIndex >= 0) {
      updated = reviews.map((r, i) => i === editIndex ? { ...finalForm } : r);
    } else {
      updated = [...reviews, { ...finalForm }];
    }
    setReviews(updated);
    setHasChanges(true);
    setEditOpen(false);
    toast.success(editIndex >= 0 ? "Đã cập nhật video" : "Đã thêm video mới");
  };

  // Delete
  const confirmDelete = () => {
    if (deleteIndex === null) return;
    setReviews(reviews.filter((_, i) => i !== deleteIndex));
    setHasChanges(true);
    setDeleteIndex(null);
    toast.success("Đã xóa video");
  };

  // Move
  const move = (idx: number, dir: "up" | "down") => {
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= reviews.length) return;
    const updated = [...reviews];
    [updated[idx], updated[swap]] = [updated[swap], updated[idx]];
    setReviews(updated);
    setHasChanges(true);
  };

  // Generate TikTok embed preview URL
  const getTikTokUrl = (videoId: string) =>
    `https://www.tiktok.com/@mr.manhdora.macginhi/video/${videoId}`;

  return (
    <AdminLayout title="Góc Review">
      <div className="space-y-4 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Film className="w-6 h-6 text-primary" /> Góc Review
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Quản lý video TikTok review hiển thị trên trang chủ. Thay đổi thứ tự, thêm/xóa video.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetDefaults} className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Mặc định
            </Button>
            <Button variant="outline" size="sm" onClick={openAdd} className="gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Thêm video
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

        {/* Video list */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{reviews.length} video</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Film className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Chưa có video review nào</p>
                <Button variant="outline" onClick={openAdd} className="mt-3 gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Thêm video
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {reviews.map((review, idx) => (
                  <div key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-border transition-colors group">
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => move(idx, "up")} disabled={idx === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs">▲</button>
                      <GripVertical className="w-4 h-4 text-muted-foreground/40" />
                      <button onClick={() => move(idx, "down")} disabled={idx === reviews.length - 1}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs">▼</button>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-16 h-24 rounded-lg overflow-hidden bg-gray-900 shrink-0 border border-border relative">
                      {review.thumbnail ? (
                        <img src={review.thumbnail} alt={review.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-5 h-5 text-white/80" fill="white" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{review.title}</p>
                      <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        ID: {review.videoId}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                        Sản phẩm index: {review.productIndex}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5 shrink-0">
                      <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                        <a href={getTikTokUrl(review.videoId)} target="_blank" rel="noopener noreferrer" title="Xem trên TikTok">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </Button>
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

        {/* TikTok Preview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Play className="w-4 h-4" /> Xem trước (click để phát)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
              {reviews.map((r, i) => (
                <div key={i} className="flex-shrink-0 w-32">
                  <div className="aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden relative border border-border">
                    {r.thumbnail && (
                      <img src={r.thumbnail} alt={r.title} className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" fill="white" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-[9px] text-white font-bold leading-tight truncate">{r.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══ Edit/Add Dialog ═══ */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editIndex >= 0 ? "Chỉnh sửa video" : "Thêm video TikTok"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">TikTok Video ID hoặc URL</Label>
              <Input value={form.videoId} onChange={e => setForm({ ...form, videoId: e.target.value })}
                placeholder="7616957685631683861 hoặc https://www.tiktok.com/@user/video/..." className="h-9 font-mono text-sm" />
              <p className="text-[10px] text-muted-foreground">
                Dán link TikTok đầy đủ hoặc chỉ phần Video ID (dãy số cuối URL)
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Tiêu đề hiển thị</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="CHECK VAR KÍNH AI CÓ CAMERA" className="h-9" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Index sản phẩm (vị trí trong danh sách)</Label>
              <Input type="number" min={0} value={form.productIndex}
                onChange={e => setForm({ ...form, productIndex: Number(e.target.value) })}
                className="h-9 w-24" />
              <p className="text-[10px] text-muted-foreground">
                Chọn sản phẩm liên kết (0 = sản phẩm đầu tiên, 1 = thứ 2, ...)
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">URL Thumbnail (tùy chọn)</Label>
              <Input value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })}
                placeholder="Để trống = tự lấy từ TikTok" className="h-9 text-xs" />
              {form.thumbnail && (
                <div className="w-20 h-32 rounded-lg overflow-hidden border border-border bg-gray-900">
                  <img src={form.thumbnail} alt="" className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                </div>
              )}
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
          <DialogHeader><DialogTitle>Xóa video review?</DialogTitle></DialogHeader>
          {deleteIndex !== null && (
            <p className="text-sm text-muted-foreground">
              Xóa video <strong>"{reviews[deleteIndex]?.title}"</strong>? Hành động này sẽ áp dụng sau khi bạn nhấn Lưu.
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteIndex(null)}>Hủy</Button>
            <Button variant="destructive" onClick={confirmDelete}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
