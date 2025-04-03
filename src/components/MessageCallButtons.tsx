import { Button } from "@/components/ui/button";
import { Phone, Video, Gamepad2 } from "lucide-react";
import { useCallContext } from "@/contexts/CallContext";
import { ChatContact } from "@/types/message";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface MessageCallButtonsProps {
  contact: ChatContact;
  className?: string;
}

const MessageCallButtons = ({ contact, className = "" }: MessageCallButtonsProps) => {
  const { startCall } = useCallContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCallStarting, setIsCallStarting] = useState(false);

  const handleVideoCall = async () => {
    if (isCallStarting) return;
    
    setIsCallStarting(true);
    
    try {
      toast({
        title: `Starting video call with ${contact.name}`,
        description: "Connecting to Twilio service...",
        duration: 3000,
      });
      
      startCall(contact.id, contact.name, contact.imageUrl, "video");
    } catch (error) {
      toast({
        title: "Call failed",
        description: "Could not start video call with Twilio",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsCallStarting(false);
      }, 1500);
    }
  };

  const handleVoiceCall = async () => {
    if (isCallStarting) return;
    
    setIsCallStarting(true);
    
    try {
      toast({
        title: `Starting voice call with ${contact.name}`,
        description: "Connecting to Twilio service...",
        duration: 3000,
      });
      
      startCall(contact.id, contact.name, contact.imageUrl, "voice");
    } catch (error) {
      toast({
        title: "Call failed",
        description: "Could not start voice call with Twilio",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsCallStarting(false);
      }, 1500);
    }
  };

  const handleGameStart = () => {
    toast({
      title: `Starting game with ${contact.name}`,
      description: "Loading game interface...",
      duration: 3000,
    });
    
    navigate(`/games`, { 
      state: { 
        contactId: contact.id,
        contactName: contact.name
      } 
    });
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full h-9 w-9"
        onClick={handleGameStart}
        title="Play Games"
      >
        <Gamepad2 className="h-4 w-4" />
      </Button>
      
      {contact.videoCallEnabled !== false && (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9"
          onClick={handleVideoCall}
          title="Twilio Video Call"
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
          title="Twilio Voice Call"
          disabled={isCallStarting}
        >
          <Phone className={`h-4 w-4 ${isCallStarting ? 'animate-pulse' : ''}`} />
        </Button>
      )}
    </div>
  );
};

export default MessageCallButtons;
