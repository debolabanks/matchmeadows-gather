
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreatorGrid from "@/components/creators/CreatorGrid";
import CreatorFilters from "@/components/creators/CreatorFilters";
import CreatorSearch from "@/components/creators/CreatorSearch";
import { getAllCreators } from "@/components/creators/mockCreatorsData";
import { Creator } from "@/components/creators/CreatorCard";
import { useAuth } from "@/hooks/useAuth";
import { Video, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Creators = () => {
  const [creators, setCreators] = useState<Creator[]>(getAllCreators());
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>(creators);
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
          filtered.sort((a, b) => new Date(b.joinedDate || "").getTime() - new Date(a.joinedDate || "").getTime());
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
            <CreatorSearch onSearch={handleSearch} />
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
            <CreatorFilters onFilter={handleFilter} />
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
