
import { Button } from "@/components/ui/button";
import { Phone, Video } from "lucide-react";
import { useCallContext } from "@/contexts/CallContext";
import { ChatContact } from "@/types/message";

interface MessageCallButtonsProps {
  contact: ChatContact;
  className?: string;
}

const MessageCallButtons = ({ contact, className = "" }: MessageCallButtonsProps) => {
  const { startCall } = useCallContext();

  const handleVideoCall = () => {
    startCall(contact.id, contact.name, contact.imageUrl, "video");
  };

  const handleVoiceCall = () => {
    startCall(contact.id, contact.name, contact.imageUrl, "voice");
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {contact.videoCallEnabled !== false && (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9"
          onClick={handleVideoCall}
          title="Video Call"
        >
          <Video className="h-4 w-4" />
        </Button>
      )}
      
      {contact.voiceCallEnabled !== false && (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9"
          onClick={handleVoiceCall}
          title="Voice Call"
        >
          <Phone className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default MessageCallButtons;
