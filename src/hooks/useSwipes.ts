
import { User } from "@/types/user";

// Constants
const DEFAULT_SWIPES = 10; // Default number of swipes per day
const SWIPE_RESET_HOURS = 24; // Reset swipes every 24 hours

export const useSwipes = () => {
  /**
   * Initialize swipes for a user
   */
  const initializeSwipes = (user: User): User => {
    // If user already has swipes info, check if we need to reset
    if (user.swipes) {
      return checkAndResetSwipes(user);
    }

    // Initialize with default swipes count
    return {
      ...user,
      swipes: {
        remaining: DEFAULT_SWIPES,
        lastReset: new Date().toISOString(),
        count: DEFAULT_SWIPES // Add count for backward compatibility
      }
    };
  };

  /**
   * Check if swipes need to be reset due to time passing
   */
  const checkAndResetSwipes = (user: User): User => {
    if (!user.swipes?.lastReset) {
      return initializeSwipes({ ...user, swipes: undefined });
    }

    const lastReset = new Date(user.swipes.lastReset);
    const now = new Date();
    
    // Calculate hours since last reset
    const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);
    
    // If it's been more than SWIPE_RESET_HOURS, reset the swipes
    if (hoursSinceReset >= SWIPE_RESET_HOURS) {
      return {
        ...user,
        swipes: {
          remaining: DEFAULT_SWIPES,
          lastReset: now.toISOString(),
          count: DEFAULT_SWIPES, // Add count for backward compatibility
          resetAt: new Date(now.getTime() + SWIPE_RESET_HOURS * 60 * 60 * 1000).toISOString() // Add resetAt for backward compatibility
        }
      };
    }

    // Ensure backward compatibility by adding count and resetAt if they don't exist
    if (user.swipes && typeof user.swipes.count === 'undefined') {
      return {
        ...user,
        swipes: {
          ...user.swipes,
          count: user.swipes.remaining,
          resetAt: new Date(lastReset.getTime() + SWIPE_RESET_HOURS * 60 * 60 * 1000).toISOString()
        }
      };
    }

    return user;
  };

  /**
   * Consume a swipe when user performs a swipe action
   */
  const useSwipe = (user: User | null): { success: boolean; updatedUser: User | null } => {
    if (!user) return { success: false, updatedUser: null };
    
    // Check and possibly reset swipes first
    const updatedUser = checkAndResetSwipes(user);
    
    // If no swipes left, return failure
    if (!updatedUser.swipes || updatedUser.swipes.remaining <= 0) {
      return { success: false, updatedUser };
    }
    
    // Decrement swipe count
    const newUser = {
      ...updatedUser,
      swipes: {
        ...updatedUser.swipes,
        remaining: updatedUser.swipes.remaining - 1,
        count: (updatedUser.swipes.count || updatedUser.swipes.remaining) - 1
      }
    };
    
    return { success: true, updatedUser: newUser };
  };
  
  /**
   * Get the remaining swipes for a user
   */
  const getSwipesRemaining = (user: User | null): number => {
    if (!user || !user.swipes) return 0;
    
    const updatedUser = checkAndResetSwipes(user);
    return updatedUser.swipes.remaining;
  };

  return {
    initializeSwipes,
    checkAndResetSwipes,
    useSwipe,
    getSwipesRemaining
  };
};
