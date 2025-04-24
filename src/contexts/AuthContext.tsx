
import React, { createContext } from "react";
import { AuthContextType } from "./authTypes";

// Create the Auth Context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => undefined,
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  confirmPasswordReset: async () => {},
  updateProfile: async () => {},
  requestVerification: async () => {},
  useSwipe: async () => ({ success: false }),
  getSwipesRemaining: () => 0,
  submitReport: async () => {},
});

// Re-export the AuthProvider from separate file
export { AuthProvider } from "./AuthProvider";
