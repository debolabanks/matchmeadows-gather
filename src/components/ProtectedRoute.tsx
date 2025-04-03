
import React from "react";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-love-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  // Render children for all users (no authentication check)
  return <>{children}</>;
};

export default ProtectedRoute;
