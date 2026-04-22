import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Shield, Trash2, Users, Crown, UserCheck, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPut, apiDelete } from "@/lib/api";

interface Member {
  id: number;
  name: string | null;
  email: string;
  role: string;
  affiliateCode: string | null;
  createdAt: string;
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await apiGet<Member[]>("/admin/members");
      setMembers(data);
    } catch (err: any) {
      toast.error(err.message || "Không thể tải danh sách thành viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const filteredMembers = members.filter(
    (m) =>
      (m.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleRole = async (id: number) => {
    try {
      await apiPut(`/admin/members/${id}/role`);
      await loadMembers();
      toast.success("Đã cập nhật quyền thành viên");
    } catch (err: any) {
      toast.error(err.message || "Lỗi cập nhật quyền");
    }
  };

  const deleteMember = async (id: number, email: string) => {
    if (!confirm(`Xác nhận xóa thành viên ${email}?`)) return;
    try {
      await apiDelete(`/admin/members/${id}`);
      await loadMembers();
      toast.success("Đã xóa thành viên");
    } catch (err: any) {
      toast.error(err.message || "Lỗi xóa thành viên");
    }
  };

  const adminCount = members.filter((m) => m.role === "admin").length;
  const userCount = members.filter((m) => m.role === "user").length;

  return (
    <AdminLayout title="Thành viên">
      <div className="space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{members.length}</p>
                  <p className="text-xs text-muted-foreground">Tổng thành viên</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{adminCount}</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userCount}</p>
                  <p className="text-xs text-muted-foreground">Thành viên</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc email..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={loadMembers} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Làm mới
          </Button>
        </div>

        {/* Table */}
        <Card className="border-border">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredMembers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">#</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Thành viên</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Quyền</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Ngày đăng ký</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member, i) => (
                      <tr key={member.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="p-4 text-muted-foreground">{i + 1}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              member.role === "admin"
                                ? "bg-red-100 text-red-600"
                                : "bg-primary/10 text-primary"
                            }`}>
                              {(member.name || member.email).charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-foreground">{member.name || "—"}</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{member.email}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            member.role === "admin"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {member.role === "admin" ? (
                              <><Crown className="w-3 h-3" /> Admin</>
                            ) : (
                              <><Users className="w-3 h-3" /> User</>
                            )}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground text-xs">
                          {new Date(member.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleRole(member.id)}
                              className="p-1.5 rounded hover:bg-muted transition-colors"
                              title={member.role === "admin" ? "Gỡ quyền admin" : "Phong admin"}
                            >
                              <Shield className={`h-4 w-4 ${member.role === "admin" ? "text-red-500" : "text-muted-foreground"}`} />
                            </button>
                            <button
                              onClick={() => deleteMember(member.id, member.email)}
                              className="p-1.5 rounded hover:bg-destructive/10 transition-colors"
                              title="Xóa thành viên"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Users className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">
                  {searchQuery ? "Không tìm thấy thành viên nào" : "Chưa có thành viên đăng ký"}
                </p>
                <p className="text-xs mt-1">Thành viên đăng ký qua trang web sẽ hiển thị ở đây</p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          📊 Dữ liệu từ MySQL ({members.length} bản ghi) • Click 🛡️ để phong/gỡ quyền admin
        </p>
      </div>
    </AdminLayout>
  );
}
