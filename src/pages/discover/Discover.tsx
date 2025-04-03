import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Filter, ChevronUp, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AdBanner from "@/components/AdBanner";
import { MatchCriteria, filterProfilesByPreferences, rankProfilesByCompatibility } from "@/utils/matchingAlgorithm";
import ProfileFilters from "./components/ProfileFilters";
import ProfileDisplay from "./components/ProfileDisplay";
import SwipeStatus from "./components/SwipeStatus";
import NoProfilesFound from "./components/NoProfilesFound";
import { sampleProfiles } from "./data/sampleProfiles";
import { formatDistanceToNow } from "date-fns";

const Discover = () => {
  const { user, useSwipe, getSwipesRemaining } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProfiles, setFilteredProfiles] = useState(sampleProfiles);
  const [currentProfiles, setCurrentProfiles] = useState(sampleProfiles);
  const [matches, setMatches] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [swipesRemaining, setSwipesRemaining] = useState(10);
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [preferences, setPreferences] = useState<MatchCriteria>({
    minAge: 18,
    maxAge: 50,
    gender: "any",
    maxDistance: 50,
    interests: user?.profile?.interests || []
  });
  const { toast } = useToast();
  
  const isPremium = user?.profile?.subscriptionStatus === "active";
  
  useEffect(() => {
    let filtered = filterProfilesByPreferences(
      sampleProfiles,
      preferences,
      user?.profile?.coordinates
    );
    
    filtered = filtered.filter(
      profile => !matches.includes(profile.id) && !rejected.includes(profile.id)
    );
    
    if (user?.profile?.interests) {
      filtered = rankProfilesByCompatibility(filtered, user.profile.interests);
    }
    
    setFilteredProfiles(filtered);
    setCurrentProfiles(filtered);
  }, [preferences, matches, rejected, user?.profile?.interests, user?.profile?.coordinates]);
  
  useEffect(() => {
    if (user) {
      setSwipesRemaining(getSwipesRemaining());
      
      if (user.swipes?.resetAt && !isPremium) {
        const resetTime = new Date(user.swipes.resetAt);
        const updateTimer = () => {
          const now = new Date();
          if (now >= resetTime) {
            setSwipesRemaining(10);
            setRemainingTime("");
          } else {
            setRemainingTime(formatDistanceToNow(resetTime, { addSuffix: true }));
          }
        };
        
        updateTimer();
        const interval = setInterval(updateTimer, 60000);
        
        return () => clearInterval(interval);
      }
    }
  }, [user, isPremium, getSwipesRemaining]);
  
  const handleLike = async (id: string) => {
    const canSwipe = await useSwipe();
    
    if (!canSwipe) {
      toast({
        title: "Swipe limit reached",
        description: "You've used all your daily swipes. Upgrade to Premium for unlimited swipes!",
        variant: "destructive",
      });
      return;
    }
    
    setSwipesRemaining(getSwipesRemaining());
    
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
    const canSwipe = await useSwipe();
    
    if (!canSwipe) {
      toast({
        title: "Swipe limit reached",
        description: "You've used all your daily swipes. Upgrade to Premium for unlimited swipes!",
        variant: "destructive",
      });
      return;
    }
    
    setSwipesRemaining(getSwipesRemaining());
    
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
      {!isPremium && <AdBanner variant="large" adSlot="1234567890" />}
      
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
      
      {!isPremium && (
        <SwipeStatus 
          swipesRemaining={swipesRemaining}
          remainingTime={remainingTime}
          isPremium={isPremium}
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
      
      {!isPremium && <AdBanner position="sidebar" variant="small" adSlot="0987654321" />}
      
      {filteredProfiles.length === 0 && currentProfiles.length === 0 ? (
        <NoProfilesFound onShowFilters={() => setShowFilters(true)} />
      ) : (
        <ProfileDisplay 
          currentProfiles={currentProfiles}
          handleLike={handleLike}
          handleDislike={handleDislike}
          preferences={preferences}
          isPremium={isPremium}
        />
      )}
      
      {!isPremium && <AdBanner variant="small" position="bottom" adSlot="5678901234" />}
    </div>
  );
};

export default Discover;
