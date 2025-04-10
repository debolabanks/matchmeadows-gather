
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

const ProtectedRoute = ({ 
  children, 
  redirectPath = "/sign-in" 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-love-500" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve the attempted URL to redirect back after login
    return <Navigate to={redirectPath} state={{ returnTo: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
