
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp } from "lucide-react";
import { StreamReaction } from "@/types/stream";

interface StreamReactionButtonsProps {
  reactions: StreamReaction[];
  onReaction: (type: StreamReaction["type"]) => void;
}

const StreamReactionButtons = ({ reactions, onReaction }: StreamReactionButtonsProps) => {
  return (
    <div className="flex gap-3">
      {reactions.map(reaction => (
        <Button
          key={reaction.type}
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onReaction(reaction.type)}
        >
          {reaction.type === "like" && <ThumbsUp className="h-4 w-4 mr-1" />}
          {reaction.type === "love" && <Heart className="h-4 w-4 mr-1" />}
          {reaction.type === "wow" && "🤩"}
          {reaction.type === "support" && "💰"}
          <span>{reaction.count}</span>
        </Button>
      ))}
    </div>
  );
};

export default StreamReactionButtons;
