
export interface User {
  id: string;
  name: string;
  email: string;
  provider?: string;
  profile?: UserProfile;
  swipes?: {
    count: number;
    lastReset?: string;
    resetAt?: string; // Added this for Discover.tsx
  };
  verified?: boolean; // Added for verification checks
}

export interface UserProfile {
  bio?: string;
  location?: string;
  interests?: string[];
  preferences?: {
    gender?: string;
    ageRange?: [number, number];
    distance?: number;
  };
  photos?: string[];
  verified?: boolean;
  subscriptionStatus?: "free" | "active" | "expired";
  
  // Added fields for verification components
  verificationStatus?: "unverified" | "pending" | "verified";
  phoneVerified?: boolean;
  phoneNumber?: string;
  faceVerified?: boolean;
  faceVerificationDate?: string;
  
  // Added profile settings
  age?: number;
  gender?: string;
  locationPrivacy?: "public" | "friends" | "private";
  language?: string;
  privacySettings?: {
    showActivity?: boolean;
    showDistance?: boolean;
    showOnlineStatus?: boolean;
    profileVisibility?: string;
  };
  
  // Added for discover functionality
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  
  // Additional user settings
  termsAccepted?: boolean;
}

export interface Report {
  id: string;
  userId: string;
  targetId?: string;
  content: string;
  type: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: string;
}
