
import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthActions } from "@/hooks/useAuthActions";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, isLoading, setIsLoading } = useAuthState();
  const [devModeEnabled, setDevModeEnabled] = useState(false);
  
  // Enable dev mode from localStorage
  useEffect(() => {
    const isDevelopmentMode = localStorage.getItem("dev_mode_enabled") === "true";
    setDevModeEnabled(isDevelopmentMode);
    
    // If in development mode, add a console log
    if (isDevelopmentMode) {
      console.log("Development mode enabled: Bypassing authentication requirements");
    }
  }, []);
  
  const {
    signIn,
    signUp,
    signOut,
    resetPassword,
    confirmPasswordReset,
    updateProfile,
    requestVerification,
    useSwipe,
    getSwipesRemaining,
    submitReport
  } = useAuthActions(user, setUser, setIsLoading);

  const toggleDevMode = () => {
    const newDevModeState = !devModeEnabled;
    setDevModeEnabled(newDevModeState);
    localStorage.setItem("dev_mode_enabled", newDevModeState.toString());
    console.log(`Development mode ${newDevModeState ? "enabled" : "disabled"}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: devModeEnabled || !!user, // Allow access in dev mode
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        confirmPasswordReset,
        updateProfile,
        requestVerification,
        useSwipe,
        getSwipesRemaining,
        submitReport,
        devModeEnabled,
        toggleDevMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
