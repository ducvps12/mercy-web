import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function AdminSettings() {
  return (
    <AdminLayout title="Cài đặt">
      <div className="space-y-6 max-w-2xl">
        {/* Store info */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Thông tin cửa hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tên cửa hàng</Label>
              <Input defaultValue="Mercy - Smart Vision • Smart Life" />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input defaultValue="https://mercysmartlife.com" />
            </div>
            <div className="space-y-2">
              <Label>Hotline (Mr. Hùng)</Label>
              <Input defaultValue="0763 068 614" />
            </div>
            <div className="space-y-2">
              <Label>Hotline (Mr. Mạnh)</Label>
              <Input defaultValue="0398 684 921" />
            </div>
            <div className="space-y-2">
              <Label>Zalo OA</Label>
              <Input defaultValue="https://zalo.me/0763068614" />
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ CS TP.HCM</Label>
              <Input defaultValue="Số 109, Nguyễn Thị Nhung, KĐT Vạn Phúc, Hiệp Bình Phước, TP. Thủ Đức" />
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ CS Hà Nội</Label>
              <Input defaultValue="Số 10, Đường Thanh Niên, Xã Ba Vì, Hà Nội" />
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Lưu thay đổi</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Thông báo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Email khi có đơn hàng mới", desc: "Nhận email mỗi khi có đơn hàng mới", default: true },
              { label: "Cảnh báo hết hàng", desc: "Thông báo khi sản phẩm sắp hết tồn kho", default: true },
              { label: "Báo cáo hàng tuần", desc: "Nhận email tóm tắt doanh thu mỗi tuần", default: false },
              { label: "Thông báo Zalo OA", desc: "Gửi cập nhật đơn hàng qua Zalo cho khách", default: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.default} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Danger */}
        <Card className="border-destructive/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-destructive">Vùng nguy hiểm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Xóa toàn bộ dữ liệu cửa hàng. Hành động này không thể hoàn tác.</p>
            <Button variant="destructive" size="sm">Xóa cửa hàng</Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
