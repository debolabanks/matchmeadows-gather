import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreatorGrid from "@/components/creators/CreatorGrid";
import CreatorFilters from "@/components/creators/CreatorFilters";
import CreatorSearch from "@/components/creators/CreatorSearch";
import { Creator } from "@/components/creators/CreatorCard";
import { useAuth } from "@/hooks/useAuth";
import { Video, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMockCreators } from "@/components/creators/mockCreatorsData";

// Use the correct Creator type from our CreatorCard component
const mockCreators: Creator[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    imageUrl: "https://source.unsplash.com/random/100x100/?portrait&1",
    bio: "Digital artist and storyteller. I stream art tutorials and creative sessions.",
    followers: 24500,
    isOnline: true,
    isVerified: true,
    rating: 4.8,
    tags: ["art", "digital", "tutorials"],
    category: "art",
    nextSession: "Tomorrow at 3:00 PM"
  },
  {
    id: "2",
    name: "Michael Torres",
    imageUrl: "https://source.unsplash.com/random/100x100/?portrait&2",
    bio: "Pro gamer and coach. Daily streams of strategy games and competitive play.",
    followers: 156000,
    isOnline: true,
    isVerified: true,
    rating: 4.5,
    tags: ["gaming", "strategy", "esports"],
    category: "gaming",
    nextSession: "Today at 8:00 PM"
  },
  {
    id: "3",
    name: "Emma Chen",
    imageUrl: "https://source.unsplash.com/random/100x100/?portrait&3",
    bio: "Chef and food enthusiast. I share recipes and cooking techniques from around the world.",
    followers: 78200,
    isOnline: false,
    isVerified: true,
    rating: 4.9,
    tags: ["cooking", "food", "recipes"],
    category: "food",
    nextSession: "Friday at 6:30 PM"
  },
  {
    id: "4",
    name: "James Wilson",
    imageUrl: "https://source.unsplash.com/random/100x100/?portrait&4",
    bio: "Personal trainer and fitness coach. Workout streams and nutritional advice.",
    followers: 45800,
    isOnline: true,
    isVerified: false,
    rating: 4.7,
    tags: ["fitness", "workout", "health"],
    category: "fitness",
    nextSession: "Tomorrow at 7:00 AM"
  }
];

const Creators = () => {
  const [creators] = useState<Creator[]>(getMockCreators());
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>(getMockCreators());
  const [activeTab, setActiveTab] = useState("all");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isPremiumUser = user?.profile?.subscriptionStatus === "active";
  
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredCreators(creators);
      return;
    }
    
    const filtered = creators.filter(creator =>
      creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredCreators(filtered);
  };
  
  const handleFilter = (filters: any) => {
    let filtered = [...creators];
    
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(creator => creator.category === filters.category);
    }
    
    if (filters.status && filters.status !== "all") {
      if (filters.status === "online") {
        filtered = filtered.filter(creator => creator.isOnline);
      } else {
        filtered = filtered.filter(creator => !creator.isOnline);
      }
    }
    
    if (filters.sort) {
      switch(filters.sort) {
        case "popular":
          filtered.sort((a, b) => b.followers - a.followers);
          break;
        case "newest":
          // Sort by name since we don't have createdAt
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
      }
    }
    
    setFilteredCreators(filtered);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === "all") {
      setFilteredCreators(creators);
    } else if (value === "live") {
      setFilteredCreators(creators.filter(creator => creator.isOnline));
    } else if (value === "following") {
      // In a real app, this would filter based on user's following list
      setFilteredCreators(creators.filter((_, index) => index % 3 === 0));
    }
  };
  
  const handleGoLive = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to start streaming",
        variant: "destructive",
      });
      navigate("/sign-in", { state: { returnTo: "/creators/broadcast" } });
      return;
    }

    if (!isPremiumUser) {
      toast({
        title: "Premium subscription required",
        description: "Upgrade to premium to start streaming",
        variant: "destructive",
      });
      navigate("/subscription");
      return;
    }

    // Create a mock creator ID for the current user
    const creatorId = user.id || "current-user";
    navigate(`/creators/${creatorId}?tab=broadcast`);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:py-8 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Creators</h1>
          <p className="text-muted-foreground">
            Discover and connect with amazing content creators
          </p>
        </div>

        <div className="flex gap-3">
          <Button 
            variant={isPremiumUser ? "default" : "outline"}
            onClick={handleGoLive}
            className={isPremiumUser ? "animate-pulse" : ""}
          >
            {isPremiumUser ? (
              <>
                <Video className="mr-2 h-4 w-4" />
                Go Live
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Premium Only
              </>
            )}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/discover/streams">Discover Streams</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for creators..."
                className="w-full py-2 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="live" className="flex-1">Live Now</TabsTrigger>
                <TabsTrigger value="following" className="flex-1">Following</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-3">Filter Creators</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Category</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => handleFilter({category: e.target.value})}
                  >
                    <option value="all">All Categories</option>
                    <option value="gaming">Gaming</option>
                    <option value="art">Art</option>
                    <option value="music">Music</option>
                    <option value="food">Food</option>
                    <option value="fitness">Fitness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Status</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => handleFilter({status: e.target.value})}
                  >
                    <option value="all">All Status</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Sort By</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => handleFilter({sort: e.target.value})}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <CreatorGrid creators={filteredCreators} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Creators;
