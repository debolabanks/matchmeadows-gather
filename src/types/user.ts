// Update the UserProfile type to include matchPoints and badges properties
export interface UserProfile {
  id: string;
  name: string;
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
}
