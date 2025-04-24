
import { User } from "@/contexts/authTypes";

// Helper function to get the next reset time (24 hours from now)
export const getNextResetTime = (): string => {
  const date = new Date();
  date.setHours(date.getHours() + 24);
  return date.toISOString();
};

// Helper function to calculate trial status
export const getTrialStatus = (user: User | null): { 
  isActive: boolean; 
  daysRemaining: number;
} => {
  if (!user || !user.trial) {
    return { isActive: false, daysRemaining: 0 };
  }
  
  const now = new Date();
  const trialEndDate = new Date(user.trial.endDate);
  
  // Calculate days remaining in trial
  const differenceInTime = trialEndDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  
  // Trial is active if current date is before the end date
  const isActive = now < trialEndDate;
  
  return { 
    isActive, 
    daysRemaining: Math.max(0, daysRemaining)
  };
};

// Helper to set up trial for new users
export const setupTrialForNewUser = (user: User): User => {
  // If user already has trial information, don't modify it
  if (user.trial) return user;
  
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7); // 7 days trial
  
  return {
    ...user,
    trial: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive: true
    }
  };
};

// Hook for managing user swipes
export const useSwipes = () => {
  // Function to initialize swipes if not already present
  const initializeSwipes = (user: User): User => {
    if (!user.swipes) {
      user.swipes = {
        count: 0,
        resetAt: getNextResetTime()
      };
    }
    
    // Initialize trial for new users
    if (!user.trial) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7); // 7 days trial
      
      user.trial = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isActive: true
      };
    }
    
    return user;
  };

  // Function to check and reset swipes if needed
  const checkAndResetSwipes = (user: User): User => {
    if (!user.swipes) {
      return initializeSwipes(user);
    }

    const resetAt = new Date(user.swipes.resetAt);
    const now = new Date();
    
    if (now > resetAt) {
      user.swipes = {
        count: 0,
        resetAt: getNextResetTime()
      };
    }
    
    return user;
  };

  // Function to use a swipe and check if user has swipes available
  const useSwipe = (user: User | null): { success: boolean; updatedUser: User | null } => {
    if (!user) return { success: false, updatedUser: null };
    
    // Check trial status
    const { isActive: isTrialActive } = getTrialStatus(user);
    
    // During trial period, users get unlimited swipes
    if (isTrialActive) {
      return { success: true, updatedUser: user };
    }
    
    // Premium users get unlimited swipes
    if (user.profile?.subscriptionStatus === "active") {
      return { success: true, updatedUser: user };
    }
    
    // Check and reset swipes if needed
    const updatedUser = checkAndResetSwipes({ ...user });
    
    // Check if user has used all swipes
    if (updatedUser.swipes.count >= 10) {
      return { success: false, updatedUser };
    }
    
    // Use a swipe
    updatedUser.swipes.count += 1;
    
    return { success: true, updatedUser };
  };
  
  // Function to get remaining swipes
  const getSwipesRemaining = (user: User | null): number => {
    if (!user) return 0;
    
    // Check if user is in trial period
    const { isActive: isTrialActive } = getTrialStatus(user);
    
    // During trial period, users get unlimited swipes
    if (isTrialActive) {
      return Infinity;
    }
    
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

  return {
    initializeSwipes,
    checkAndResetSwipes,
    useSwipe,
    getSwipesRemaining,
    getTrialStatus,
    setupTrialForNewUser
  };
};
