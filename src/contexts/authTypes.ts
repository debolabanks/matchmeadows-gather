
import { User, UserProfile } from "@/types/user";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string, userData?: object) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword?: (email: string) => Promise<void>;
  confirmPasswordReset?: (token: string, password: string) => Promise<void>;
  updateProfile?: (userData: Partial<UserProfile>) => Promise<void>;
  requestVerification?: () => Promise<void>;
  useSwipe: () => Promise<{ success: boolean; remaining?: number }>;
  getSwipesRemaining: () => number;
  submitReport?: (content: string, type: string) => Promise<void>;
  devModeEnabled?: boolean;
  toggleDevMode?: () => void;
}

// Re-export the User and UserProfile types to fix import errors
export type { User, UserProfile };
