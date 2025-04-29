
import { useState, useEffect } from "react";
import ProfileCard, { ProfileCardProps } from "@/components/ProfileCard";
import { useToast } from "@/hooks/use-toast";

// Sample data for profiles
const sampleProfiles: Omit<ProfileCardProps, 'onLike' | 'onDislike'>[] = [
  {
    id: "1",
    name: "Emma",
    age: 28,
    location: "New York",
    bio: "Passionate about photography, hiking, and trying new recipes. Looking for someone who enjoys outdoor adventures and quiet evenings with a good book.",
    interests: ["Photography", "Hiking", "Cooking", "Reading"],
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    distance: "5 miles"
  },
  {
    id: "2",
    name: "James",
    age: 32,
    location: "Boston",
    bio: "Software engineer by day, musician by night. I love finding new coffee shops, attending local concerts, and exploring the city on my bike.",
    interests: ["Music", "Coding", "Coffee", "Cycling"],
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    distance: "12 miles"
  },
  {
    id: "3",
    name: "Sophia",
    age: 26,
    location: "San Francisco",
    bio: "Yoga instructor and avid traveler. I've visited 20 countries so far and always planning my next adventure. Looking for someone with wanderlust and a positive outlook.",
    interests: ["Yoga", "Travel", "Languages", "Meditation"],
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80",
    distance: "8 miles"
  },
  {
    id: "4",
    name: "Michael",
    age: 30,
    location: "Chicago",
    bio: "Chef at a local restaurant. Passionate about food, wine, and exploring farmers markets. When I'm not cooking, you can find me at sports events or trying new restaurants.",
    interests: ["Cooking", "Wine", "Sports", "Food"],
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    distance: "3 miles"
  },
  {
    id: "5",
    name: "Olivia",
    age: 27,
    location: "Los Angeles",
    bio: "Film industry professional with a passion for storytelling. Love hiking in the canyons, beach days, and finding the best tacos in the city. Looking for genuine connections.",
    interests: ["Movies", "Hiking", "Beach", "Arts"],
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80",
    distance: "7 miles"
  }
];

const Discover = () => {
  const [currentProfiles, setCurrentProfiles] = useState(sampleProfiles);
  const [matches, setMatches] = useState<string[]>([]);
  const { toast } = useToast();
  
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
    // Remove the profile from the list
    setCurrentProfiles(prev => prev.filter(profile => profile.id !== id));
  };
  
  // Reset profiles when empty
  useEffect(() => {
    if (currentProfiles.length === 0) {
      // In a real app, we would fetch more profiles
      // For demo, we'll reset to the sample data after a delay
      const timer = setTimeout(() => {
        setCurrentProfiles(sampleProfiles);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentProfiles]);

  return (
    <div className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-24">
      <h1 className="text-3xl font-bold text-center mb-8">Discover</h1>
      
      <div className="max-w-md mx-auto">
        {currentProfiles.length > 0 ? (
          <ProfileCard
            {...currentProfiles[0]}
            onLike={handleLike}
            onDislike={handleDislike}
          />
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
    </div>
  );
};

export default Discover;
