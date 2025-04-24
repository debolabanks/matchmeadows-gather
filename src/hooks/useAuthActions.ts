import { User, UserProfile, Report } from "@/contexts/authTypes";
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
  const { initializeSwipes, useSwipe: useSwipeHook, getSwipesRemaining: getRemainingSwipes, setupTrialForNewUser } = useSwipes();

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
      const userWithTrial = setupTrialForNewUser(userWithSwipes);
      
      setUser(userWithTrial);
      localStorage.setItem("matchmeadows_user", JSON.stringify(userWithTrial));
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
