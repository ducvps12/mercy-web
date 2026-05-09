import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Lock, Eye, EyeOff, Camera, Save,
  Package, Heart, Shield, LogOut, ChevronRight, Pencil, Check, X, Loader2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiPut, API_BASE } from "@/lib/api";

type Tab = "profile" | "password";

const Account = () => {
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ── Profile fields ─────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Password fields ────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Fetch profile on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const data = await apiGet<any>("/auth/me");
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setAvatar(data.avatar || "");
      } catch {
        // fallback to local data
        setName(user?.name || "");
        setEmail(user?.email || "");
        setPhone(user?.phone || "");
        setAddress(user?.address || "");
        setAvatar(user?.avatar || "");
      } finally {
        setFetching(false);
      }
    })();
  }, [isAuthenticated]);

  // ── Save Profile ───────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const data = await apiPut<any>("/auth/profile", { name, phone, address, avatar });
      updateUser(data.user);
      toast.success("Cập nhật thông tin thành công!");
      setEditingField(null);
    } catch (err: any) {
      toast.error(err.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ── Change Password ────────────────────────────────────────────────
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    setLoading(true);
    try {
      await apiPut("/auth/change-password", { currentPassword, newPassword });
      toast.success("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ── Avatar change (file upload) ────────────────────────────────────
  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh không được vượt quá 5MB');
      return;
    }

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/auth/avatar`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Lỗi upload' }));
        throw new Error(err.message);
      }

      const data = await res.json();
      setAvatar(data.avatar);
      if (data.user) updateUser(data.user);
      toast.success('Cập nhật ảnh đại diện thành công!');
    } catch (err: any) {
      toast.error(err.message || 'Upload ảnh thất bại');
    } finally {
      setAvatarUploading(false);
      // Reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getInitials = () => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#f0f3f8] pb-16 md:pb-0">
      <Header />

      <section className="container py-6 md:py-10">
        <div className="max-w-5xl mx-auto">
          {/* ═══ Page Header ═══ */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tài khoản của tôi</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            {/* ═══ Left Sidebar ═══ */}
            <div className="space-y-4">
              {/* User Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
                <div className="relative w-20 h-20 mx-auto mb-3 group">
                  {avatar ? (
                    <img src={avatar.startsWith('/') ? `${API_BASE.replace('/api', '')}${avatar}` : avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-red-100" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-red-100">
                      {getInitials()}
                    </div>
                  )}
                  {avatarUploading && (
                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                  <button
                    onClick={handleAvatarChange}
                    disabled={avatarUploading}
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border-2 border-gray-100 shadow-md flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-200 transition-all group-hover:scale-110 disabled:opacity-50"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleAvatarFileSelect}
                    className="hidden"
                  />
                </div>
                <h2 className="font-bold text-gray-900 text-lg">{name || "Khách hàng"}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{email}</p>
              </div>

              {/* Menu */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors text-left ${
                    activeTab === "profile" ? "bg-red-50 text-red-600 border-l-4 border-red-600" : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                >
                  <User className="w-4 h-4" />
                  Thông tin cá nhân
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors text-left ${
                    activeTab === "password" ? "bg-red-50 text-red-600 border-l-4 border-red-600" : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  Đổi mật khẩu
                </button>

                <div className="border-t border-gray-100" />

                <button
                  onClick={() => navigate("/orders")}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="flex items-center gap-3"><Package className="w-4 h-4" /> Đơn hàng</span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>
                <button
                  onClick={() => navigate("/wishlist")}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="flex items-center gap-3"><Heart className="w-4 h-4" /> Yêu thích</span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>

                <div className="border-t border-gray-100" />

                <button
                  onClick={() => { logout(); toast.success("Đã đăng xuất"); navigate("/"); }}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>

            {/* ═══ Right Content ═══ */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              {fetching ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : activeTab === "profile" ? (
                /* ── Profile Tab ── */
                <div>
                  <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Thông tin cá nhân</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Cập nhật thông tin để bảo mật tài khoản</p>
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 disabled:opacity-60 shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Name */}
                    <ProfileField
                      icon={<User className="w-4 h-4" />}
                      label="Họ và tên"
                      value={name}
                      onChange={setName}
                      editing={editingField === "name"}
                      onEdit={() => setEditingField("name")}
                      onCancel={() => setEditingField(null)}
                      placeholder="Nhập họ và tên"
                    />
                    {/* Email (readonly) */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 font-medium mb-1">Email</p>
                        <p className="text-sm font-semibold text-gray-700">{email}</p>
                        <p className="text-[10px] text-gray-400 mt-1">Email không thể thay đổi</p>
                      </div>
                      <Lock className="w-3.5 h-3.5 text-gray-300 mt-1" />
                    </div>
                    {/* Phone */}
                    <ProfileField
                      icon={<Phone className="w-4 h-4" />}
                      label="Số điện thoại"
                      value={phone}
                      onChange={setPhone}
                      editing={editingField === "phone"}
                      onEdit={() => setEditingField("phone")}
                      onCancel={() => setEditingField(null)}
                      placeholder="Nhập số điện thoại"
                      type="tel"
                    />
                    {/* Address */}
                    <ProfileField
                      icon={<MapPin className="w-4 h-4" />}
                      label="Địa chỉ"
                      value={address}
                      onChange={setAddress}
                      editing={editingField === "address"}
                      onEdit={() => setEditingField("address")}
                      onCancel={() => setEditingField(null)}
                      placeholder="Nhập địa chỉ giao hàng"
                      isTextarea
                    />
                    {/* Avatar Upload */}
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-gray-200 transition-all">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 font-medium mb-1">Ảnh đại diện</p>
                        {avatar ? (
                          <div className="flex items-center gap-2">
                            <img src={avatar.startsWith('/') ? `${API_BASE.replace('/api', '')}${avatar}` : avatar} alt="" className="w-8 h-8 rounded-full object-cover border" />
                            <span className="text-sm font-semibold text-gray-700">Đã cập nhật</span>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-300 font-normal">Chưa cập nhật</p>
                        )}
                      </div>
                      <button
                        onClick={handleAvatarChange}
                        disabled={avatarUploading}
                        className="mt-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        {avatarUploading ? 'Đang tải...' : 'Chọn ảnh'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ── Password Tab ── */
                <div>
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-lg">Đổi mật khẩu</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Để bảo vệ tài khoản, vui lòng không chia sẻ mật khẩu</p>
                  </div>

                  <form onSubmit={handleChangePassword} className="p-6 space-y-5 max-w-lg">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu hiện tại</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showCurrentPw ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Nhập mật khẩu hiện tại"
                          className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPw(!showCurrentPw)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
                      <div className="relative">
                        <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showNewPw ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                          className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw(!showNewPw)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Password strength */}
                      {newPassword && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                newPassword.length >= 12 ? "w-full bg-green-500" :
                                newPassword.length >= 8 ? "w-2/3 bg-yellow-500" :
                                newPassword.length >= 6 ? "w-1/3 bg-red-500" : "w-0"
                              }`}
                            />
                          </div>
                          <span className={`text-[10px] font-medium ${
                            newPassword.length >= 12 ? "text-green-600" :
                            newPassword.length >= 8 ? "text-yellow-600" : "text-red-600"
                          }`}>
                            {newPassword.length >= 12 ? "Mạnh" : newPassword.length >= 8 ? "Trung bình" : "Yếu"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                      <div className="relative">
                        <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Nhập lại mật khẩu mới"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all ${
                            confirmPassword && confirmPassword !== newPassword
                              ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400"
                              : "border-gray-200 bg-gray-50 focus:ring-red-100 focus:border-red-400"
                          }`}
                          required
                        />
                      </div>
                      {confirmPassword && confirmPassword !== newPassword && (
                        <p className="text-xs text-red-500 mt-1.5">Mật khẩu xác nhận không khớp</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !currentPassword || !newPassword || newPassword !== confirmPassword}
                      className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
                    >
                      {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

/* ═════════════════════════════════════════════════════════════════════
   ProfileField – Reusable inline-editable field
   ═════════════════════════════════════════════════════════════════════ */
interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  placeholder?: string;
  type?: string;
  isTextarea?: boolean;
}

const ProfileField = ({ icon, label, value, onChange, editing, onEdit, onCancel, placeholder, type = "text", isTextarea }: ProfileFieldProps) => (
  <div className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${editing ? "bg-white border-red-200 shadow-sm" : "bg-gray-50 border-gray-100 hover:border-gray-200"}`}>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${editing ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400"}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
      {editing ? (
        isTextarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={2}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all resize-none"
            autoFocus
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
            autoFocus
          />
        )
      ) : (
        <p className="text-sm font-semibold text-gray-700 truncate">{value || <span className="text-gray-300 font-normal">Chưa cập nhật</span>}</p>
      )}
    </div>
    {editing ? (
      <button onClick={onCancel} className="mt-1 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
        <X className="w-4 h-4" />
      </button>
    ) : (
      <button onClick={onEdit} className="mt-1 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
        <Pencil className="w-4 h-4" />
      </button>
    )}
  </div>
);

export default Account;
