
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Stream, StreamComment } from "@/types/stream";
import StreamPlayer from "@/components/stream/StreamPlayer";
import StreamChat from "@/components/stream/StreamChat";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Users, Heart, Gift, Share2 } from "lucide-react";

// Generate a mock stream based on streamId
const generateMockStream = (streamId: string): Stream => {
  return {
    id: streamId,
    creatorId: "creator-" + streamId.substring(0, 4),
    creatorName: "Creator " + streamId.substring(0, 4),
    creatorImage: "https://source.unsplash.com/random/100x100/?portrait",
    title: "Live Stream Session #" + streamId.substring(0, 5),
    description: "Welcome to my live stream! Thanks for joining.",
    thumbnailUrl: "https://source.unsplash.com/random/800x450/?streaming",
    status: "live",
    viewerCount: Math.floor(Math.random() * 200) + 10,
    startTime: new Date().toISOString(),
    category: "Gaming",
    tags: ["gaming", "live", "chat"],
    isSubscriberOnly: Math.random() > 0.5
  };
};

const LiveStreamPage = () => {
  const { streamId } = useParams<{ streamId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [stream, setStream] = useState<Stream | null>(null);
  const [comments, setComments] = useState<StreamComment[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  
  // Simulation of stream stats for gamification
  const [streamStats, setStreamStats] = useState({
    likes: Math.floor(Math.random() * 100),
    shares: Math.floor(Math.random() * 30),
    donations: Math.floor(Math.random() * 10),
    topFans: [
      { name: "User123", points: 450 },
      { name: "StreamLover", points: 320 },
      { name: "BigFan42", points: 280 }
    ]
  });
  
  // Fetch stream data
  useEffect(() => {
    if (streamId) {
      // In a real app, this would be an API call
      const mockStream = generateMockStream(streamId);
      setStream(mockStream);
      
      // Simulate subscription status
      setIsSubscribed(user !== null && (streamId.length % 2 === 0));
      
      // Simulate initial comments
      const initialComments = Array(5).fill(null).map((_, i) => ({
        id: uuidv4(),
        streamId,
        userId: `user-${i}`,
        userName: `Viewer${i}`,
        userImage: `https://source.unsplash.com/random/40x40/?avatar&sig=${i}`,
        text: `This is comment #${i + 1}. Great stream!`,
        timestamp: new Date(Date.now() - (i * 60000)).toISOString(),
        isCreator: i === 0
      }));
      
      setComments(initialComments);
      
      // Simulate new comments coming in
      const commentInterval = setInterval(() => {
        const newComment = {
          id: uuidv4(),
          streamId,
          userId: `user-${Math.floor(Math.random() * 1000)}`,
          userName: `Viewer${Math.floor(Math.random() * 1000)}`,
          userImage: `https://source.unsplash.com/random/40x40/?avatar&sig=${Math.random()}`,
          text: [
            "Great content!",
            "Hello from Brazil!",
            "First time here, loving it!",
            "Can you explain that again?",
            "🔥🔥🔥",
            "This is awesome!",
            "❤️ this stream",
            "How often do you go live?"
          ][Math.floor(Math.random() * 8)],
          timestamp: new Date().toISOString(),
          isCreator: false
        };
        
        setComments(prev => [...prev, newComment]);
      }, 8000);
      
      return () => clearInterval(commentInterval);
    }
  }, [streamId, user]);
  
  // Handle new comment from current user
  const handleSendComment = (text: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to chat",
        variant: "destructive",
      });
      return;
    }
    
    if (!isSubscribed && stream?.isSubscriberOnly) {
      toast({
        title: "Subscriber-only chat",
        description: "Subscribe to join the conversation",
        variant: "destructive",
      });
      return;
    }
    
    const newComment = {
      id: uuidv4(),
      streamId: streamId || "",
      userId: user.id,
      userName: user.name || "Anonymous",
      userImage: user.profile?.photos?.[0] || "https://source.unsplash.com/random/40x40/?avatar",
      text,
      timestamp: new Date().toISOString(),
      isCreator: stream?.creatorId === user.id
    };
    
    setComments(prev => [...prev, newComment]);
  };
  
  // Handle subscription
  const handleSubscribe = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe",
        variant: "destructive",
      });
      navigate("/sign-in", { state: { returnTo: `/stream/${streamId}` } });
      return;
    }
    
    toast({
      title: "Subscription activated",
      description: "You are now subscribed to this creator!",
    });
    
    setIsSubscribed(true);
  };
  
  // Handle like/reaction
  const handleLike = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like this stream",
      });
      return;
    }
    
    setStreamStats(prev => ({
      ...prev,
      likes: prev.likes + 1
    }));
    
    toast({
      title: "Stream liked",
      description: "Thanks for your support!",
    });
  };
  
  // Handle share
  const handleShare = () => {
    // In a real app, this would open a share dialog
    navigator.clipboard.writeText(window.location.href);
    
    setStreamStats(prev => ({
      ...prev,
      shares: prev.shares + 1
    }));
    
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
    });
  };
  
  if (!stream) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mb-4"></div>
            <div className="h-4 w-24 bg-muted rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }
  
  const isCreator = user && user.id === stream.creatorId;
  
  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Video player */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <StreamPlayer
              stream={stream}
              isPlaying={isPlaying}
              isMuted={isMuted}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onToggleMute={() => setIsMuted(!isMuted)}
              onToggleFullscreen={() => {}}
              isSubscribed={isSubscribed}
            />
            
            <div>
              <h1 className="text-2xl font-bold mb-2">{stream.title}</h1>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <img 
                    src={stream.creatorImage} 
                    alt={stream.creatorName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{stream.creatorName}</div>
                    <div className="text-xs text-muted-foreground">
                      {stream.viewerCount.toLocaleString()} viewers
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!isCreator && (
                    <Button 
                      variant={isSubscribed ? "outline" : "default"}
                      onClick={handleSubscribe}
                    >
                      {isSubscribed ? "Subscribed" : "Subscribe"}
                    </Button>
                  )}
                  
                  <Button variant="outline" size="icon" onClick={handleLike}>
                    <Heart className="h-4 w-4 text-rose-500" />
                  </Button>
                  
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm">{stream.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline">{stream.category}</Badge>
                  {stream.tags?.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Chat and interactions */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex-1">Leaderboard</TabsTrigger>
              <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
            </TabsList>
            
            {/* Chat tab */}
            <TabsContent value="chat" className="h-[500px] border rounded-md overflow-hidden">
              <StreamChat 
                comments={comments}
                onSendComment={handleSendComment}
                currentUser={user}
                isSubscriber={isSubscribed || !stream.isSubscriberOnly}
                isCreator={isCreator}
                viewerCount={stream.viewerCount}
              />
            </TabsContent>
            
            {/* Leaderboard tab - Gamification */}
            <TabsContent value="leaderboard" className="h-[500px] border rounded-md p-4 overflow-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold mb-3">Stream Stats</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <Heart className="h-5 w-5 text-rose-500 mb-1" />
                        <div className="text-2xl font-bold">{streamStats.likes}</div>
                        <div className="text-xs text-muted-foreground">Likes</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <Share2 className="h-5 w-5 text-blue-500 mb-1" />
                        <div className="text-2xl font-bold">{streamStats.shares}</div>
                        <div className="text-xs text-muted-foreground">Shares</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <Gift className="h-5 w-5 text-purple-500 mb-1" />
                        <div className="text-2xl font-bold">{streamStats.donations}</div>
                        <div className="text-xs text-muted-foreground">Donations</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold mb-3">Top Supporters</h3>
                  <div className="space-y-2">
                    {streamStats.topFans.map((fan, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div className="flex items-center gap-2">
                          <Badge className="h-6 w-6 rounded-full flex items-center justify-center p-0">
                            {index + 1}
                          </Badge>
                          <span>{fan.name}</span>
                        </div>
                        <div className="font-semibold">{fan.points} pts</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold mb-3">Achievements</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {["First Comment", "5 Comments", "Shared Stream"].map((achievement, i) => (
                      <div key={i} className="bg-muted/30 p-2 rounded text-center">
                        <div className="text-2xl mb-1">
                          {["🏆", "🌟", "🔄"][i]}
                        </div>
                        <div className="text-xs">{achievement}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* About tab */}
            <TabsContent value="about" className="h-[500px] border rounded-md p-4 overflow-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2">About the Creator</h3>
                  <p className="text-sm">
                    {stream.creatorName} is a content creator who specializes in {stream.category} 
                    streams. Join their broadcasts to enjoy engaging content and a friendly community.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-bold mb-2">Stream Schedule</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monday:</span>
                      <span>8:00 PM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wednesday:</span>
                      <span>8:00 PM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span>3:00 PM - 6:00 PM</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-bold mb-2">Subscription Benefits</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Ad-free viewing experience</li>
                    <li>Exclusive chat emojis</li>
                    <li>Subscriber-only streams</li>
                    <li>Discord community access</li>
                    <li>Stream replays</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamPage;
