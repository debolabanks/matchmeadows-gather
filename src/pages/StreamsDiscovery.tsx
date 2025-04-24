import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import StreamList from "@/components/stream/StreamList";
import { Stream } from "@/types/stream";
import { Search, Video, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Mock data for demonstration
const MOCK_STREAMS: Stream[] = [
  {
    id: "1",
    creatorId: "creator1",
    creatorName: "JessicaStyle",
    creatorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
    title: "Summer Fashion Tips & Outfit Ideas",
    description: "Join me as I share my favorite summer fashion trends and outfit ideas for every occasion. I'll be taking questions and giving personalized style advice!",
    thumbnailUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    status: "live",
    viewerCount: 156,
    startTime: new Date(Date.now() - 3600000).toISOString(),
    category: "Fashion",
    tags: ["summer", "fashion", "outfits", "style"]
  },
  {
    id: "2",
    creatorId: "creator2",
    creatorName: "TravelWithMike",
    creatorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
    title: "Live from Bali Beach - Q&A Session",
    description: "Streaming live from Kuta Beach in Bali. Ask me anything about traveling in Southeast Asia on a budget!",
    thumbnailUrl: "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    status: "live",
    viewerCount: 89,
    startTime: new Date(Date.now() - 1200000).toISOString(),
    category: "Travel",
    tags: ["bali", "travel", "beach", "asia"]
  },
  {
    id: "3",
    creatorId: "creator3",
    creatorName: "FitnessByAlex",
    creatorImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
    title: "30-Min HIIT Workout - Live Training",
    description: "Join me for a live 30-minute high-intensity interval training session. No equipment needed, just bring your energy!",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    status: "live",
    viewerCount: 215,
    startTime: new Date(Date.now() - 1800000).toISOString(),
    category: "Fitness",
    tags: ["workout", "hiit", "fitness", "training"],
    isSubscriberOnly: true
  },
  {
    id: "4",
    creatorId: "creator4",
    creatorName: "TechTalkDan",
    creatorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
    title: "iPhone 15 Pro - First Impressions",
    description: "Unboxing the new iPhone 15 Pro and sharing my first impressions. Let's explore the new features together!",
    thumbnailUrl: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    status: "scheduled",
    viewerCount: 0,
    startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    category: "Technology",
    tags: ["tech", "iphone", "apple", "gadgets"]
  },
  {
    id: "5",
    creatorId: "creator5",
    creatorName: "CookingWithEmma",
    creatorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
    title: "Easy Pasta Recipes - Italian Cooking Basics",
    description: "Learn how to make authentic Italian pasta dishes from scratch with simple ingredients. Perfect for beginners!",
    thumbnailUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    status: "scheduled",
    viewerCount: 0,
    startTime: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    category: "Cooking",
    tags: ["cooking", "pasta", "italian", "recipes"]
  }
];

// List of popular creators
const POPULAR_CREATORS = [
  {
    id: "creator1",
    name: "JessicaStyle",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
    category: "Fashion"
  },
  {
    id: "creator2",
    name: "TravelWithMike",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
    category: "Travel"
  },
  {
    id: "creator3",
    name: "FitnessByAlex",
    image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
    category: "Fitness"
  }
];

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
      
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search streams, creators, or tags"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="fashion">Fashion</SelectItem>
            <SelectItem value="travel">Travel</SelectItem>
            <SelectItem value="fitness">Fitness</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="cooking">Cooking</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Popular Creators</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {POPULAR_CREATORS.map(creator => (
            <Link 
              to={`/creators/${creator.id}`} 
              key={creator.id}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-2 border-2 border-primary">
                <img src={creator.image} alt={creator.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium text-center">{creator.name}</h3>
              <p className="text-xs text-muted-foreground">{creator.category}</p>
            </Link>
          ))}
        </div>
      </div>
      
      <Tabs value={activeTabValue} onValueChange={setActiveTabValue} className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Streams</TabsTrigger>
          <TabsTrigger value="live">Live Now</TabsTrigger>
          <TabsTrigger value="scheduled">Upcoming</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-10">
          {liveStreams.length > 0 && (
            <StreamList 
              streams={liveStreams} 
              title="Live Now" 
              description="Creators streaming at this moment"
            />
          )}
          
          {scheduledStreams.length > 0 && (
            <StreamList 
              streams={scheduledStreams} 
              title="Upcoming Streams" 
              description="Scheduled streams you might be interested in"
            />
          )}
          
          {filteredStreams.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No streams found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="live">
          {liveStreams.length > 0 ? (
            <StreamList 
              streams={liveStreams} 
              title="Live Now" 
              description="Creators streaming at this moment"
            />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No live streams found</h3>
              <p className="text-muted-foreground">Check back later or browse upcoming streams</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="scheduled">
          {scheduledStreams.length > 0 ? (
            <StreamList 
              streams={scheduledStreams} 
              title="Upcoming Streams" 
              description="Scheduled streams you might be interested in"
            />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No upcoming streams found</h3>
              <p className="text-muted-foreground">Check back later or browse live streams</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StreamsDiscovery;
