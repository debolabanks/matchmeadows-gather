
import React from "react";
import { StreamComment } from "@/types/stream";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface ChatMessageItemProps {
  message: StreamComment;
  formatTimestamp: (timestamp: string) => string;
  renderBadge?: (userId: string) => React.ReactNode;
}

const ChatMessageItem = ({ 
  message, 
  formatTimestamp,
  renderBadge
}: ChatMessageItemProps) => {
  return (
    <div className="py-2 px-3 hover:bg-muted/50 flex gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src={message.userImage} alt={message.userName} />
        <AvatarFallback>{message.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className={`text-sm font-medium truncate ${message.isCreator ? 'text-love-500' : ''}`}>
            {message.userName}
            {message.isCreator && <CheckCircle className="h-3 w-3 inline-block ml-1" />}
          </p>
          
          {renderBadge && renderBadge(message.userId)}
          
          <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        
        <p className="text-sm break-words">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessageItem;
