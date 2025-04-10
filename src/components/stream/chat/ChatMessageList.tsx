
import React, { useRef, useEffect } from "react";
import { StreamComment } from "@/types/stream";
import ChatMessageItem from "./ChatMessageItem";

interface ChatMessageListProps {
  comments: StreamComment[];
  formatTimestamp: (timestamp: string) => string;
  renderBadge?: (userId: string) => React.ReactNode;
}

const ChatMessageList = ({ comments, formatTimestamp, renderBadge }: ChatMessageListProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [comments]);
  
  return (
    <div 
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300"
    >
      {comments.length === 0 ? (
        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
          No messages yet
        </div>
      ) : (
        comments.map((comment) => (
          <ChatMessageItem 
            key={comment.id} 
            message={comment} 
            formatTimestamp={formatTimestamp}
            renderBadge={renderBadge}
          />
        ))
      )}
    </div>
  );
};

export default ChatMessageList;
