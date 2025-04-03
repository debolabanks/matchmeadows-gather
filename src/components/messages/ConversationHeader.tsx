
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video } from "lucide-react";
import { ChatContact } from "@/types/message";
import { format } from "date-fns";

interface ConversationHeaderProps {
  contact: ChatContact;
  onStartVoiceCall: () => void;
  onStartVideoCall: () => void;
}

const ConversationHeader = ({ 
  contact, 
  onStartVoiceCall, 
  onStartVideoCall 
}: ConversationHeaderProps) => {
  
  const formatLastActive = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    if (diffInHours < 24) {
      return `Last active ${format(date, 'h:mm a')}`;
    } else {
      return `Last active ${format(date, 'MMM d, yyyy')}`;
    }
  };

  return (
    <div className="p-3 border-b flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={contact.imageUrl} alt={contact.name} />
          <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{contact.name}</h3>
          <p className="text-xs text-muted-foreground">
            {contact.isOnline ? 'Online' : formatLastActive(contact.lastActive)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onStartVoiceCall}
          title="Start voice call"
        >
          <Phone className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onStartVideoCall}
          title="Start video call"
        >
          <Video className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ConversationHeader;
