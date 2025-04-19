
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  // Add fallbacks for critical properties that might be undefined
  return {
    ...context,
    user: context.user || null,
    isAuthenticated: !!context.user,
    isLoading: context.isLoading === undefined ? false : context.isLoading,
    profile: context.user?.profile || {}
  };
};
