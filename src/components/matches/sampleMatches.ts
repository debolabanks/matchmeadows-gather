
import { Match } from "@/components/MatchesList";
import { getDefaultMatchScore, calculateBadges } from "@/utils/gamification";

export const sampleMatches: Match[] = [
  {
    id: "1",
    name: "Emma",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    lastActive: "2 hours ago",
    matchDate: "2 days ago",
    hasUnreadMessage: true,
    score: {
      ...getDefaultMatchScore(),
      level: 2,
      points: 215,
      streak: 2,
      badges: calculateBadges(55, 0.92, 2, 7)
    },
    compatibilityPercentage: 87,
    aiCompatibility: {
      score: 87,
      insights: ["You share 3 interests", "You're close in age", "Similar communication patterns"],
      commonInterests: ["Hiking", "Coffee", "Photography"],
      compatibilityReasons: ["Common interests: Hiking, Coffee, Photography", "Similar age group", "Compatible communication styles"]
    }
  },
  {
    id: "3",
    name: "Sophia",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80",
    lastActive: "5 mins ago",
    matchDate: "1 week ago",
    hasUnreadMessage: true,
    score: {
      ...getDefaultMatchScore(),
      level: 3,
      points: 420,
      streak: 7,
      badges: calculateBadges(70, 0.95, 6, 32)
    },
    compatibilityPercentage: 92,
    aiCompatibility: {
      score: 92,
      insights: ["You share 4 interests", "You're very close to each other", "Similar communication patterns"],
      commonInterests: ["Coffee", "Reading", "Travel", "Photography"],
      compatibilityReasons: ["Common interests: Coffee, Reading, Travel, Photography", "Close proximity", "Compatible communication styles"]
    }
  },
  {
    id: "5",
    name: "Olivia",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80",
    lastActive: "1 day ago",
    matchDate: "3 days ago",
    hasUnreadMessage: false,
    score: {
      ...getDefaultMatchScore(),
      level: 1,
      points: 85,
      streak: 0,
      badges: calculateBadges(25, 0.80, 1, 5)
    },
    compatibilityPercentage: 75,
    aiCompatibility: {
      score: 75,
      insights: ["You share 2 interests", "You're close in age"],
      commonInterests: ["Reading", "Travel"],
      compatibilityReasons: ["Common interests: Reading, Travel", "Similar age group"]
    }
  }
];
