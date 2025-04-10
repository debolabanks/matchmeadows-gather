
import { StreamComment } from "@/types/stream";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ChatMessageItemProps {
  comment: StreamComment;
  formatTimestamp: (timestamp: string) => string;
  badge?: React.ReactNode;
}

const ChatMessageItem = ({ comment, formatTimestamp, badge }: ChatMessageItemProps) => {
  return (
    <div className="group flex items-start gap-2">
      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={comment.userImage || "https://source.unsplash.com/random/100x100/?avatar"}
          alt={comment.userName}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <span className={cn(
            "text-xs font-medium",
            comment.isCreator && "text-primary",
            comment.isPinned && "text-amber-500"
          )}>
            {comment.userName}
            {comment.isCreator && (
              <Badge variant="outline" className="ml-1 text-[10px] py-0 h-4">
                Creator
              </Badge>
            )}
          </span>
          
          {badge && (
            <span className="ml-1">{badge}</span>
          )}
          
          <span className="text-[10px] text-muted-foreground hidden group-hover:inline">
            {formatTimestamp(comment.timestamp)}
          </span>
        </div>
        
        <p className="text-sm break-words">
          {comment.text}
        </p>
      </div>
    </div>
  );
};

export default ChatMessageItem;
