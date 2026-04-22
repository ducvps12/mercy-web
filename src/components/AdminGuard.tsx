import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!hasShownToast.current) {
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để tiếp tục");
        hasShownToast.current = true;
      } else if (!isAdmin) {
        toast.error("Bạn không có quyền truy cập trang quản trị");
        hasShownToast.current = true;
      }
    }
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
