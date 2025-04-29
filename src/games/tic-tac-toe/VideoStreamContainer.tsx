
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff } from "lucide-react";

interface VideoStreamContainerProps {
  showVideo: boolean;
  isMuted: boolean;
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  contactName?: string;
  isConnecting: boolean;
  onToggleVideo: () => void;
  onToggleMute: () => void;
  registerVideoRef: (peerId: string, ref: HTMLVideoElement | null) => void;
}

const VideoStreamContainer = ({
  showVideo,
  isMuted,
  localStream,
  remoteStreams,
  localVideoRef,
  contactName,
  isConnecting,
  onToggleVideo,
  onToggleMute,
  registerVideoRef,
}: VideoStreamContainerProps) => {
  if (!showVideo) return null;

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 h-48">
      <div className="relative rounded-lg overflow-hidden bg-muted">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 text-xs rounded">
          You
        </div>
      </div>
      
      {Array.from(remoteStreams.entries()).map(([peerId, _]) => (
        <div key={peerId} className="relative rounded-lg overflow-hidden bg-muted">
          <video
            ref={(ref) => registerVideoRef(peerId, ref)}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 text-xs rounded">
            {contactName || "Opponent"}
          </div>
        </div>
      ))}
      
      {isConnecting && (
        <div className="flex items-center justify-center rounded-lg overflow-hidden bg-muted">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm">Connecting...</p>
          </div>
        </div>
      )}
      
      {!isConnecting && remoteStreams.size === 0 && (
        <div className="flex items-center justify-center rounded-lg overflow-hidden bg-muted">
          <div className="text-center text-muted-foreground">
            <p>Waiting for opponent to join...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoStreamContainer;
