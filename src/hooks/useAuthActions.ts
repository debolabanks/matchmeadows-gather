
import { User, UserProfile } from "@/types/user";
import { supabase, storeOfflineData, getOfflineData } from "@/integrations/supabase/client";
import { useSwipes } from "@/hooks/useSwipes";
import { toast } from "@/components/ui/use-toast";
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

      // Check for offline data to sync
      if (navigator.onLine) {
        syncOfflineData(userWithSwipes.id);
      }
      
      return userWithSwipes;
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: navigator.onLine 
          ? "Please check your credentials and try again" 
          : "You're offline. Please try again when you have an internet connection",
        variant: "destructive"
      });
      return null;
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
      
      if (!navigator.onLine) {
        toast({
          title: "You're offline",
          description: "Sign up requires an internet connection",
          variant: "destructive"
        });
        return;
      }
      
      const authUser = await signUpWithEmailAndPassword(email, password, name);
      
      if (!authUser) return;
      
      const userWithSwipes = initializeSwipes(authUser);
      
      setUser(userWithSwipes);
      localStorage.setItem("matchmeadows_user", JSON.stringify(userWithSwipes));
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign up failed",
        description: "Please check your information and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem("matchmeadows_user");
    } catch (error) {
      console.error("Sign out error:", error);
      // Even if sign out fails with Supabase, clear local user state
      setUser(null);
      localStorage.removeItem("matchmeadows_user");
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      if (!navigator.onLine) {
        toast({
          title: "You're offline",
          description: "Password reset requires an internet connection",
          variant: "destructive"
        });
        return;
      }
      
      await resetPasswordService(email);
      toast({
        title: "Reset email sent",
        description: "Please check your email for instructions"
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Password reset failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmPasswordReset = async (token: string, password: string) => {
    setIsLoading(true);
    try {
      if (!navigator.onLine) {
        toast({
          title: "You're offline",
          description: "Password reset requires an internet connection",
          variant: "destructive"
        });
        return;
      }
      
      await confirmPasswordResetService(token, password);
      toast({
        title: "Password reset successful",
        description: "You can now sign in with your new password"
      });
    } catch (error) {
      console.error("Confirm password reset error:", error);
      toast({
        title: "Password reset failed",
        description: "Please try again or request a new reset link",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      let updatedUser;
      
      if (navigator.onLine) {
        updatedUser = await updateUserProfile(user.id, profileData);
      } else {
        // Store profile update for later sync
        await storeOfflineData("profile_updates", {
          timestamp: new Date().toISOString(),
          userId: user.id,
          data: profileData
        });
        
        // Update local user object
        updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            ...profileData
          }
        };
        
        toast({
          title: "Profile updated offline",
          description: "Changes will sync when you're back online"
        });
      }
      
      if (user.swipes) {
        updatedUser.swipes = user.swipes;
      }
      
      setUser(updatedUser);
      localStorage.setItem("matchmeadows_user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Update profile error:", error);
      toast({
        title: "Failed to update profile",
        description: navigator.onLine 
          ? "Please try again later" 
          : "You're offline. Changes will be saved when you reconnect",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requestVerification = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (!navigator.onLine) {
        toast({
          title: "You're offline",
          description: "Verification requires an internet connection",
          variant: "destructive"
        });
        return;
      }
      
      const updatedUser = await requestVerificationService(user.id);
      
      if (user.swipes) {
        updatedUser.swipes = user.swipes;
      }
      
      setUser(updatedUser);
      localStorage.setItem("matchmeadows_user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Request verification error:", error);
      toast({
        title: "Verification request failed",
        description: "Please try again later",
        variant: "destructive"
      });
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
      id: `report-${Date.now()}`,
      userId: user.id,
      content,
      type,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    
    if (navigator.onLine) {
      try {
        const { error } = await supabase
          .from('reports')
          .insert(report);
          
        if (error) throw error;
      } catch (error) {
        console.error("Error submitting report to server:", error);
        // Fall back to offline storage
        await storeOfflineData("reports", report);
        toast({
          title: "Report saved offline",
          description: "Will be submitted when you're back online"
        });
      }
    } else {
      // Store report offline
      await storeOfflineData("reports", report);
      toast({
        title: "Report saved offline",
        description: "Will be submitted when you're back online"
      });
    }
    
    // Also store in local storage for backward compatibility
    const existingReportsJSON = localStorage.getItem("matchmeadows_reports");
    const existingReports = existingReportsJSON ? JSON.parse(existingReportsJSON) : [];
    const updatedReports = [...existingReports, report];
    localStorage.setItem("matchmeadows_reports", JSON.stringify(updatedReports));
    
    return new Promise((resolve) => setTimeout(resolve, 500));
  };
  
  // Helper function to sync offline data after login
  const syncOfflineData = async (userId: string) => {
    try {
      // Sync profile updates
      const profileUpdates = await getOfflineData("profile_updates");
      const userUpdates = profileUpdates.filter(update => update.userId === userId);
      
      for (const update of userUpdates) {
        try {
          await updateUserProfile(userId, update.data);
          await storeOfflineData("profile_updates", update.timestamp);
        } catch (err) {
          console.error("Error syncing profile update:", err);
        }
      }
      
      // Sync other offline data as needed
      
      console.log("User-specific offline data sync completed");
    } catch (error) {
      console.error("Error during user offline data sync:", error);
    }
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
