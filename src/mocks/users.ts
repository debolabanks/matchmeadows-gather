
import { UserProfile } from "@/types/user";

// Mock user data for demo purposes
export type MockUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  provider: "email";
  profile?: UserProfile;
  verified?: boolean;
};

export const MOCK_USERS: MockUser[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "password123", // Obviously not secure, just for demo
    provider: "email",
    verified: false,
    profile: {
      age: 29,
      gender: "non-binary",
      location: "San Francisco, CA",
      bio: "Coffee enthusiast, hiking lover, and software engineer.",
      interests: ["Hiking", "Coffee", "Coding", "Reading"],
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      verificationStatus: "unverified",
      locationPrivacy: "public"
    }
  }
];
