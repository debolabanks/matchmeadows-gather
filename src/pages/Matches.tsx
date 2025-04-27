import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Match } from "@/types/match";
import MatchesHeader from "@/components/matches/MatchesHeader";
import CrossAppAlert from "@/components/matches/CrossAppAlert";
import MatchTabs from "@/components/matches/MatchTabs";
import { useMatchRecommendations } from "@/components/matches/MatchRecommendations";
import { useIsMobile } from "@/hooks/use-mobile";
import { getMatches, subscribeToMatches } from "@/services/matchService";

const Matches = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  
  const { recommendations, aiRecommendations } = useMatchRecommendations({
    userProfile: user?.profile,
    existingMatches: matches
  });

  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      getMatches(user.id)
        .then(setMatches)
        .catch(console.error)
        .finally(() => setIsLoading(false));

      // Subscribe to realtime updates
      const subscription = subscribeToMatches(user.id, setMatches);

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user?.id]);

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
