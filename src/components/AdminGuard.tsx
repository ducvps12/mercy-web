import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!hasShownToast.current && !isLoading) {
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để tiếp tục");
        hasShownToast.current = true;
      } else if (!isAdmin) {
        toast.error("Bạn không có quyền truy cập trang quản trị");
        hasShownToast.current = true;
      }
    }
  }, [isAuthenticated, isAdmin, isLoading]);

  if (isLoading) {
    return (
      <div className="flex bg-gray-50 h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
