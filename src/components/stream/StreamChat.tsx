
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StreamComment } from "@/types/stream";
import { User } from "@/contexts/authTypes";
import { Send, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StreamChatProps {
  comments: StreamComment[];
  onSendComment: (text: string) => void;
  currentUser: User | null | undefined;
  isSubscriber: boolean;
}

const StreamChat = ({ comments, onSendComment, currentUser, isSubscriber }: StreamChatProps) => {
  const [commentText, setCommentText] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to chat",
        variant: "destructive",
      });
      return;
    }
    
    if (!isSubscriber) {
      toast({
        title: "Subscribers only",
        description: "Only subscribers can chat in this stream",
        variant: "destructive",
      });
      return;
    }
    
    if (commentText.trim()) {
      onSendComment(commentText);
      setCommentText("");
    }
  };

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [comments]);

  // Format timestamp to relative time
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHours = Math.round(diffMin / 60);
    
    if (diffSec < 60) return `${diffSec}s`;
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-3"
      >
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p>No chat messages yet</p>
            <p className="text-sm">Be the first to say hello!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              className={`flex gap-2 ${comment.isPinned ? 'bg-muted p-2 rounded-md border-l-4 border-primary' : ''}`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={comment.userImage} />
                <AvatarFallback>{comment.userName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex gap-1 items-center">
                  <span className={`font-medium text-sm truncate ${comment.isCreator ? 'text-primary' : ''}`}>
                    {comment.userName}
                  </span>
                  {comment.isCreator && (
                    <Badge variant="outline" className="text-xs px-1 py-0 h-4 border-primary text-primary">
                      Host
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">{formatTimestamp(comment.timestamp)}</span>
                </div>
                <p className="text-sm break-words">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {!isSubscriber ? (
        <div className="p-3 bg-muted border-t flex items-center justify-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Subscribe to chat</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
          <Input
            placeholder={currentUser ? "Say something..." : "Sign in to chat"}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={!currentUser}
            className="text-sm"
          />
          <Button type="submit" size="icon" disabled={!currentUser || !commentText.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      )}
    </div>
  );
};

export default StreamChat;
