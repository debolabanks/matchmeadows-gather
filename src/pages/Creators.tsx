
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PlusCircle, Search, SlidersHorizontal } from "lucide-react";
import CreatorCard, { Creator } from "@/components/creators/CreatorCard";
import CreatorFilters from "@/components/creators/CreatorFilters";
import CreatorSearch from "@/components/creators/CreatorSearch";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

// Import the creators data with the correct function name
import { getMockCreators } from "@/components/creators/mockCreatorsData";

const Creators = () => {
  const [creators, setCreators] = useState<Creator[]>(getMockCreators());
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Handle sorting creators
  const handleSortChange = (value: string) => {
    setSortOption(value);
    
    const sortedCreators = [...creators];
    
    switch (value) {
      case "popular":
        sortedCreators.sort((a, b) => b.followers - a.followers);
        break;
      case "rating":
        sortedCreators.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // If we had timestamps, we'd sort by them here
        // For now, use a random sort based on id as a placeholder
        sortedCreators.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case "online":
        sortedCreators.sort((a, b) => {
          if (a.isOnline === b.isOnline) return 0;
          return a.isOnline ? -1 : 1;
        });
        break;
      default:
        break;
    }
    
    setCreators(sortedCreators);
  };
  
  // Handle filtering creators
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    const allCreators = getMockCreators();
    
    if (filter === "all") {
      setCreators(allCreators);
    } else if (filter === "online") {
      setCreators(allCreators.filter(creator => creator.isOnline));
    } else if (filter === "upcoming") {
      setCreators(allCreators.filter(creator => creator.nextSession));
    }
  };
  
  const handleGoLive = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to start streaming",
        variant: "destructive"
      });
      navigate("/sign-in", { state: { returnTo: "/broadcast" } });
      return;
    }
    
    // Check if user is premium (in a real app)
    const isPremium = user?.profile?.subscriptionStatus === 'active';
    
    if (!isPremium) {
      toast({
        title: "Premium required",
        description: "You need a premium subscription to go live",
        variant: "destructive"
      });
      navigate("/subscription");
      return;
    }
    
    navigate("/broadcast");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Creators</h1>
          <p className="text-muted-foreground">
            Discover relationship coaches, matchmakers and dating experts
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="default" onClick={handleGoLive}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Go Live
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>
      
      {showFilters && <CreatorFilters setFilter={handleFilterChange} />}
      
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1">
          <CreatorSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        
        <Select value={sortOption} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="online">Online Now</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {creators.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>
    </div>
  );
};

export default Creators;
