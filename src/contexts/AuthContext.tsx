
import React, { createContext, useEffect, useState } from "react";
import { User, AuthContextType, UserProfile } from "./authTypes";
import { 
  signInWithEmailAndPassword, 
  signUpWithEmailAndPassword,
  resetPassword as resetPasswordService,
  confirmPasswordReset as confirmPasswordResetService,
  updateUserProfile,
  requestVerification as requestVerificationService
} from "@/services/authService";

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
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("matchmeadows_user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          
          // Check if we need to reset swipes
          if (parsedUser.swipes) {
            const resetAt = new Date(parsedUser.swipes.resetAt);
            const now = new Date();
            
            if (now > resetAt) {
              parsedUser.swipes = {
                count: 0,
                resetAt: getNextResetTime()
              };
              localStorage.setItem("matchmeadows_user", JSON.stringify(parsedUser));
            }
          } else {
            // Initialize swipes if not exist
            parsedUser.swipes = {
              count: 0,
              resetAt: getNextResetTime()
            };
            localStorage.setItem("matchmeadows_user", JSON.stringify(parsedUser));
          }
          
          setUser(parsedUser);
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          localStorage.removeItem("matchmeadows_user");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Helper function to get the next reset time (24 hours from now)
  const getNextResetTime = (): string => {
    const date = new Date();
    date.setHours(date.getHours() + 24);
    return date.toISOString();
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await signInWithEmailAndPassword(email, password);
      
      // Initialize swipes if not already present
      if (!user.swipes) {
        user.swipes = {
          count: 0,
          resetAt: getNextResetTime()
        };
      }
      
      setUser(user);
      localStorage.setItem("matchmeadows_user", JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const user = await signUpWithEmailAndPassword(email, password, name);
      
      // Initialize swipes for new user
      user.swipes = {
        count: 0,
        resetAt: getNextResetTime()
      };
      
      setUser(user);
      localStorage.setItem("matchmeadows_user", JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
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
      
      // Preserve swipes info if present
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
      
      // Preserve swipes info if present
      if (user.swipes) {
        updatedUser.swipes = user.swipes;
      }
      
      setUser(updatedUser);
      localStorage.setItem("matchmeadows_user", JSON.stringify(updatedUser));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to use a swipe and check if user has swipes available
  const useSwipe = async (): Promise<boolean> => {
    if (!user) return false;
    
    // Premium users get unlimited swipes
    if (user.profile?.subscriptionStatus === "active") {
      return true;
    }
    
    // Check if swipes need to be reset
    const now = new Date();
    if (user.swipes && new Date(user.swipes.resetAt) < now) {
      user.swipes = {
        count: 0,
        resetAt: getNextResetTime()
      };
    }
    
    // Initialize swipes if not exist
    if (!user.swipes) {
      user.swipes = {
        count: 0,
        resetAt: getNextResetTime()
      };
    }
    
    // Check if user has used all swipes
    if (user.swipes.count >= 10) {
      return false;
    }
    
    // Use a swipe
    user.swipes.count += 1;
    setUser({...user});
    localStorage.setItem("matchmeadows_user", JSON.stringify(user));
    
    return true;
  };
  
  // Function to get remaining swipes
  const getSwipesRemaining = (): number => {
    if (!user) return 0;
    
    // Premium users get unlimited swipes
    if (user.profile?.subscriptionStatus === "active") {
      return Infinity;
    }
    
    // Check if swipes are initialized
    if (!user.swipes) {
      return 10;
    }
    
    // Check if swipes need to be reset
    const now = new Date();
    if (new Date(user.swipes.resetAt) < now) {
      return 10;
    }
    
    // Return remaining swipes
    return Math.max(0, 10 - user.swipes.count);
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
        getSwipesRemaining
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
