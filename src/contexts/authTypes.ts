
export type User = {
  id: string;
  name: string;
  email: string;
  provider: "email";
  profile?: UserProfile;
  verified?: boolean;
  swipes?: {
    count: number;
    resetAt: string;
  };
};

export type UserProfile = {
  age?: number;
  gender?: "male" | "female" | "non-binary" | "prefer-not-to-say";
  location?: string;
  bio?: string;
  interests?: string[];
  photos?: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  verificationStatus?: "unverified" | "pending" | "verified";
  faceVerified?: boolean;
  faceVerificationDate?: string;
  locationPrivacy?: "public" | "friends" | "private";
  language?: "en" | "es" | "fr" | "de" | "zh" | "ja" | "ko" | "pt" | "ru";
  subscriptionStatus?: "none" | "active" | "expired";
  subscriptionPlan?: "monthly" | "biannual" | "yearly";
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  privacySettings?: {
    showActivity?: boolean;
    showDistance?: boolean;
    showOnlineStatus?: boolean;
    profileVisibility?: "public" | "matches-only" | "private";
    allowVideoCall?: boolean;
    allowVoiceCall?: boolean;
  };
  // New verification fields
  phoneNumber?: string;
  phoneVerified?: boolean;
  termsAccepted?: string;
  notificationsEnabled?: boolean;
  // Creator profile related fields
  isCreator?: boolean;
  creatorProfile?: {
    displayName?: string;
    categories?: string[];
    bio?: string;
    subscriptionTiers?: {
      basic?: {
        price: number;
        benefits: string[];
      };
      premium?: {
        price: number;
        benefits: string[];
      };
      vip?: {
        price: number;
        benefits: string[];
      };
    };
    totalSubscribers?: number;
    earnings?: {
      total: number;
      lastMonth: number;
      pendingPayout: number;
    };
    streamKey?: string;
    streamServerUrl?: string;
  };
};

export interface Report {
  id?: string;
  type: "profile" | "message" | "stream";
  targetId: string;
  reason: string;
  status?: "pending" | "reviewed" | "resolved";
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User | undefined>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (email: string, newPassword: string) => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  requestVerification: () => Promise<void>;
  useSwipe: () => Promise<{ success: boolean }>;
  getSwipesRemaining: () => number;
  submitReport: (report: Omit<Report, "id" | "status" | "createdAt">) => Promise<void>;
}
