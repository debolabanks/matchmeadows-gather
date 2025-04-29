
import { User, UserProfile } from "@/types/user";

// This adds sample users for development purposes
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    verified: true,
    provider: "email",
    profile: {
      bio: "I love hiking and photography.",
      location: "San Francisco, CA",
      photos: [
        "https://images.unsplash.com/photo-1560250097-0b93528c311a",
        "https://images.unsplash.com/photo-1562124638-724e13052daf"
      ],
      interests: ["hiking", "photography", "travel"],
      premium: true,
      lastActive: new Date().toISOString(),
      status: "online",
      age: 32,
      gender: "male",
      verificationStatus: "verified",
      coordinates: {
        lat: 37.7749,
        lng: -122.4194
      }
    },
    swipes: {
      remaining: 10,
      lastReset: new Date().toISOString()
    }
  },
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    provider: "email",
    verified: false,
    profile: {
      age: 29,
      gender: "non-binary",
      location: "San Francisco, CA",
      bio: "Coffee enthusiast, hiking lover, and software engineer.",
      interests: ["Hiking", "Coffee", "Coding", "Reading"],
      coordinates: {
        lat: 37.7749,
        lng: -122.4194
      },
      verificationStatus: "unverified",
      locationPrivacy: "public"
    }
  }
];

// A function to get a mock user by ID
export const getMockUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};
