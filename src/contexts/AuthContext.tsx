
import React, { createContext } from "react";
import { AuthContextType } from "./authTypes";
import { AuthProvider } from "./AuthProvider";

// Create the Auth Context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  confirmPasswordReset: async () => {},
  updateProfile: async () => {},
  requestVerification: async () => {},
  useSwipe: async () => false,
  getSwipesRemaining: () => 0,
  submitReport: async () => {},
});

// Re-export the AuthProvider
export { AuthProvider };
