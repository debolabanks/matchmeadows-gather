
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import StreamSearch from "./components/StreamSearch";
import PopularCreators from "./components/PopularCreators";
import StreamTabs from "./components/StreamTabs";
import { Stream } from "@/types/stream";
import { MOCK_STREAMS } from "./data/mockStreams";

const StreamsDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [activeTabValue, setActiveTabValue] = useState("all");
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const filteredStreams = MOCK_STREAMS.filter(stream => {
    const matchesSearch = 
      stream.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      stream.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stream.tags && stream.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = category === "all" || stream.category?.toLowerCase() === category.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });
  
  const liveStreams = filteredStreams.filter(stream => stream.status === "live");
  const scheduledStreams = filteredStreams.filter(stream => stream.status === "scheduled");
  
  const handleStartBroadcasting = () => {
    if (user) {
      navigate(`/creators/${user.id}?tab=broadcast`);
    } else {
      navigate("/sign-in");
    }
  };
  
  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Discover Streams</h1>
        
        <Button onClick={handleStartBroadcasting}>
          <Video className="h-4 w-4 mr-2" /> Start Broadcasting
        </Button>
      </div>
      
      <StreamSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={category}
        onCategoryChange={setCategory}
      />
      
      <PopularCreators />
      
      <StreamTabs 
        activeTabValue={activeTabValue}
        onTabChange={setActiveTabValue}
        liveStreams={liveStreams}
        scheduledStreams={scheduledStreams}
        filteredStreams={filteredStreams}
      />
    </div>
  );
};

export default StreamsDiscovery;
