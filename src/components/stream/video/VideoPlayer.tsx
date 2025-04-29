
import { useRef } from "react";
import { Users } from "lucide-react";
import VideoControls from "./VideoControls";

interface VideoPlayerProps {
  thumbnailUrl: string;
  status: string;
  isPlaying: boolean;
  isMuted: boolean;
  viewerCount: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
}

const VideoPlayer = ({
  thumbnailUrl,
  status,
  isPlaying,
  isMuted,
  viewerCount,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  return (
    <div className="aspect-video w-full bg-black relative">
      <video
        ref={videoRef}
        src={status === "live" ? "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-with-a-yellow-jacket-posing-in-a-parking-39880-large.mp4" : undefined}
        poster={thumbnailUrl}
        autoPlay={status === "live"}
        muted={isMuted}
        playsInline
        className="w-full h-full object-contain"
      />
      
      {/* Live indicator and viewer count */}
      <div className="absolute top-4 left-4 flex gap-2">
        {status === "live" && (
          <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center animate-pulse">
            LIVE
          </div>
        )}
        <div className="bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center">
          <Users className="h-3 w-3 mr-1" />
          {viewerCount} viewers
        </div>
      </div>
      
      {/* Video controls */}
      <VideoControls
        isPlaying={isPlaying}
        isMuted={isMuted}
        onTogglePlay={onTogglePlay}
        onToggleMute={onToggleMute}
        onToggleFullscreen={onToggleFullscreen}
      />
    </div>
  );
};

export default VideoPlayer;
