import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Bell, Search, Home, LogOut, User, ChevronDown, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminLayout({ children, title = "Dashboard" }: AdminLayoutProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất");
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 md:h-16 flex items-center justify-between border-b border-border bg-background px-3 md:px-4 lg:px-6 sticky top-0 z-30">
            <div className="flex items-center gap-2 md:gap-4">
              <SidebarTrigger className="text-foreground" />
              <h1 className="text-base md:text-lg font-semibold text-foreground truncate">{title}</h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm..."
                  className="pl-9 w-64 bg-muted/50 border-border"
                />
              </div>
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>
              {/* Profile dropdown with navigation */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-foreground max-w-[80px] truncate">
                    {user?.name || "Admin"}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-56 bg-popover rounded-xl shadow-xl border border-border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground">{user?.name || "Admin"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@mercy.vn"}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => { setProfileOpen(false); navigate("/"); }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors text-left"
                        >
                          <Home className="w-4 h-4 text-blue-500" />
                          Về trang chủ
                          <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
                        </button>
                        <button
                          onClick={() => { setProfileOpen(false); navigate("/account"); }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors text-left"
                        >
                          <User className="w-4 h-4 text-primary" />
                          Tài khoản của tôi
                        </button>
                        <button
                          onClick={() => { setProfileOpen(false); navigate("/admin"); }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors text-left"
                        >
                          <Search className="w-4 h-4 text-muted-foreground" />
                          Admin Dashboard
                        </button>
                      </div>
                      <div className="border-t border-border py-1">
                        <button
                          onClick={() => { setProfileOpen(false); handleLogout(); }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>
          <main className="flex-1 p-3 md:p-4 lg:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
