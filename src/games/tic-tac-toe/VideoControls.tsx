
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff } from "lucide-react";

interface VideoControlsProps {
  showVideo: boolean;
  isMuted: boolean;
  isMultiplayerMode: boolean;
  onToggleVideo: () => void;
  onToggleMute: () => void;
}

const VideoControls = ({
  showVideo,
  isMuted,
  isMultiplayerMode,
  onToggleVideo,
  onToggleMute
}: VideoControlsProps) => {
  if (!isMultiplayerMode) return null;

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleVideo}
        className="h-9 w-9 rounded-full"
      >
        {showVideo ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleMute}
        disabled={!showVideo}
        className="h-9 w-9 rounded-full"
      >
        {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
    </>
  );
};

export default VideoControls;
