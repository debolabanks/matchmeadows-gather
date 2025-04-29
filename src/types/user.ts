
// Define the complete UserProfile type with all properties used in the application
export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  photoURL?: string;
  age?: number;
  gender?: string;
  location?: string;
  bio?: string;
  interests?: string[];
  photos?: string[];
  isVerified?: boolean;
  isOnline?: boolean;
  isPremium?: boolean;
  freeTrialStartDate?: string | null;
  matchPoints?: number;
  badges?: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
  // Additional properties used throughout the application
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  premium?: boolean;
  lastActive?: string;
  status?: string;
  createdAt?: string;
  phoneNumber?: string;
  phoneVerified?: boolean;
  faceVerified?: boolean;
  faceVerificationDate?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'none';
  coordinates?: { lat: number; lng: number };
  locationPrivacy?: 'public' | 'friends' | 'private';
  language?: string;
  privacySettings?: {
    showActivity: boolean;
    showDistance: boolean; 
    showOnlineStatus: boolean;
    profileVisibility: 'public' | 'matches-only' | 'private';
  };
  termsAccepted?: boolean;
  distance?: number;
  compatibility?: number;
  boosted?: boolean;
  boostExpiry?: string | null;
  trialStartDate?: string;
  trialEndDate?: string;
}

// Re-add the User interface that was removed
export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  verified?: boolean;
  provider?: string;
  profile?: UserProfile;
  swipes?: {
    remaining: number;
    lastReset: string;
    count?: number; 
    resetAt?: string;
  };
}

// Re-add the UserProfileWithId interface that was removed
export interface UserProfileWithId extends UserProfile {
  id: string;
  name: string;
  distance?: number;
  compatibility?: number;
  boosted?: boolean;
  boostExpiry?: string | null;
}
