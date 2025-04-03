
import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CallControlsProps {
  callType: "voice" | "video";
  localMuted: boolean;
  cameraOff: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
}

const CallControls: React.FC<CallControlsProps> = ({
  callType,
  localMuted,
  cameraOff,
  onToggleMute,
  onToggleCamera,
  onEndCall,
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      {callType === "video" && (
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-12 w-12"
          onClick={onToggleCamera}
        >
          {cameraOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full h-12 w-12"
        onClick={onToggleMute}
      >
        {localMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </Button>
      
      <Button 
        variant="destructive" 
        size="icon" 
        className="rounded-full h-14 w-14"
        onClick={onEndCall}
      >
        <PhoneOff className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default CallControls;
