
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { useSwipes } from "@/hooks/useSwipes";
import { 
  signInWithEmailAndPassword, 
  signUpWithEmailAndPassword,
  resetPassword as resetPasswordService,
  confirmPasswordReset as confirmPasswordResetService,
  updateUserProfile,
  requestVerification as requestVerificationService
} from "@/services/authService";

export const useAuthActions = (
  user: User | null, 
  setUser: (user: User | null) => void, 
  setIsLoading: (loading: boolean) => void
) => {
  const { initializeSwipes, useSwipe: useSwipeHook, getSwipesRemaining: getRemainingSwipes } = useSwipes();

  const signIn = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const authUser = await signInWithEmailAndPassword(email, password);
      
      if (!authUser) return null;
      
      const userWithSwipes = initializeSwipes(authUser);
      
      setUser(userWithSwipes);
      localStorage.setItem("matchmeadows_user", JSON.stringify(userWithSwipes));
      return userWithSwipes;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: object) => {
    setIsLoading(true);
    try {
      // Extract name from userData if it's provided
      const name = userData && typeof userData === 'object' && 'name' in userData 
        ? String(userData.name) 
        : '';
      
      const authUser = await signUpWithEmailAndPassword(email, password, name);
      
      if (!authUser) return;
      
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

  const confirmPasswordReset = async (token: string, password: string) => {
    setIsLoading(true);
    try {
      await confirmPasswordResetService(token, password);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<User["profile"]>) => {
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

  const useSwipe = async (): Promise<{ success: boolean; remaining?: number }> => {
    const { success, updatedUser } = useSwipeHook(user);
    
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem("matchmeadows_user", JSON.stringify(updatedUser));
    }
    
    return { success, remaining: updatedUser?.swipes?.count };
  };

  const getSwipesRemaining = (): number => {
    return getRemainingSwipes(user);
  };

  const submitReport = async (content: string, type: string): Promise<void> => {
    if (!user) throw new Error("User must be logged in to submit a report");
    
    const report = {
      userId: user.id,
      content,
      type
    };
    
    const newReport = {
      ...report,
      id: `report-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    
    const existingReportsJSON = localStorage.getItem("matchmeadows_reports");
    const existingReports = existingReportsJSON ? JSON.parse(existingReportsJSON) : [];
    
    const updatedReports = [...existingReports, newReport];
    
    localStorage.setItem("matchmeadows_reports", JSON.stringify(updatedReports));
    
    return new Promise((resolve) => setTimeout(resolve, 500));
  };

  return {
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
  };
};
