
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  
  console.log("ProtectedRoute - Auth State:", { isAuthenticated, isLoading, user });
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-love-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("ProtectedRoute - Not authenticated, redirecting to sign-in");
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }
  
  // Render children if authenticated
  console.log("ProtectedRoute - Authenticated, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
