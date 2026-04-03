import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

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
              <Input defaultValue="Mercy Store" />
            </div>
            <div className="space-y-2">
              <Label>Email liên hệ</Label>
              <Input defaultValue="contact@mercystore.vn" />
            </div>
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input defaultValue="0901 234 567" />
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ</Label>
              <Input defaultValue="123 Nguyễn Huệ, Q.1, TP.HCM" />
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
