
import { useRef, useEffect } from "react";
import { StreamComment } from "@/types/stream";
import ChatMessageItem from "./ChatMessageItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessageListProps {
  comments: StreamComment[];
  formatTimestamp: (timestamp: string) => string;
}

const ChatMessageList = ({ comments, formatTimestamp }: ChatMessageListProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [comments]);

  return (
    <ScrollArea className="flex-1 h-full">
      <div ref={chatContainerRef} className="p-3 space-y-3">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p>No chat messages yet</p>
            <p className="text-sm">Be the first to say hello!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <ChatMessageItem 
              key={comment.id} 
              comment={comment} 
              formatTimestamp={formatTimestamp} 
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatMessageList;
