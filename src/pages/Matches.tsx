
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { enhanceMatchesWithPersonalization } from "@/utils/activity";
import { Match } from "@/types/match";
import MatchesHeader from "@/components/matches/MatchesHeader";
import CrossAppAlert from "@/components/matches/CrossAppAlert";
import MatchTabs from "@/components/matches/MatchTabs";
import { useMatchRecommendations } from "@/components/matches/MatchRecommendations";
import { defaultUserProfile } from "@/components/matches/defaultUserProfile";
import { sampleMatches } from "@/components/matches/sampleMatches";
import { useIsMobile } from "@/hooks/use-mobile";

const Matches = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [matches, setMatches] = useState<Match[]>(sampleMatches); // Initialize with sample data directly
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  
  // Use the current user's profile or default to sample profile
  const userProfile = user?.profile || defaultUserProfile;
  
  // Get recommendations using our custom hook
  const { recommendations, aiRecommendations } = useMatchRecommendations({
    userProfile,
    existingMatches: sampleMatches
  });
  
  useEffect(() => {
    // If there are recommendations, enhance the existing matches with AI compatibility data
    if (recommendations.length > 0) {
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
      
      setMatches(enhancedMatches);
    }
  }, [recommendations]);

  return (
    <div className={`container mx-auto px-4 py-8 ${isMobile ? 'pt-16 pb-20' : 'pt-20 md:pt-24 pb-24'}`}>
      <MatchesHeader title="Your Matches" />
      {!isMobile && <CrossAppAlert />}
      
      <MatchTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        matches={matches}
        aiRecommendations={aiRecommendations}
      />
    </div>
  );
};

export default Matches;
