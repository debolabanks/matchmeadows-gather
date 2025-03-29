
import { useState, useEffect } from "react";
import ProfileCard, { ProfileCardProps } from "@/components/ProfileCard";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Filter, MapPin, Users } from "lucide-react";
import MatchPreferences from "@/components/MatchPreferences";
import { MatchCriteria, filterProfilesByPreferences, rankProfilesByCompatibility } from "@/utils/matchingAlgorithm";
import { useAuth } from "@/hooks/useAuth";

// Enhanced sample data for profiles
const sampleProfiles: Omit<ProfileCardProps, 'onLike' | 'onDislike'>[] = [
  {
    id: "1",
    name: "Emma",
    age: 28,
    gender: "female",
    location: "New York",
    bio: "Passionate about photography, hiking, and trying new recipes. Looking for someone who enjoys outdoor adventures and quiet evenings with a good book.",
    interests: ["Photography", "Hiking", "Cooking", "Reading"],
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    distance: "5 miles",
    coordinates: { latitude: 40.7128, longitude: -74.0060 }
  },
  {
    id: "2",
    name: "James",
    age: 32,
    gender: "male",
    location: "Boston",
    bio: "Software engineer by day, musician by night. I love finding new coffee shops, attending local concerts, and exploring the city on my bike.",
    interests: ["Music", "Coding", "Coffee", "Cycling"],
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    distance: "12 miles",
    coordinates: { latitude: 42.3601, longitude: -71.0589 }
  },
  {
    id: "3",
    name: "Sophia",
    age: 26,
    gender: "female",
    location: "San Francisco",
    bio: "Yoga instructor and avid traveler. I've visited 20 countries so far and always planning my next adventure. Looking for someone with wanderlust and a positive outlook.",
    interests: ["Yoga", "Travel", "Languages", "Meditation"],
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80",
    distance: "8 miles",
    coordinates: { latitude: 37.7749, longitude: -122.4194 }
  },
  {
    id: "4",
    name: "Michael",
    age: 30,
    gender: "male",
    location: "Chicago",
    bio: "Chef at a local restaurant. Passionate about food, wine, and exploring farmers markets. When I'm not cooking, you can find me at sports events or trying new restaurants.",
    interests: ["Cooking", "Wine", "Sports", "Food"],
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    distance: "3 miles",
    coordinates: { latitude: 41.8781, longitude: -87.6298 }
  },
  {
    id: "5",
    name: "Olivia",
    age: 27,
    gender: "female",
    location: "Los Angeles",
    bio: "Film industry professional with a passion for storytelling. Love hiking in the canyons, beach days, and finding the best tacos in the city. Looking for genuine connections.",
    interests: ["Movies", "Hiking", "Beach", "Arts"],
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80",
    distance: "7 miles",
    coordinates: { latitude: 34.0522, longitude: -118.2437 }
  },
  {
    id: "6",
    name: "Ethan",
    age: 29,
    gender: "male",
    location: "Denver",
    bio: "Mountain enthusiast and craft beer lover. When I'm not hiking or skiing, I'm trying new breweries or playing with my dog in the park.",
    interests: ["Hiking", "Skiing", "Beer", "Dogs"],
    imageUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=776&q=80",
    distance: "15 miles",
    coordinates: { latitude: 39.7392, longitude: -104.9903 }
  },
  {
    id: "7",
    name: "Ava",
    age: 25,
    gender: "female",
    location: "Seattle",
    bio: "Environmental scientist by day, indie music fan by night. I enjoy kayaking, exploring coffee shops, and attending local art exhibitions.",
    interests: ["Nature", "Music", "Coffee", "Art"],
    imageUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=776&q=80",
    distance: "10 miles",
    coordinates: { latitude: 47.6062, longitude: -122.3321 }
  }
];

const Discover = () => {
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProfiles, setFilteredProfiles] = useState(sampleProfiles);
  const [currentProfiles, setCurrentProfiles] = useState(sampleProfiles);
  const [matches, setMatches] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<MatchCriteria>({
    minAge: 18,
    maxAge: 50,
    gender: "any",
    maxDistance: 50,
    interests: user?.profile?.interests || []
  });
  const { toast } = useToast();
  
  // Apply filters when preferences change
  useEffect(() => {
    // Filter profiles by preferences
    let filtered = filterProfilesByPreferences(
      sampleProfiles,
      preferences,
      user?.profile?.coordinates
    );
    
    // Remove already matched or rejected profiles
    filtered = filtered.filter(
      profile => !matches.includes(profile.id) && !rejected.includes(profile.id)
    );
    
    // Rank by compatibility
    if (user?.profile?.interests) {
      filtered = rankProfilesByCompatibility(filtered, user.profile.interests);
    }
    
    setFilteredProfiles(filtered);
    setCurrentProfiles(filtered);
  }, [preferences, matches, rejected, user?.profile?.interests, user?.profile?.coordinates]);
  
  const handleLike = (id: string) => {
    // Simulating a 20% chance of a match
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
    
    // Remove the profile from the list
    setCurrentProfiles(prev => prev.filter(profile => profile.id !== id));
  };
  
  const handleDislike = (id: string) => {
    // Add to rejected list
    setRejected(prev => [...prev, id]);
    
    // Remove the profile from the list
    setCurrentProfiles(prev => prev.filter(profile => profile.id !== id));
  };
  
  const handlePreferencesChange = (newPreferences: Partial<MatchCriteria>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };
  
  // Reset profiles when empty
  useEffect(() => {
    if (currentProfiles.length === 0) {
      // In a real app, we would fetch more profiles
      // For demo, we'll reset to the filtered data after a delay
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
      
      {showFilters && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-5 duration-300">
          <MatchPreferences 
            preferences={preferences} 
            onChange={handlePreferencesChange} 
          />
        </div>
      )}
      
      {filteredProfiles.length === 0 && currentProfiles.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No profiles match your criteria</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your preferences to see more people
          </p>
          <Button 
            variant="default" 
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Adjust Filters
          </Button>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          {currentProfiles.length > 0 ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Showing profiles within {preferences.maxDistance} miles
                </span>
              </div>
              <ProfileCard
                {...currentProfiles[0]}
                onLike={handleLike}
                onDislike={handleDislike}
              />
            </>
          ) : (
            <div className="profile-card flex items-center justify-center p-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">No more profiles</h3>
                <p className="text-muted-foreground mb-4">
                  Check back soon for more matches
                </p>
                <div className="animate-pulse bg-love-100 text-love-500 p-2 rounded-full inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
                    <path d="M12 3a9 9 0 0 1 9 9" />
                    <path d="M9 9h.01" />
                    <path d="M15 9h.01" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Discover;
