
import { useRef, useEffect } from "react";
import { StreamComment } from "@/types/stream";
import ChatMessageItem from "./ChatMessageItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessageListProps {
  comments: StreamComment[];
  formatTimestamp: (timestamp: string) => string;
  renderBadge?: (userId: string) => React.ReactNode;
}

const ChatMessageList = ({ comments, formatTimestamp, renderBadge }: ChatMessageListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [comments]);
  
  return (
    <div className="flex-1 overflow-hidden" ref={scrollAreaRef}>
      <ScrollArea className="h-full">
        <div className="p-3 space-y-3">
          {comments.length === 0 ? (
            <div className="text-center text-muted-foreground py-6">
              <p>No messages yet</p>
            </div>
          ) : (
            comments.map(comment => (
              <ChatMessageItem 
                key={comment.id} 
                comment={comment} 
                formatTimestamp={formatTimestamp}
                badge={renderBadge ? renderBadge(comment.userId) : undefined}
              />
            ))
          )}
          <div className="h-2" /> {/* Bottom padding for scrolling */}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatMessageList;
