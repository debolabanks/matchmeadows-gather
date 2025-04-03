
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Share } from "lucide-react";

interface StreamInfoProps {
  stream: {
    title: string;
    creatorName: string;
    creatorImage: string;
    category?: string;
  };
  showChat: boolean;
  onToggleChat: () => void;
}

const StreamInfo = ({ stream, showChat, onToggleChat }: StreamInfoProps) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={stream.creatorImage} />
          <AvatarFallback>{stream.creatorName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-bold line-clamp-1">{stream.title}</h2>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>{stream.creatorName}</span>
            {stream.category && (
              <>
                <span>•</span>
                <span>{stream.category}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1">
          <Share className="h-4 w-4" />
          Share
        </Button>
        <Button 
          variant={showChat ? "default" : "outline"} 
          size="sm" 
          className="gap-1 md:hidden"
          onClick={onToggleChat}
        >
          <MessageSquare className="h-4 w-4" />
          Chat
        </Button>
      </div>
    </div>
  );
};

export default StreamInfo;
