

export type User = {
  id: string;
  name: string;
  email: string;
  provider: "email";
  profile?: UserProfile;
  verified?: boolean;
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
  privacySettings?: {
    showActivity?: boolean;
    showDistance?: boolean;
    showOnlineStatus?: boolean;
    profileVisibility?: "public" | "matches-only" | "private";
    allowVideoCall?: boolean;
    allowVoiceCall?: boolean;
  };
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (email: string, newPassword: string) => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  requestVerification: () => Promise<void>;
};

