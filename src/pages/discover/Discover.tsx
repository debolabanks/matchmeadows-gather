
import { useState, useEffect } from "react";
import { Filter, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { checkSubscription } from "@/services/stripeService";
import { MatchCriteria, filterProfilesByPreferences, rankProfilesByCompatibility } from "@/utils/matchingAlgorithm";
import ProfileFilters from "./components/ProfileFilters";
import ProfileDisplay from "./components/ProfileDisplay";
import NoProfilesFound from "./components/NoProfilesFound";
import { useRealtimeProfiles } from "@/hooks/useRealtimeProfiles";
import SubscriptionStatus from "./components/SubscriptionStatus";
import { useSwipeHandling } from "./hooks/useSwipeHandling";
import { convertProfileToCardProps } from "./utils/profileUtils";

const Discover = () => {
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const { profiles: allProfiles, isLoading } = useRealtimeProfiles();
  const [filteredProfiles, setFilteredProfiles] = useState(allProfiles);
  const [currentProfiles, setCurrentProfiles] = useState(allProfiles);
  const [matches, setMatches] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [inFreeTrial, setInFreeTrial] = useState(false);
  const [freeTrialEndsAt, setFreeTrialEndsAt] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<MatchCriteria>({
    minAge: 18,
    maxAge: 50,
    gender: "any",
    maxDistance: 50,
    interests: user?.profile?.interests || []
  });

  const { swipesRemaining, setSwipesRemaining, handleSwipe } = useSwipeHandling(isSubscribed || inFreeTrial);

  useEffect(() => {
    if (user) {
      // Check subscription status
      const isUserSubscribed = user.profile?.subscriptionStatus === "active";
      setIsSubscribed(isUserSubscribed);
      
      // Check free trial status
      const trialStartDate = user.profile?.trialStartDate;
      if (trialStartDate) {
        const trialStart = new Date(trialStartDate);
        const trialEnd = new Date(trialStart.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
        const now = new Date();
        
        if (now < trialEnd) {
          setInFreeTrial(true);
          setFreeTrialEndsAt(trialEnd.toISOString());
        } else {
          setInFreeTrial(false);
          setFreeTrialEndsAt(null);
        }
      }
      
      setSwipesRemaining(isUserSubscribed || inFreeTrial ? Infinity : 20);
    }
  }, [user]);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (user) {
        try {
          const { isSubscribed: subscribed } = await checkSubscription();
          setIsSubscribed(subscribed || user.profile?.subscriptionStatus === "active");
        } catch (error) {
          console.error("Error checking subscription:", error);
        }
      }
    };
    
    fetchSubscriptionStatus();
  }, [user]);

  useEffect(() => {
    if (!isLoading) {
      let filtered = filterProfilesByPreferences(
        allProfiles,
        preferences,
        user?.profile?.coordinates ? 
          { latitude: user.profile.coordinates.lat, longitude: user.profile.coordinates.lng } : 
          undefined
      );
      
      filtered = filtered.filter(
        profile => !matches.includes(profile.id) && !rejected.includes(profile.id)
      );
      
      if (user?.profile?.interests) {
        filtered = rankProfilesByCompatibility(
          filtered, 
          user.profile.interests,
          { profile: { subscriptionStatus: isSubscribed ? "active" : "none" } }
        );
      }
      
      setFilteredProfiles(filtered);
      setCurrentProfiles(filtered);
    }
  }, [preferences, matches, rejected, user?.profile?.interests, user?.profile?.coordinates, isSubscribed, allProfiles, isLoading]);

  useEffect(() => {
    if (currentProfiles.length === 0) {
      const timer = setTimeout(() => {
        setCurrentProfiles(filteredProfiles.length > 0 ? filteredProfiles : allProfiles);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentProfiles, filteredProfiles, allProfiles]);

  const handleLike = async (id: string) => {
    const profile = currentProfiles.find(p => p.id === id);
    const success = await handleSwipe(true, id, profile?.name);
    if (success) {
      setMatches(prev => [...prev, id]);
      setCurrentProfiles(prev => prev.filter(profile => profile.id !== id));
    }
  };

  const handleDislike = async (id: string) => {
    const success = await handleSwipe(false, id);
    if (success) {
      setRejected(prev => [...prev, id]);
      setCurrentProfiles(prev => prev.filter(profile => profile.id !== id));
    }
  };

  const handlePreferencesChange = (newPreferences: Partial<MatchCriteria>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  const profilesWithCardProps = currentProfiles.map(convertProfileToCardProps);

  return (
    <div className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Discover</h1>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1"
        >
          <Filter className="h-4 w-4" />
          Filters
          {showFilters ? (
            <ChevronUp className="h-4 w-4 ml-1" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-1" />
          )}
        </Button>
      </div>
      
      <SubscriptionStatus 
        user={user}
        isSubscribed={isSubscribed}
        swipesRemaining={swipesRemaining}
        inFreeTrial={inFreeTrial}
        freeTrialEndsAt={freeTrialEndsAt}
      />
      
      {showFilters && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-5 duration-300">
          <ProfileFilters 
            preferences={preferences} 
            onChange={handlePreferencesChange} 
          />
        </div>
      )}
      
      {filteredProfiles.length === 0 && currentProfiles.length === 0 ? (
        <NoProfilesFound onShowFilters={() => setShowFilters(true)} />
      ) : (
        <ProfileDisplay 
          currentProfiles={profilesWithCardProps}
          handleLike={handleLike}
          handleDislike={handleDislike}
          preferences={preferences}
          isPremium={isSubscribed || inFreeTrial}
        />
      )}
    </div>
  );
};

export default Discover;
