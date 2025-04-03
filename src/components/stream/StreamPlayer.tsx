
import { useState, useEffect, useRef } from "react";
import { Stream, StreamComment, StreamReaction } from "@/types/stream";
import { User } from "@/contexts/authTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StreamChat from "@/components/stream/StreamChat";
import VideoPlayer from "@/components/stream/video/VideoPlayer";
import SubscriberOnlyMessage from "@/components/stream/video/SubscriberOnlyMessage";
import StreamInfo from "@/components/stream/info/StreamInfo";
import StreamInfoTab from "@/components/stream/info/StreamInfoTab";
import StreamReactionButtons from "@/components/stream/reactions/StreamReactionButtons";

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
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
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
            <VideoPlayer
              thumbnailUrl={stream.thumbnailUrl}
              status={stream.status}
              isPlaying={isPlaying}
              isMuted={isMuted}
              viewerCount={viewerCount}
              onTogglePlay={togglePlay}
              onToggleMute={toggleMute}
              onToggleFullscreen={toggleFullscreen}
            />
          ) : (
            <SubscriberOnlyMessage stream={stream} onSubscribe={onSubscribe || (() => {})} />
          )}
        </div>
  
        {/* Stream info */}
        <div className="p-4 bg-card">
          <StreamInfo 
            stream={stream} 
            showChat={showChat} 
            onToggleChat={() => setShowChat(!showChat)} 
          />
          <StreamReactionButtons reactions={reactions} onReaction={handleReaction} />
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
              <StreamInfoTab stream={stream} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default StreamPlayer;
