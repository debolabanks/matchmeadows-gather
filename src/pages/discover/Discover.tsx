
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Filter, ChevronUp, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { 
  MatchCriteria, 
  filterProfilesByPreferences, 
  rankProfilesByCompatibility 
} from "@/utils/matchingAlgorithm";
import ProfileFilters from "./components/ProfileFilters";
import ProfileDisplay from "./components/ProfileDisplay";
import SwipeStatus from "./components/SwipeStatus";
import NoProfilesFound from "./components/NoProfilesFound";
import { sampleProfiles } from "./data/sampleProfiles";
import { formatDistanceToNow } from "date-fns";
import { checkSubscription } from "@/services/stripeService";

const Discover = () => {
  const { user, useSwipe, getSwipesRemaining } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProfiles, setFilteredProfiles] = useState(sampleProfiles);
  const [currentProfiles, setCurrentProfiles] = useState(sampleProfiles);
  const [matches, setMatches] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [swipesRemaining, setSwipesRemaining] = useState(20);
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<MatchCriteria>({
    minAge: 18,
    maxAge: 50,
    gender: "any",
    maxDistance: 50,
    interests: user?.profile?.interests || []
  });
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      // Check for premium status from user object
      setIsSubscribed(user.profile?.subscriptionStatus === "active");
      
      const remaining = getSwipesRemaining();
      setSwipesRemaining(remaining);
    }
  }, [user, getSwipesRemaining]);
  
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (user) {
        try {
          const { isSubscribed, plan } = await checkSubscription();
          // Only update subscription status if the user isn't already marked as premium
          if (!isSubscribed && user.profile?.subscriptionStatus !== "active") {
            setIsSubscribed(isSubscribed);
            setSubscriptionPlan(plan);
          } else if (user.profile?.subscriptionStatus === "active") {
            setIsSubscribed(true);
          }
        } catch (error) {
          console.error("Error checking subscription:", error);
        }
      }
    };
    
    fetchSubscriptionStatus();
  }, [user]);
  
  const boostedProfiles = sampleProfiles.map(profile => {
    const isBoosted = Math.random() > 0.8;
    if (isBoosted) {
      const boostExpiry = new Date();
      boostExpiry.setHours(boostExpiry.getHours() + Math.floor(Math.random() * 24) + 1);
      
      return {
        ...profile,
        boosted: true,
        boostExpiry: boostExpiry.toISOString()
      };
    }
    return profile;
  });
  
  useEffect(() => {
    let filtered = filterProfilesByPreferences(
      boostedProfiles,
      preferences,
      user?.profile?.coordinates
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
  }, [preferences, matches, rejected, user?.profile?.interests, user?.profile?.coordinates, isSubscribed]);
  
  useEffect(() => {
    if (user && user.swipes?.resetAt && !isSubscribed) {
      const resetTime = new Date(user.swipes.resetAt);
      
      const updateTimer = () => {
        const now = new Date();
        if (now >= resetTime) {
          setSwipesRemaining(20);
          setRemainingTime("");
        } else {
          setRemainingTime(formatDistanceToNow(resetTime, { addSuffix: true }));
        }
      };
      
      updateTimer();
      const interval = setInterval(updateTimer, 60000);
      
      return () => clearInterval(interval);
    }
  }, [user, isSubscribed]);
  
  const handleLike = async (id: string) => {
    if (!isSubscribed) {
      const result = await useSwipe();
      
      if (!result.success) {
        toast({
          title: "Swipe limit reached",
          description: "You've used all your daily swipes. Upgrade to Premium for unlimited swipes!",
          variant: "destructive",
        });
        return;
      }
      
      setSwipesRemaining(getSwipesRemaining());
    }
    
    const isMatch = Math.random() < 0.2;
    
    if (isMatch) {
      setMatches(prev => [...prev, id]);
      const matchedProfile = sampleProfiles.find(profile => profile.id === id);
      
      toast({
        title: "It's a match! 💕",
        description: `You and ${matchedProfile?.name} liked each other.`,
        variant: "default",
      });
    }
    
    setCurrentProfiles(prev => prev.filter(profile => profile.id !== id));
  };
  
  const handleDislike = async (id: string) => {
    if (!isSubscribed) {
      const result = await useSwipe();
      
      if (!result.success) {
        toast({
          title: "Swipe limit reached",
          description: "You've used all your daily swipes. Upgrade to Premium for unlimited swipes!",
          variant: "destructive",
        });
        return;
      }
      
      setSwipesRemaining(getSwipesRemaining());
    }
    
    setRejected(prev => [...prev, id]);
    
    setCurrentProfiles(prev => prev.filter(profile => profile.id !== id));
  };
  
  const handlePreferencesChange = (newPreferences: Partial<MatchCriteria>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };
  
  useEffect(() => {
    if (currentProfiles.length === 0) {
      const timer = setTimeout(() => {
        setCurrentProfiles(filteredProfiles.length > 0 ? filteredProfiles : sampleProfiles);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentProfiles, filteredProfiles]);
  
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
      
      {!isSubscribed && (
        <SwipeStatus 
          swipesRemaining={swipesRemaining}
          remainingTime={remainingTime}
          isPremium={isSubscribed}
        />
      )}
      
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
          currentProfiles={currentProfiles}
          handleLike={handleLike}
          handleDislike={handleDislike}
          preferences={preferences}
          isPremium={isSubscribed}
        />
      )}
    </div>
  );
};

export default Discover;
