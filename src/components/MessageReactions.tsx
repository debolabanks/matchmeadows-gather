import { MessageReaction } from "@/types/message";
import { Button } from "@/components/ui/button";

interface MessageReactionsProps {
  reactions: MessageReaction[];
  onAddReaction: (emoji: string) => void;
  messageId: string;
  className?: string;
}

const COMMON_REACTIONS = ["❤️", "👍", "😂", "😮", "😢", "🙏"];

const MessageReactions = ({ 
  reactions, 
  onAddReaction, 
  messageId, 
  className 
}: MessageReactionsProps) => {
  // Group reactions by emoji
  const reactionCounts: Record<string, number> = reactions.reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={className}>
      {/* Existing reactions */}
      <div className="flex flex-wrap gap-1 mb-1">
        {Object.entries(reactionCounts).map(([emoji, count]) => (
          <Button
            key={emoji}
            variant="outline"
            size="sm"
            className="h-6 px-2 py-1 text-xs rounded-full"
            onClick={() => onAddReaction(emoji)}
          >
            {emoji} {count}
          </Button>
        ))}
      </div>
      
      {/* Quick reaction picker */}
      <div className="flex justify-start gap-1 mt-1">
        {COMMON_REACTIONS.map((emoji) => (
          <Button
            key={emoji}
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 rounded-full hover:bg-muted"
            onClick={() => onAddReaction(emoji)}
          >
            {emoji}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MessageReactions;
