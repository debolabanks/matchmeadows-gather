
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requiresAuth = true
}) => {
  const { isAuthenticated, isLoading, devModeEnabled } = useAuth();
  const location = useLocation();
  
  // If in dev mode, bypass authentication
  if (devModeEnabled) {
    return <>{children}</>;
  }
  
  // Still loading authentication state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Not authenticated
  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/sign-in" state={{ returnTo: location.pathname }} replace />;
  }
  
  // Already authenticated, but on auth page
  if (!requiresAuth && isAuthenticated) {
    return <Navigate to="/discover" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
