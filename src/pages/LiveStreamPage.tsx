
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Eye, MessageSquare, Gift, Users, ThumbsUp, Share2, Flag, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import VideoPlayer from "@/components/stream/video/VideoPlayer";
import StreamChat from "@/components/stream/StreamChat";
import { StreamComment, Stream } from "@/types/stream";
import { toast } from "@/components/ui/use-toast";

const LiveStreamPage = () => {
  const { streamId } = useParams<{ streamId: string }>();
  const { user } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [stream, setStream] = useState<Stream | null>(null);
  const [comments, setComments] = useState<StreamComment[]>([]);
  const [viewerCount, setViewerCount] = useState(0);
  const [isSubscriber, setIsSubscriber] = useState(false);
  
  // Load stream data
  useEffect(() => {
    // In a real app, fetch from API
    // For demo purposes, we'll create mock data
    const mockStream: Stream = {
      id: streamId || "stream-1",
      creatorId: "creator-1",
      creatorName: "Sarah Johnson",
      creatorImage: "https://i.pravatar.cc/150?u=sarah",
      title: "Friday Night Live Q&A Session",
      description: "Join me for a casual Friday night stream where I'll be answering your questions about dating and relationships!",
      thumbnailUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
      status: "live",
      viewerCount: 245,
      startTime: new Date().toISOString(),
      category: "Dating Advice",
      tags: ["relationships", "dating tips", "Q&A"],
      isSubscriberOnly: false
    };
    
    setStream(mockStream);
    
    // Simulate random viewer count changes
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(prev + change, 1); // Ensure at least 1 viewer
      });
    }, 10000);
    
    // Check if user is a subscriber (in a real app, check subscription status)
    setIsSubscriber(true);
    
    return () => clearInterval(interval);
  }, [streamId]);
  
  // Load comments
  useEffect(() => {
    // In a real app, fetch from API or set up real-time connection
    const initialComments: StreamComment[] = [
      {
        id: "comment1",
        streamId: streamId || "",
        userId: "user1",
        userName: "John Doe",
        userImage: "https://i.pravatar.cc/150?u=john",
        text: "Hey everyone! Excited for this stream!",
        timestamp: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: "comment2",
        streamId: streamId || "",
        userId: "user2",
        userName: "Emily Chen",
        userImage: "https://i.pravatar.cc/150?u=emily",
        text: "First time catching you live, love your content!",
        timestamp: new Date(Date.now() - 180000).toISOString()
      },
      {
        id: "comment3",
        streamId: streamId || "",
        userId: "creator1",
        userName: "Sarah Johnson",
        userImage: "https://i.pravatar.cc/150?u=sarah",
        text: "Welcome everyone! Feel free to ask questions.",
        timestamp: new Date(Date.now() - 120000).toISOString(),
        isCreator: true
      }
    ];
    
    setComments(initialComments);
    
    // Simulate new comments every few seconds
    const interval = setInterval(() => {
      const randomComments = [
        "This is so helpful!",
        "Could you talk about first date tips?",
        "How do you handle relationship conflicts?",
        "What's your opinion on long-distance relationships?",
        "❤️",
        "👏👏👏",
        "Great advice!"
      ];
      
      const randomNames = [
        "Alex Turner", "Maya Patel", "Carlos Rodriguez", 
        "Zoe Williams", "Jordan Smith", "Taylor Kim"
      ];
      
      const newComment: StreamComment = {
        id: `comment-${Date.now()}`,
        streamId: streamId || "",
        userId: `user-${Math.floor(Math.random() * 1000)}`,
        userName: randomNames[Math.floor(Math.random() * randomNames.length)],
        userImage: `https://i.pravatar.cc/150?u=${Math.random()}`,
        text: randomComments[Math.floor(Math.random() * randomComments.length)],
        timestamp: new Date().toISOString()
      };
      
      setComments(prev => [...prev, newComment]);
    }, 15000);
    
    return () => clearInterval(interval);
  }, [streamId]);
  
  const handleSendComment = (text: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to comment",
        variant: "destructive"
      });
      return;
    }
    
    if (!text.trim()) return;
    
    const newComment: StreamComment = {
      id: `comment-${Date.now()}`,
      streamId: streamId || "",
      userId: user?.id || "guest",
      userName: user?.name || "Guest User",
      userImage: user?.profile?.photos?.[0] || "https://i.pravatar.cc/150?u=guest",
      text: text,
      timestamp: new Date().toISOString()
    };
    
    setComments(prev => [...prev, newComment]);
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  if (!stream) {
    return (
      <div className="container mx-auto py-20 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-love-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{stream.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={stream.status === "live" ? "bg-red-500 text-white" : ""}>
              {stream.status === "live" ? "LIVE" : "RECORDED"}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Eye className="h-4 w-4 mr-1" />
              {(stream.viewerCount + viewerCount).toLocaleString()} viewers
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              Started {new Date(stream.startTime).toLocaleTimeString()}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Flag className="h-4 w-4 mr-2" />
            Report
          </Button>
          <Button variant="default" size="sm">
            <ThumbsUp className="h-4 w-4 mr-2" />
            Like
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <VideoPlayer
              thumbnailUrl={stream.thumbnailUrl}
              status={stream.status}
              isPlaying={isPlaying}
              isMuted={isMuted}
              viewerCount={stream.viewerCount + viewerCount}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onToggleMute={() => setIsMuted(!isMuted)}
              onToggleFullscreen={toggleFullscreen}
            />
          </div>
          
          {/* Creator info */}
          <div className="flex items-center justify-between">
            <Link to={`/creators/${stream.creatorId}`} className="flex items-center gap-3">
              <img 
                src={stream.creatorImage} 
                alt={stream.creatorName} 
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <h2 className="font-semibold">{stream.creatorName}</h2>
                <p className="text-sm text-muted-foreground">Creator</p>
              </div>
            </Link>
            <Button>Follow</Button>
          </div>
          
          <Separator />
          
          {/* Stream description */}
          <div>
            <h3 className="font-semibold mb-2">About this stream</h3>
            <p className="text-muted-foreground">{stream.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {stream.tags?.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
          
          {/* Engagement tools - PC only */}
          <div className="hidden md:block">
            <h3 className="font-semibold mb-2">Engage with the stream</h3>
            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" className="flex flex-col items-center justify-center h-24">
                <Gift className="h-6 w-6 mb-2" />
                Send Gift
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-24">
                <MessageSquare className="h-6 w-6 mb-2" />
                Ask Question
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-24">
                <Users className="h-6 w-6 mb-2" />
                Request to Join
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right sidebar with chat */}
        <div className="border rounded-md overflow-hidden bg-card h-[600px]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="chat" className="flex-1">Live Chat</TabsTrigger>
              <TabsTrigger value="polls" className="flex-1">Polls & Q&A</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden">
              <StreamChat
                comments={comments}
                onSendComment={handleSendComment}
                currentUser={user}
                isSubscriber={isSubscriber}
                viewerCount={stream.viewerCount + viewerCount}
              />
            </TabsContent>
            
            <TabsContent value="polls" className="p-4">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No active polls</h3>
                <p className="text-muted-foreground mt-1">
                  The creator has not started any polls yet
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamPage;
