
// Extend existing types to match our updated profile structure
export interface UserProfile {
  bio?: string;
  location?: string;
  photos?: string[];
  interests?: string[];
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  premium?: boolean;
  lastActive?: string;
  status?: string;
  createdAt?: string;
  age?: number;
  gender?: string;
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
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  verified?: boolean;
  provider: string;
  profile?: UserProfile;
  swipes?: {
    remaining: number;
    lastReset: string;
    count?: number; // Adding for backward compatibility
    resetAt?: string; // Adding for backward compatibility
  };
}

// Add a new interface that includes ID for use with Supabase
export interface UserProfileWithId extends UserProfile {
  id: string;
  name: string;
}
