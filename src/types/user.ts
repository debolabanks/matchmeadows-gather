
export interface User {
  id: string;
  name: string;
  email: string;
  provider?: string;
  profile?: UserProfile;
  swipes?: {
    count: number;
    lastReset?: string;
  };
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
