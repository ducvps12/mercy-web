import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, CreditCard, Globe, Phone, MapPin, Save, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Site Settings
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Mercy - Smart Vision • Smart Life",
    siteUrl: "https://kinhthongminhmercy.vn",
    hotline: "0898 273 899",
    zaloUrl: "https://zalo.me/0898273899",
    addressHCM: "36 đường số 5 KĐT Vạn Phúc, Thủ Đức, HCM",
    addressHN: "S1.06 Vinsmart City, Nam Từ Liêm, Hà Nội",
  });

  // SMTP Settings
  const [smtpSettings, setSmtpSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "mercyglobalstore@gmail.com",
    smtpPass: "",
    adminEmail: "mercyglobalstore@gmail.com",
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    bankCode: "ACB",
    bankAccount: "24488671",
    bankAccountName: "MAI XUAN ANH",
    enableCOD: true,
    enableBankTransfer: true,
    enableEWallet: true,
  });

  // Social Media
  const [socialSettings, setSocialSettings] = useState({
    facebook: "https://www.facebook.com/kinhthongminhmercy",
    instagram: "https://www.instagram.com/kinhthongminhmercy",
    tiktok: "https://www.tiktok.com/@kinhthongminhmercy.vn",
    threads: "https://www.threads.com/@kinhthongminhmercy",
    pinterest: "https://www.pinterest.com/mercytechglobal",
    youtube: "https://www.youtube.com/@mercyglobalstore",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailOnNewOrder: true,
    emailOnLowStock: true,
    weeklyReport: false,
    zaloNotification: true,
  });

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        
        // Map settings to state
        if (data.siteName) setSiteSettings(prev => ({...prev, siteName: data.siteName}));
        if (data.siteUrl) setSiteSettings(prev => ({...prev, siteUrl: data.siteUrl}));
        if (data.hotline) setSiteSettings(prev => ({...prev, hotline: data.hotline}));
        if (data.zaloUrl) setSiteSettings(prev => ({...prev, zaloUrl: data.zaloUrl}));
        if (data.addressHCM) setSiteSettings(prev => ({...prev, addressHCM: data.addressHCM}));
        if (data.addressHN) setSiteSettings(prev => ({...prev, addressHN: data.addressHN}));
        
        if (data.smtpHost) setSmtpSettings(prev => ({...prev, smtpHost: data.smtpHost}));
        if (data.smtpPort) setSmtpSettings(prev => ({...prev, smtpPort: data.smtpPort}));
        if (data.smtpUser) setSmtpSettings(prev => ({...prev, smtpUser: data.smtpUser}));
        if (data.smtpPass) setSmtpSettings(prev => ({...prev, smtpPass: data.smtpPass}));
        if (data.adminEmail) setSmtpSettings(prev => ({...prev, adminEmail: data.adminEmail}));
        
        if (data.bankCode) setPaymentSettings(prev => ({...prev, bankCode: data.bankCode}));
        if (data.bankAccount) setPaymentSettings(prev => ({...prev, bankAccount: data.bankAccount}));
        if (data.bankAccountName) setPaymentSettings(prev => ({...prev, bankAccountName: data.bankAccountName}));
        if (data.enableCOD !== undefined) setPaymentSettings(prev => ({...prev, enableCOD: data.enableCOD === 'true'}));
        if (data.enableBankTransfer !== undefined) setPaymentSettings(prev => ({...prev, enableBankTransfer: data.enableBankTransfer === 'true'}));
        if (data.enableEWallet !== undefined) setPaymentSettings(prev => ({...prev, enableEWallet: data.enableEWallet === 'true'}));
        
        if (data.facebook) setSocialSettings(prev => ({...prev, facebook: data.facebook}));
        if (data.instagram) setSocialSettings(prev => ({...prev, instagram: data.instagram}));
        if (data.tiktok) setSocialSettings(prev => ({...prev, tiktok: data.tiktok}));
        if (data.threads) setSocialSettings(prev => ({...prev, threads: data.threads}));
        if (data.pinterest) setSocialSettings(prev => ({...prev, pinterest: data.pinterest}));
        if (data.youtube) setSocialSettings(prev => ({...prev, youtube: data.youtube}));
        
        if (data.emailOnNewOrder !== undefined) setNotifications(prev => ({...prev, emailOnNewOrder: data.emailOnNewOrder === 'true'}));
        if (data.emailOnLowStock !== undefined) setNotifications(prev => ({...prev, emailOnLowStock: data.emailOnLowStock === 'true'}));
        if (data.weeklyReport !== undefined) setNotifications(prev => ({...prev, weeklyReport: data.weeklyReport === 'true'}));
        if (data.zaloNotification !== undefined) setNotifications(prev => ({...prev, zaloNotification: data.zaloNotification === 'true'}));
      } catch (error) {
        console.error('Load settings error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      let dataToSave = {};
      
      if (section === 'website') {
        dataToSave = {
          siteName: siteSettings.siteName,
          siteUrl: siteSettings.siteUrl,
          hotline: siteSettings.hotline,
          zaloUrl: siteSettings.zaloUrl,
          addressHCM: siteSettings.addressHCM,
          addressHN: siteSettings.addressHN,
        };
      } else if (section === 'SMTP') {
        dataToSave = {
          smtpHost: smtpSettings.smtpHost,
          smtpPort: smtpSettings.smtpPort,
          smtpUser: smtpSettings.smtpUser,
          smtpPass: smtpSettings.smtpPass,
          adminEmail: smtpSettings.adminEmail,
        };
      } else if (section === 'thanh toán') {
        dataToSave = {
          bankCode: paymentSettings.bankCode,
          bankAccount: paymentSettings.bankAccount,
          bankAccountName: paymentSettings.bankAccountName,
          enableCOD: String(paymentSettings.enableCOD),
          enableBankTransfer: String(paymentSettings.enableBankTransfer),
          enableEWallet: String(paymentSettings.enableEWallet),
        };
      } else if (section === 'mạng xã hội') {
        dataToSave = {
          facebook: socialSettings.facebook,
          instagram: socialSettings.instagram,
          tiktok: socialSettings.tiktok,
          threads: socialSettings.threads,
          pinterest: socialSettings.pinterest,
          youtube: socialSettings.youtube,
        };
      } else if (section === 'thông báo') {
        dataToSave = {
          emailOnNewOrder: String(notifications.emailOnNewOrder),
          emailOnLowStock: String(notifications.emailOnLowStock),
          weeklyReport: String(notifications.weeklyReport),
          zaloNotification: String(notifications.zaloNotification),
        };
      }
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });
      
      if (response.ok) {
        toast.success(`Đã lưu cấu hình ${section}`);
      } else {
        toast.error('Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Không thể kết nối server');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Cài đặt">
      <div className="max-w-5xl">
        <Tabs defaultValue="site" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="site" className="gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Website</span>
            </TabsTrigger>
            <TabsTrigger value="smtp" className="gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Thanh toán</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Mạng xã hội</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <AlertCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Thông báo</span>
            </TabsTrigger>
          </TabsList>

          {/* Site Settings */}
          <TabsContent value="site" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Thông tin website
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tên website</Label>
                    <Input 
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL website</Label>
                    <Input 
                      value={siteSettings.siteUrl}
                      onChange={(e) => setSiteSettings({...siteSettings, siteUrl: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hotline</Label>
                    <Input 
                      value={siteSettings.hotline}
                      onChange={(e) => setSiteSettings({...siteSettings, hotline: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Zalo OA</Label>
                    <Input 
                      value={siteSettings.zaloUrl}
                      onChange={(e) => setSiteSettings({...siteSettings, zaloUrl: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Địa chỉ CS TP.HCM
                  </Label>
                  <Input 
                    value={siteSettings.addressHCM}
                    onChange={(e) => setSiteSettings({...siteSettings, addressHCM: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Địa chỉ CS Hà Nội
                  </Label>
                  <Input 
                    value={siteSettings.addressHN}
                    onChange={(e) => setSiteSettings({...siteSettings, addressHN: e.target.value})}
                  />
                </div>

                <Button onClick={() => handleSave("website")} disabled={saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  Lưu thay đổi
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SMTP Settings */}
          <TabsContent value="smtp" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Cấu hình SMTP Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Lưu ý:</strong> Để gửi email qua Gmail, bạn cần tạo App Password tại{" "}
                    <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline">
                      Google Account Settings
                    </a>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input 
                      value={smtpSettings.smtpHost}
                      onChange={(e) => setSmtpSettings({...smtpSettings, smtpHost: e.target.value})}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Port</Label>
                    <Input 
                      value={smtpSettings.smtpPort}
                      onChange={(e) => setSmtpSettings({...smtpSettings, smtpPort: e.target.value})}
                      placeholder="587"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>SMTP User (Email)</Label>
                  <Input 
                    type="email"
                    value={smtpSettings.smtpUser}
                    onChange={(e) => setSmtpSettings({...smtpSettings, smtpUser: e.target.value})}
                    placeholder="your-email@gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>SMTP Password (App Password)</Label>
                  <Input 
                    type="password"
                    value={smtpSettings.smtpPass}
                    onChange={(e) => setSmtpSettings({...smtpSettings, smtpPass: e.target.value})}
                    placeholder="xxxx xxxx xxxx xxxx"
                  />
                  <p className="text-xs text-muted-foreground">
                    Nhập App Password từ Google (16 ký tự, có thể có dấu cách)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Email nhận thông báo (Admin)</Label>
                  <Input 
                    type="email"
                    value={smtpSettings.adminEmail}
                    onChange={(e) => setSmtpSettings({...smtpSettings, adminEmail: e.target.value})}
                    placeholder="admin@example.com"
                  />
                </div>

                <Button onClick={() => handleSave("SMTP")} disabled={saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  Lưu cấu hình SMTP
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Cấu hình thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold">Phương thức thanh toán</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                        <p className="text-xs text-muted-foreground">Khách thanh toán khi nhận hàng</p>
                      </div>
                      <Switch 
                        checked={paymentSettings.enableCOD}
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, enableCOD: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Chuyển khoản ngân hàng</p>
                        <p className="text-xs text-muted-foreground">Chuyển khoản qua VietQR</p>
                      </div>
                      <Switch 
                        checked={paymentSettings.enableBankTransfer}
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, enableBankTransfer: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Ví điện tử</p>
                        <p className="text-xs text-muted-foreground">Momo, ZaloPay, VNPay</p>
                      </div>
                      <Switch 
                        checked={paymentSettings.enableEWallet}
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, enableEWallet: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Thông tin ngân hàng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Mã ngân hàng</Label>
                      <Input 
                        value={paymentSettings.bankCode}
                        onChange={(e) => setPaymentSettings({...paymentSettings, bankCode: e.target.value})}
                        placeholder="ACB"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Số tài khoản</Label>
                      <Input 
                        value={paymentSettings.bankAccount}
                        onChange={(e) => setPaymentSettings({...paymentSettings, bankAccount: e.target.value})}
                        placeholder="24488671"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label>Tên chủ tài khoản</Label>
                    <Input 
                      value={paymentSettings.bankAccountName}
                      onChange={(e) => setPaymentSettings({...paymentSettings, bankAccountName: e.target.value})}
                      placeholder="NGUYEN VAN A"
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave("thanh toán")} disabled={saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  Lưu cấu hình thanh toán
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media */}
          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Mạng xã hội
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Facebook Fanpage</Label>
                    <Input 
                      value={socialSettings.facebook}
                      onChange={(e) => setSocialSettings({...socialSettings, facebook: e.target.value})}
                      placeholder="https://www.facebook.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input 
                      value={socialSettings.instagram}
                      onChange={(e) => setSocialSettings({...socialSettings, instagram: e.target.value})}
                      placeholder="https://www.instagram.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>TikTok</Label>
                    <Input 
                      value={socialSettings.tiktok}
                      onChange={(e) => setSocialSettings({...socialSettings, tiktok: e.target.value})}
                      placeholder="https://www.tiktok.com/@..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Threads</Label>
                    <Input 
                      value={socialSettings.threads}
                      onChange={(e) => setSocialSettings({...socialSettings, threads: e.target.value})}
                      placeholder="https://www.threads.com/@..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pinterest</Label>
                    <Input 
                      value={socialSettings.pinterest}
                      onChange={(e) => setSocialSettings({...socialSettings, pinterest: e.target.value})}
                      placeholder="https://www.pinterest.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Youtube</Label>
                    <Input 
                      value={socialSettings.youtube}
                      onChange={(e) => setSocialSettings({...socialSettings, youtube: e.target.value})}
                      placeholder="https://www.youtube.com/@..."
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave("mạng xã hội")} disabled={saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  Lưu liên kết mạng xã hội
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Cài đặt thông báo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Email khi có đơn hàng mới</p>
                      <p className="text-xs text-muted-foreground">Nhận email mỗi khi có đơn hàng mới</p>
                    </div>
                    <Switch 
                      checked={notifications.emailOnNewOrder}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailOnNewOrder: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Cảnh báo hết hàng</p>
                      <p className="text-xs text-muted-foreground">Thông báo khi sản phẩm sắp hết tồn kho</p>
                    </div>
                    <Switch 
                      checked={notifications.emailOnLowStock}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailOnLowStock: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Báo cáo hàng tuần</p>
                      <p className="text-xs text-muted-foreground">Nhận email tóm tắt doanh thu mỗi tuần</p>
                    </div>
                    <Switch 
                      checked={notifications.weeklyReport}
                      onCheckedChange={(checked) => setNotifications({...notifications, weeklyReport: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Thông báo Zalo OA</p>
                      <p className="text-xs text-muted-foreground">Gửi cập nhật đơn hàng qua Zalo cho khách</p>
                    </div>
                    <Switch 
                      checked={notifications.zaloNotification}
                      onCheckedChange={(checked) => setNotifications({...notifications, zaloNotification: checked})}
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave("thông báo")} disabled={saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  Lưu cài đặt thông báo
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
