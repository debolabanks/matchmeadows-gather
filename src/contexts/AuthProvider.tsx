
import React, { useState, useEffect } from "react";
import { User, AuthContextType, UserProfile, Report } from "./authTypes";
import { AuthContext } from "./AuthContext";
import { useSwipes } from "@/hooks/useSwipes";
import { 
  signInWithEmailAndPassword, 
  signUpWithEmailAndPassword,
  resetPassword as resetPasswordService,
  confirmPasswordReset as confirmPasswordResetService,
  updateUserProfile,
  requestVerification as requestVerificationService
} from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { initializeSwipes, checkAndResetSwipes, useSwipe: useSwipeHook, getSwipesRemaining: getRemainingSwipes } = useSwipes();

  useEffect(() => {
    // Set up the Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          try {
            // Get profile data from our profiles table
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            // Convert to our app's User format
            const appUser: User = {
              id: session.user.id,
              name: profileData?.full_name || session.user.user_metadata?.full_name || "",
              email: session.user.email || "",
              provider: "email",
              profile: profileData ? {
                bio: profileData.bio,
                location: profileData.location,
                // Map other profile fields as needed
              } : undefined
            };
            
            // Initialize swipes for the user
            const userWithSwipes = initializeSwipes(appUser);
            
            setUser(userWithSwipes);
            localStorage.setItem("matchmeadows_user", JSON.stringify(userWithSwipes));
          } catch (error) {
            console.error("Failed to load user profile:", error);
          }
        } else {
          setUser(null);
          localStorage.removeItem("matchmeadows_user");
        }
        
        setIsLoading(false);
      }
    );

    // Check for an existing session on load
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No active session, check local storage as fallback
        const storedUser = localStorage.getItem("matchmeadows_user");
        
        if (storedUser) {
          try {
            let parsedUser = JSON.parse(storedUser) as User;
            parsedUser = checkAndResetSwipes(parsedUser);
            
            // Verify this user actually exists in Supabase
            const { data } = await supabase.auth.getUser();
            
            if (data.user && data.user.id === parsedUser.id) {
              localStorage.setItem("matchmeadows_user", JSON.stringify(parsedUser));
              setUser(parsedUser);
            } else {
              // User data in localStorage doesn't match Supabase
              localStorage.removeItem("matchmeadows_user");
            }
          } catch (error) {
            console.error("Failed to parse stored user:", error);
            localStorage.removeItem("matchmeadows_user");
          }
        }
        
        setIsLoading(false);
      }
    };

    checkAuth();

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authUser = await signInWithEmailAndPassword(email, password);
      
      const userWithSwipes = initializeSwipes(authUser);
      
      setUser(userWithSwipes);
      localStorage.setItem("matchmeadows_user", JSON.stringify(userWithSwipes));
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const authUser = await signUpWithEmailAndPassword(email, password, name);
      
      const userWithSwipes = initializeSwipes(authUser);
      
      setUser(userWithSwipes);
      localStorage.setItem("matchmeadows_user", JSON.stringify(userWithSwipes));
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("matchmeadows_user");
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await resetPasswordService(email);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmPasswordReset = async (email: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await confirmPasswordResetService(email, newPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updatedUser = await updateUserProfile(user.id, profileData);
      
      if (user.swipes) {
        updatedUser.swipes = user.swipes;
      }
      
      setUser(updatedUser);
      localStorage.setItem("matchmeadows_user", JSON.stringify(updatedUser));
    } finally {
      setIsLoading(false);
    }
  };

  const requestVerification = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updatedUser = await requestVerificationService(user.id);
      
      if (user.swipes) {
        updatedUser.swipes = user.swipes;
      }
      
      setUser(updatedUser);
      localStorage.setItem("matchmeadows_user", JSON.stringify(updatedUser));
    } finally {
      setIsLoading(false);
    }
  };

  const useSwipe = async (): Promise<boolean> => {
    const { success, updatedUser } = useSwipeHook(user);
    
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem("matchmeadows_user", JSON.stringify(updatedUser));
    }
    
    return success;
  };

  const getSwipesRemaining = (): number => {
    return getRemainingSwipes(user);
  };

  const submitReport = async (report: Omit<Report, "id" | "status" | "createdAt">): Promise<void> => {
    if (!user) throw new Error("User must be logged in to submit a report");
    
    const newReport: Report = {
      ...report,
      id: `report-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    
    const existingReportsJSON = localStorage.getItem("matchmeadows_reports");
    const existingReports: Report[] = existingReportsJSON ? JSON.parse(existingReportsJSON) : [];
    
    const updatedReports = [...existingReports, newReport];
    
    localStorage.setItem("matchmeadows_reports", JSON.stringify(updatedReports));
    
    return new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
        submitReport
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
