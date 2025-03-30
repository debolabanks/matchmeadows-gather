
import { Button } from "@/components/ui/button";
import { Phone, Video } from "lucide-react";
import { useCallContext } from "@/contexts/CallContext";
import { ChatContact } from "@/types/message";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface MessageCallButtonsProps {
  contact: ChatContact;
  className?: string;
}

const MessageCallButtons = ({ contact, className = "" }: MessageCallButtonsProps) => {
  const { startCall } = useCallContext();
  const { toast } = useToast();
  const [isCallStarting, setIsCallStarting] = useState(false);

  const handleVideoCall = async () => {
    if (isCallStarting) return;
    
    setIsCallStarting(true);
    
    try {
      toast({
        title: `Starting video call with ${contact.name}`,
        duration: 3000,
      });
      
      startCall(contact.id, contact.name, contact.imageUrl, "video");
    } catch (error) {
      toast({
        title: "Call failed",
        description: "Could not start video call",
        variant: "destructive",
      });
    } finally {
      setIsCallStarting(false);
    }
  };

  const handleVoiceCall = async () => {
    if (isCallStarting) return;
    
    setIsCallStarting(true);
    
    try {
      toast({
        title: `Starting voice call with ${contact.name}`,
        duration: 3000,
      });
      
      startCall(contact.id, contact.name, contact.imageUrl, "voice");
    } catch (error) {
      toast({
        title: "Call failed",
        description: "Could not start voice call",
        variant: "destructive",
      });
    } finally {
      setIsCallStarting(false);
    }
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
          disabled={isCallStarting}
        >
          <Video className={`h-4 w-4 ${isCallStarting ? 'animate-pulse' : ''}`} />
        </Button>
      )}
      
      {contact.voiceCallEnabled !== false && (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9"
          onClick={handleVoiceCall}
          title="Voice Call"
          disabled={isCallStarting}
        >
          <Phone className={`h-4 w-4 ${isCallStarting ? 'animate-pulse' : ''}`} />
        </Button>
      )}
    </div>
  );
};

export default MessageCallButtons;
