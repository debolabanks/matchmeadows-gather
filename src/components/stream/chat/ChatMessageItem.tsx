
import { StreamComment } from "@/types/stream";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ChatMessageItemProps {
  comment: StreamComment;
  formatTimestamp: (timestamp: string) => string;
}

const ChatMessageItem = ({ comment, formatTimestamp }: ChatMessageItemProps) => {
  return (
    <div 
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
  );
};

export default ChatMessageItem;
