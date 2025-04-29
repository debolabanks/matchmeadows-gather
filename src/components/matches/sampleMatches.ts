
import { Match } from "@/types/match";

export const sampleMatches: Match[] = [
  {
    id: "1",
    userId: "user-1",
    matchedUserId: "user-2",
    name: "Emma",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    lastActive: "2 hours ago",
    matchDate: "2 days ago",
    hasUnreadMessage: true,
    compatibilityScore: 87,
    compatibilityPercentage: 87,
    aiCompatibility: {
      score: 87,
      strengths: ["Common interests", "Similar age", "Compatible communication"],
      weaknesses: ["Different activity preferences"],
      suggestion: "Try sharing travel experiences to build connection",
      insights: ["You share 3 interests", "You're close in age", "Similar communication patterns"],
      commonInterests: ["Hiking", "Coffee", "Photography"]
    }
  },
  {
    id: "3",
    userId: "user-1",
    matchedUserId: "user-3",
    name: "Sophia",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80",
    lastActive: "5 mins ago",
    matchDate: "1 week ago",
    hasUnreadMessage: true,
    compatibilityScore: 92,
    compatibilityPercentage: 92,
    aiCompatibility: {
      score: 92,
      strengths: ["Many shared interests", "Close proximity", "Compatible communication"],
      weaknesses: [],
      suggestion: "This is a very strong match! Schedule a video call to connect.",
      insights: ["You share 4 interests", "You're very close to each other", "Similar communication patterns"],
      commonInterests: ["Coffee", "Reading", "Travel", "Photography"]
    }
  },
  {
    id: "5",
    userId: "user-1",
    matchedUserId: "user-4",
    name: "Olivia",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80",
    lastActive: "1 day ago",
    matchDate: "3 days ago",
    hasUnreadMessage: false,
    compatibilityScore: 75,
    compatibilityPercentage: 75,
    aiCompatibility: {
      score: 75,
      strengths: ["Common interests in reading"],
      weaknesses: ["Different activity preferences", "Different communication styles"],
      suggestion: "Find more common interests through book discussions",
      insights: ["You share 2 interests", "You're close in age"],
      commonInterests: ["Reading", "Travel"]
    }
  }
];
