
import { useState, useEffect } from "react";
import { Stream, StreamComment, StreamReaction } from "@/types/stream";

export const useStreamPlayer = (stream: Stream) => {
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

  const toggleFullscreen = (containerRef: React.RefObject<HTMLDivElement>) => {
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

  const handleSendComment = (text: string, currentUser: any) => {
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

  return {
    isPlaying,
    isMuted,
    isFullscreen,
    showChat,
    setShowChat,
    activeTab,
    setActiveTab,
    viewerCount,
    reactions,
    comments,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    handleSendComment,
    handleReaction
  };
};
