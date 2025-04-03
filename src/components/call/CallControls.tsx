
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Video as VideoIcon, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Phone,
  Volume2,
  Volume,
  Maximize2,
  Minimize2
} from "lucide-react";
import { VideoCallState } from "@/hooks/useVideoCall";

interface ActiveCallControlsProps {
  state: VideoCallState;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleSpeaker: () => void;
  toggleFullscreen: () => void;
  endCall: () => void;
  callType: "video" | "voice";
}

export const ActiveCallControls = ({
  state,
  toggleMute,
  toggleVideo,
  toggleSpeaker,
  toggleFullscreen,
  endCall,
  callType
}: ActiveCallControlsProps) => {
  return (
    <div className="flex gap-3 flex-wrap justify-center">
      <Button
        onClick={toggleMute}
        size="icon"
        variant={state.isMuted ? "secondary" : "outline"}
        className="rounded-full"
      >
        {state.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
      
      {callType === "video" && (
        <Button
          onClick={toggleVideo}
          size="icon"
          variant={state.isVideoOff ? "secondary" : "outline"}
          className="rounded-full"
        >
          {state.isVideoOff ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
        </Button>
      )}
      
      <Button
        onClick={toggleSpeaker}
        size="icon"
        variant={state.isSpeakerOn ? "outline" : "secondary"}
        className="rounded-full"
      >
        {state.isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <Volume className="h-5 w-5" />}
      </Button>
      
      <Button
        onClick={toggleFullscreen}
        size="icon"
        variant="outline"
        className="rounded-full"
      >
        {state.isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
      </Button>
      
      <Button
        onClick={endCall}
        size="icon"
        variant="destructive"
        className="rounded-full h-14 w-14"
      >
        <PhoneOff className="h-6 w-6" />
      </Button>
    </div>
  );
};

interface IncomingCallControlsProps {
  acceptCall: () => void;
  rejectCall: () => void;
}

export const IncomingCallControls = ({
  acceptCall,
  rejectCall
}: IncomingCallControlsProps) => {
  return (
    <div className="flex gap-4">
      <Button 
        onClick={rejectCall}
        size="icon" 
        variant="destructive" 
        className="h-14 w-14 rounded-full"
      >
        <PhoneOff className="h-6 w-6" />
      </Button>
      <Button 
        onClick={acceptCall}
        size="icon" 
        variant="default" 
        className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600"
      >
        <Phone className="h-6 w-6" />
      </Button>
    </div>
  );
};
