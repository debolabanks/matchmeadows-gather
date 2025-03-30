
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Stream } from "@/types/stream";
import StreamPlayer from "@/components/stream/StreamPlayer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// Using the same mock data from StreamsDiscovery
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

const StreamPage = () => {
  const { streamId } = useParams<{ streamId: string }>();
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchStream = () => {
      setLoading(true);
      
      setTimeout(() => {
        const foundStream = MOCK_STREAMS.find(s => s.id === streamId);
        
        if (foundStream) {
          setStream(foundStream);
        }
        
        setLoading(false);
      }, 500);
    };
    
    fetchStream();
  }, [streamId]);
  
  const handleSubscribe = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to this creator",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Subscription",
      description: "This would open a subscription dialog in a real app",
    });
  };
  
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
  
  if (!stream) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Stream Not Found</h1>
        <p className="text-muted-foreground mb-6">The stream you're looking for doesn't exist or has ended.</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-6xl mx-auto">
        <StreamPlayer 
          stream={stream}
          currentUser={user}
          onSubscribe={handleSubscribe}
        />
      </div>
    </div>
  );
};

export default StreamPage;
