
import { useState } from "react";
import MatchesList, { Match } from "@/components/MatchesList";
import { getDefaultMatchScore, calculateBadges } from "@/utils/gamification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAIMatchRecommendations } from "@/utils/matchingAlgorithm";
import { useAuth } from "@/hooks/useAuth";

// Sample user profile for AI matching
const userProfile = {
  id: "current-user",
  name: "You",
  age: 28,
  gender: "non-binary",
  location: "San Francisco, CA",
  interests: ["Hiking", "Coffee", "Reading", "Travel", "Photography"],
  coordinates: {
    latitude: 37.7749,
    longitude: -122.4194
  }
};

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

// Additional profiles for AI recommendations
const additionalProfiles = [
  {
    id: "7",
    name: "Maya",
    age: 29,
    gender: "female",
    location: "Oakland, CA",
    interests: ["Hiking", "Yoga", "Coffee", "Art", "Photography"],
    coordinates: {
      latitude: 37.8044,
      longitude: -122.2711
    },
    imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    lastActive: "3 hours ago",
    matchDate: "Just now",
    hasUnreadMessage: false,
    score: {
      ...getDefaultMatchScore(),
      level: 2,
      points: 180,
      streak: 1,
      badges: calculateBadges(40, 0.85, 3, 12)
    }
  },
  {
    id: "8",
    name: "Lily",
    age: 27,
    gender: "female",
    location: "San Jose, CA",
    interests: ["Reading", "Travel", "Music", "Cinema"],
    coordinates: {
      latitude: 37.3382,
      longitude: -121.8863
    },
    imageUrl: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    lastActive: "1 day ago",
    matchDate: "Just now",
    hasUnreadMessage: false,
    score: {
      ...getDefaultMatchScore(),
      level: 1,
      points: 95,
      streak: 0,
      badges: calculateBadges(25, 0.75, 1, 8)
    }
  }
];

const Matches = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  
  // Prepare AI recommendations by combining matches with potential matches
  const recommendations = getAIMatchRecommendations(
    user?.profile || userProfile,
    [...sampleMatches, ...additionalProfiles]
  );
  
  // Apply aiCompatibility to all matches if not already present
  const enhancedMatches = sampleMatches.map(match => {
    if (match.aiCompatibility) return match;
    const recommendation = recommendations.find(r => r.id === match.id);
    return {
      ...match,
      aiCompatibility: recommendation?.aiCompatibility || {
        score: match.compatibilityPercentage || 50,
        insights: [],
        commonInterests: [],
        compatibilityReasons: []
      }
    };
  });
  
  // Get top AI recommendations (that aren't already matches)
  const aiRecommendations = recommendations
    .filter(profile => !sampleMatches.some(match => match.id === profile.id))
    .map(profile => ({
      id: profile.id,
      name: profile.name,
      imageUrl: profile.imageUrl,
      lastActive: profile.lastActive,
      matchDate: "AI Recommendation",
      hasUnreadMessage: false,
      compatibilityPercentage: profile.aiCompatibility.score,
      aiCompatibility: profile.aiCompatibility,
      score: profile.score || getDefaultMatchScore()
    }));

  return (
    <div className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Matches</h2>
        
        <Button variant="outline" size="sm" className="gap-1">
          <Sparkles className="h-4 w-4 text-amber-500" />
          AI Powered
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>All Matches</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>AI Recommendations</span>
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Recent Activity</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <MatchesList matches={enhancedMatches} />
        </TabsContent>
        
        <TabsContent value="ai">
          <div className="mb-4 bg-amber-50 text-amber-800 rounded-lg p-3 text-sm border border-amber-200">
            <p className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Our AI has analyzed your profile and found these potential matches for you.</span>
            </p>
          </div>
          <MatchesList matches={[...aiRecommendations, ...enhancedMatches.sort((a, b) => 
            (b.aiCompatibility?.score || 0) - (a.aiCompatibility?.score || 0)
          ).slice(0, 3)]} />
        </TabsContent>
        
        <TabsContent value="recent">
          <MatchesList matches={enhancedMatches.sort((a, b) => {
            if (a.hasUnreadMessage && !b.hasUnreadMessage) return -1;
            if (!a.hasUnreadMessage && b.hasUnreadMessage) return 1;
            return 0;
          })} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Matches;
