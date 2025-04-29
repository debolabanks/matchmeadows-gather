
import { Button } from "@/components/ui/button";
import { Phone, Video } from "lucide-react";
import { useCall } from "@/hooks/useCall";
import { useToast } from "@/hooks/use-toast";

interface CallControlsProps {
  contactId: string;
  contactName: string;
  contactImage: string;
  className?: string;
}

const CallControls = ({
  contactId,
  contactName,
  contactImage,
  className = ""
}: CallControlsProps) => {
  const { startCall } = useCall();
  const { toast } = useToast();

  const handleVideoCall = () => {
    startCall(contactId, contactName, contactImage, "video");
  };

  const handleVoiceCall = () => {
    startCall(contactId, contactName, contactImage, "voice");
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full h-9 w-9"
        onClick={handleVideoCall}
        title="Video Call"
      >
        <Video className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full h-9 w-9"
        onClick={handleVoiceCall}
        title="Voice Call"
      >
        <Phone className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CallControls;
