
import { ReactNode, useEffect } from "react";
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
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Log authentication state for debugging
  useEffect(() => {
    console.log("ProtectedRoute - auth state:", { 
      isAuthenticated, 
      isLoading, 
      hasUser: !!user,
      path: location.pathname
    });
  }, [isAuthenticated, isLoading, user, location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-love-500" />
        <span className="ml-2 text-lg">Loading authentication...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log("User not authenticated, redirecting from", location.pathname, "to:", redirectPath);
    return <Navigate to={redirectPath} state={{ returnTo: location.pathname }} replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
