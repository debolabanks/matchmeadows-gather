
import MatchesList, { Match } from "@/components/MatchesList";
import { getDefaultMatchScore, calculateBadges } from "@/utils/gamification";

// Sample match data with gamification elements
const sampleMatches: Match[] = [
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
    compatibilityPercentage: 87
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
    compatibilityPercentage: 92
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
    compatibilityPercentage: 75
  }
];

const Matches = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-24">
      <MatchesList matches={sampleMatches} />
    </div>
  );
};

export default Matches;
