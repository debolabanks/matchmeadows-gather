
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Stream, StreamComment, StreamReaction } from "@/types/stream";
import { User } from "@/contexts/authTypes";
import StreamChat from "@/components/stream/StreamChat";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Share, 
  MessageSquare,
  Users,
  Heart,
  ThumbsUp
} from "lucide-react";

interface StreamPlayerProps {
  stream: Stream;
  currentUser?: User | null;
  onSubscribe?: () => void;
}

const StreamPlayer = ({ stream, currentUser, onSubscribe }: StreamPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(stream.status === "live");
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");
  const [viewerCount, setViewerCount] = useState(stream.viewerCount);
  const [reactions, setReactions] = useState<StreamReaction[]>([
    { type: "like", count: 124 },
    { type: "love", count: 57 },
    { type: "wow", count: 32 },
    { type: "support", count: 18 },
  ]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock comments for demo purposes
  const [comments, setComments] = useState<StreamComment[]>([
    {
      id: "1",
      streamId: stream.id,
      userId: "user1",
      userName: "Alex Johnson",
      userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
      text: "This stream is amazing! 🔥",
      timestamp: new Date(Date.now() - 120000).toISOString(),
      isCreator: false,
    },
    {
      id: "2",
      streamId: stream.id,
      userId: "user2",
      userName: "Sarah Williams",
      userImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
      text: "How long have you been doing this?",
      timestamp: new Date(Date.now() - 60000).toISOString(),
      isCreator: false,
    },
    {
      id: "3",
      streamId: stream.id,
      userId: stream.creatorId,
      userName: stream.creatorName,
      userImage: stream.creatorImage,
      text: "Thanks for joining everyone! Feel free to ask questions.",
      timestamp: new Date(Date.now() - 30000).toISOString(),
      isCreator: true,
      isPinned: true,
    },
  ]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };

  const handleSendComment = (text: string) => {
    if (currentUser && text.trim()) {
      const newComment: StreamComment = {
        id: `comment-${Date.now()}`,
        streamId: stream.id,
        userId: currentUser.id,
        userName: currentUser.name,
        userImage: currentUser.profile?.photos?.[0] || "https://ui-avatars.com/api/?name=" + currentUser.name,
        text,
        timestamp: new Date().toISOString(),
        isCreator: currentUser.id === stream.creatorId,
      };
      
      setComments([...comments, newComment]);
    }
  };

  const handleReaction = (type: StreamReaction["type"]) => {
    setReactions(prev => 
      prev.map(reaction => 
        reaction.type === type 
          ? { ...reaction, count: reaction.count + 1 }
          : reaction
      )
    );
  };

  // Effect to simulate viewer count changing
  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      setViewerCount(prev => Math.max(1, prev + change));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Effect to handle document fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const isSubscriber = currentUser?.id === stream.creatorId || !stream.isSubscriberOnly;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div ref={containerRef} className={`flex-1 rounded-lg overflow-hidden border relative bg-black ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Video Player */}
        <div className="aspect-video w-full bg-black relative">
          {isSubscriber ? (
            <>
              <video
                ref={videoRef}
                src={stream.status === "live" ? "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-with-a-yellow-jacket-posing-in-a-parking-39880-large.mp4" : undefined}
                poster={stream.thumbnailUrl}
                autoPlay={stream.status === "live"}
                muted={isMuted}
                playsInline
                className="w-full h-full object-contain"
              />
              
              {/* Live indicator and viewer count */}
              <div className="absolute top-4 left-4 flex gap-2">
                {stream.status === "live" && (
                  <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center animate-pulse">
                    LIVE
                  </div>
                )}
                <div className="bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {viewerCount} viewers
                </div>
              </div>
              
              {/* Video controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                      onClick={togglePlay}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                      onClick={toggleMute}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                      onClick={toggleFullscreen}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black">
              <div className="w-24 h-24 mb-4 overflow-hidden rounded-full border-4 border-primary">
                <img 
                  src={stream.creatorImage} 
                  alt={stream.creatorName}
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">{stream.title}</h3>
              <p className="text-gray-300 mb-6">This content is available to subscribers only</p>
              <Button onClick={onSubscribe} className="animate-pulse">
                Subscribe to Watch
              </Button>
            </div>
          )}
        </div>
  
        {/* Stream info */}
        <div className="p-4 bg-card">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={stream.creatorImage} />
                <AvatarFallback>{stream.creatorName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-bold line-clamp-1">{stream.title}</h2>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>{stream.creatorName}</span>
                  {stream.category && (
                    <>
                      <span>•</span>
                      <span>{stream.category}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Share className="h-4 w-4" />
                Share
              </Button>
              <Button 
                variant={showChat ? "default" : "outline"} 
                size="sm" 
                className="gap-1 md:hidden"
                onClick={() => setShowChat(!showChat)}
              >
                <MessageSquare className="h-4 w-4" />
                Chat
              </Button>
            </div>
          </div>
          <div className="flex gap-3">
            {reactions.map(reaction => (
              <Button
                key={reaction.type}
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleReaction(reaction.type)}
              >
                {reaction.type === "like" && <ThumbsUp className="h-4 w-4 mr-1" />}
                {reaction.type === "love" && <Heart className="h-4 w-4 mr-1" />}
                {reaction.type === "wow" && "🤩"}
                {reaction.type === "support" && "💰"}
                <span>{reaction.count}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat and info sidebar */}
      {(showChat || isFullscreen) && (
        <div className={`w-full md:w-80 flex-shrink-0 border rounded-lg overflow-hidden bg-card ${isFullscreen ? 'fixed right-0 top-0 bottom-0 z-50 w-80' : ''}`}>
          <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="info">Stream Info</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="flex-1 overflow-hidden flex flex-col">
              <StreamChat 
                comments={comments}
                onSendComment={handleSendComment}
                currentUser={currentUser}
                isSubscriber={isSubscriber}
              />
            </TabsContent>
            <TabsContent value="info" className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">About this stream</h3>
                  <p className="text-sm text-muted-foreground">{stream.description}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Started</h3>
                  <p className="text-sm">
                    {new Date(stream.startTime).toLocaleString()}
                  </p>
                </div>
                {stream.tags && stream.tags.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {stream.tags.map(tag => (
                          <div key={tag} className="text-xs px-2 py-1 bg-accent rounded-md">
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default StreamPlayer;
