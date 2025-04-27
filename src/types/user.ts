
// Extend existing types to match our updated profile structure
export interface UserProfile {
  bio?: string;
  location?: string;
  photos?: string[];
  interests?: string[];
  verificationStatus?: string;
  premium?: boolean;
  lastActive?: string;
  status?: string;
  createdAt?: string;
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
  };
}

// Add a new interface that includes ID for use with Supabase
export interface UserProfileWithId extends UserProfile {
  id: string;
  name: string;
}
