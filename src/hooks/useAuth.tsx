
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  // Add stronger type checks and fallbacks for critical properties
  return {
    ...context,
    user: context.user || null,
    isAuthenticated: Boolean(context.user),
    isLoading: context.isLoading === undefined ? false : context.isLoading,
    profile: context.user?.profile || {},
    signIn: context.signIn || (async () => undefined),
    signUp: context.signUp || (async () => {}),
    signOut: context.signOut || (async () => {}),
    getSwipesRemaining: context.getSwipesRemaining || (() => 0)
  };
};
