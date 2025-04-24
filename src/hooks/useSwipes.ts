
import { User } from "@/contexts/authTypes";

// Helper function to get the next reset time (24 hours from now)
export const getNextResetTime = (): string => {
  const date = new Date();
  date.setHours(date.getHours() + 24);
  return date.toISOString();
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
    
    // Premium users get unlimited swipes
    if (user.profile?.subscriptionStatus === "active") {
      return { success: true, updatedUser: user };
    }
    
    // Check and reset swipes if needed
    const updatedUser = checkAndResetSwipes({ ...user });
    
    // Check if user has used all swipes
    if (updatedUser.swipes.count >= 20) {
      return { success: false, updatedUser };
    }
    
    // Use a swipe
    updatedUser.swipes.count += 1;
    
    return { success: true, updatedUser };
  };
  
  // Function to get remaining swipes
  const getSwipesRemaining = (user: User | null): number => {
    if (!user) return 0;
    
    // Premium users get unlimited swipes
    if (user.profile?.subscriptionStatus === "active") {
      return Infinity;
    }
    
    // Check if swipes are initialized
    if (!user.swipes) {
      return 20;
    }
    
    // Check if swipes need to be reset
    const now = new Date();
    if (new Date(user.swipes.resetAt) < now) {
      return 20;
    }
    
    // Return remaining swipes
    return Math.max(0, 20 - user.swipes.count);
  };

  return {
    initializeSwipes,
    checkAndResetSwipes,
    useSwipe,
    getSwipesRemaining
  };
};
