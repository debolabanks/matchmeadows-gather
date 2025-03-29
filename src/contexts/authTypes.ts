
export type User = {
  id: string;
  name: string;
  email: string;
  provider: "email";
  profile?: UserProfile;
};

export type UserProfile = {
  age?: number;
  gender?: "male" | "female" | "non-binary" | "prefer-not-to-say";
  location?: string;
  bio?: string;
  interests?: string[];
  photos?: string[];
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
};
