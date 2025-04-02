
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Stream } from "@/types/stream";
import StreamList from "@/components/stream/StreamList";
import { useToast } from "@/hooks/use-toast";
import { Video, Calendar, User, Bell, BellOff } from "lucide-react";
import CreatorBroadcast from "@/components/stream/CreatorBroadcast";
import { useAuth } from "@/hooks/useAuth";

// Mock data for demonstration
const MOCK_CREATORS = [
  {
    id: "creator1",
    name: "JessicaStyle",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
    bio: "Fashion blogger and stylist sharing the latest trends and outfit ideas. Join my weekly live streams for style tips and shopping hauls!",
    subscribers: 12450,
    socialLinks: {
      instagram: "jessicaStyle",
      twitter: "jessicaStyle",
      tiktok: "jessicaStyle",
    },
    joinedDate: "2021-06-12"
  },
  {
    id: "creator2",
    name: "TravelWithMike",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
    bio: "Travel vlogger exploring the world one country at a time. I stream live from exotic locations and share travel tips and tricks.",
    subscribers: 8790,
    socialLinks: {
      instagram: "travelwithmike",
      youtube: "TravelWithMike",
      twitter: "MikeTravels",
    },
    joinedDate: "2022-01-05"
  }
];

// Reusing the same mock stream data
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
    id: "5",
    creatorId: "creator1",
    creatorName: "JessicaStyle",
    creatorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
    title: "Fall Fashion Preview - New Collection",
    description: "Preview of my upcoming fall fashion collection with exclusive discounts for subscribers!",
    thumbnailUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    status: "scheduled",
    viewerCount: 0,
    startTime: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    category: "Fashion",
    tags: ["fall", "fashion", "preview", "collection"]
  }
];

const CreatorChannel = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const [creator, setCreator] = useState<typeof MOCK_CREATORS[0] | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState("streams");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchCreator = () => {
      setLoading(true);
      
      setTimeout(() => {
        const foundCreator = MOCK_CREATORS.find(c => c.id === creatorId);
        
        if (foundCreator) {
          setCreator(foundCreator);
          // Get streams for this creator
          const creatorStreams = MOCK_STREAMS.filter(s => s.creatorId === creatorId);
          setStreams(creatorStreams);
          
          // Randomly decide if user is subscribed (for demo)
          setIsSubscribed(Math.random() > 0.5);
        }
        
        setLoading(false);
      }, 500);
    };
    
    fetchCreator();
  }, [creatorId]);
  
  const handleSubscribe = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to this creator",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubscribed(!isSubscribed);
    toast({
      title: isSubscribed ? "Unsubscribed" : "Subscribed!",
      description: isSubscribed 
        ? `You've unsubscribed from ${creator?.name}`
        : `You're now subscribed to ${creator?.name}'s channel!`,
    });
  };
  
  const isCreatorUser = user && creator && user.id === creator.id;
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-muted rounded mb-4 mx-auto"></div>
          <div className="h-4 w-24 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (!creator) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Creator Not Found</h1>
        <p className="text-muted-foreground mb-6">The creator you're looking for doesn't exist.</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      {/* Creator Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden">
          <img src={creator.image} alt={creator.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <h1 className="text-3xl font-bold">{creator.name}</h1>
            
            <div className="flex flex-wrap gap-2">
              {isCreatorUser ? (
                <Button onClick={() => setActiveTab("broadcast")}>
                  <Video className="h-4 w-4 mr-2" /> Go Live
                </Button>
              ) : (
                <Button 
                  onClick={handleSubscribe}
                  variant={isSubscribed ? "outline" : "default"}
                >
                  {isSubscribed ? (
                    <>
                      <BellOff className="h-4 w-4 mr-2" /> Unsubscribe
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 mr-2" /> Subscribe
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex gap-4 text-sm mb-4">
            <div>
              <span className="font-bold">{creator.subscribers.toLocaleString()}</span> subscribers
            </div>
            <div>
              <span className="font-bold">{streams.length}</span> streams
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Joined {new Date(creator.joinedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
            </div>
          </div>
          
          <p className="text-muted-foreground">{creator.bio}</p>
          
          {creator.socialLinks && Object.keys(creator.socialLinks).length > 0 && (
            <div className="flex gap-2 mt-2">
              {Object.entries(creator.socialLinks).map(([platform, handle]) => (
                <Button key={platform} variant="outline" size="sm" className="h-8 text-xs">
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}: @{handle}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Separator className="mb-6" />
      
      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="streams">Streams</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          {isCreatorUser && (
            <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="streams" className="space-y-8">
          {streams.filter(stream => stream.status === "live").length > 0 && (
            <StreamList 
              streams={streams.filter(stream => stream.status === "live")} 
              title="Live Now" 
              description={`${creator.name} is currently streaming`}
            />
          )}
          
          {streams.filter(stream => stream.status === "scheduled").length > 0 && (
            <StreamList 
              streams={streams.filter(stream => stream.status === "scheduled")} 
              title="Upcoming Streams" 
              description="Scheduled broadcasts"
            />
          )}
          
          {streams.length === 0 && (
            <div className="text-center py-12">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No streams yet</h3>
              <p className="text-muted-foreground mb-4">
                {creator.name} hasn't created any streams yet.
              </p>
              {isCreatorUser && (
                <Button onClick={() => setActiveTab("broadcast")}>
                  Start Your First Stream
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="about">
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">About {creator.name}</h2>
              <p>{creator.bio}</p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold mb-2">Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Joined on {new Date(creator.joinedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span>{creator.subscribers.toLocaleString()} subscribers</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {isCreatorUser && (
          <TabsContent value="broadcast">
            <CreatorBroadcast 
              creatorId={creator.id} 
              creatorName={creator.name}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default CreatorChannel;
