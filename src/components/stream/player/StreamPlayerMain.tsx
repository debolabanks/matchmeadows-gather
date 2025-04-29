
import React, { useRef } from "react";
import { Stream, StreamReaction } from "@/types/stream";
import { User } from "@/types/user";
import VideoPlayer from "@/components/stream/video/VideoPlayer";
import SubscriberOnlyMessage from "@/components/stream/video/SubscriberOnlyMessage";
import StreamInfo from "@/components/stream/info/StreamInfo";
import StreamReactionButtons from "@/components/stream/reactions/StreamReactionButtons";

interface StreamPlayerMainProps {
  stream: Stream;
  viewerCount: number;
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  showChat: boolean;
  isSubscriber: boolean;
  reactions: StreamReaction[];
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: (containerRef: React.RefObject<HTMLDivElement>) => void;
  onReaction: (type: any) => void;
  onToggleChat: () => void;
  onSubscribe?: () => void;
}

const StreamPlayerMain = ({
  stream,
  viewerCount,
  isPlaying,
  isMuted,
  isFullscreen,
  showChat,
  isSubscriber,
  reactions,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen,
  onReaction,
  onToggleChat,
  onSubscribe
}: StreamPlayerMainProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef} 
      className={`flex-1 rounded-lg overflow-hidden border relative bg-black ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
    >
      {/* Video Player */}
      <div className="aspect-video w-full bg-black relative">
        {isSubscriber ? (
          <VideoPlayer
            thumbnailUrl={stream.thumbnailUrl}
            status={stream.status}
            isPlaying={isPlaying}
            isMuted={isMuted}
            viewerCount={viewerCount}
            onTogglePlay={onTogglePlay}
            onToggleMute={onToggleMute}
            onToggleFullscreen={() => onToggleFullscreen(containerRef)}
          />
        ) : (
          <SubscriberOnlyMessage stream={stream} onSubscribe={onSubscribe || (() => {})} />
        )}
      </div>

      {/* Stream info */}
      <div className="p-4 bg-card">
        <StreamInfo 
          stream={stream} 
          showChat={showChat} 
          onToggleChat={onToggleChat} 
        />
        <StreamReactionButtons reactions={reactions} onReaction={onReaction} />
      </div>
    </div>
  );
};

export default StreamPlayerMain;
