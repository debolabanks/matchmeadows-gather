
import { useRef } from "react";
import { Stream } from "@/types/stream";
import { User } from "@/contexts/authTypes";
import { useStreamPlayer } from "@/components/stream/hooks/useStreamPlayer";
import StreamPlayerMain from "@/components/stream/player/StreamPlayerMain";
import StreamPlayerSidebar from "@/components/stream/player/StreamPlayerSidebar";

interface StreamPlayerProps {
  stream: Stream;
  currentUser?: User | null;
  onSubscribe?: () => void;
}

const StreamPlayer = ({ stream, currentUser, onSubscribe }: StreamPlayerProps) => {
  const {
    isPlaying,
    isMuted,
    isFullscreen,
    showChat,
    setShowChat,
    activeTab,
    setActiveTab,
    viewerCount,
    reactions,
    comments,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    handleSendComment,
    handleReaction
  } = useStreamPlayer(stream);

  const isSubscriber = currentUser?.id === stream.creatorId || !stream.isSubscriberOnly;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <StreamPlayerMain
        stream={stream}
        viewerCount={viewerCount}
        isPlaying={isPlaying}
        isMuted={isMuted}
        isFullscreen={isFullscreen}
        showChat={showChat}
        isSubscriber={isSubscriber}
        reactions={reactions}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        onToggleFullscreen={toggleFullscreen}
        onReaction={handleReaction}
        onToggleChat={() => setShowChat(!showChat)}
        onSubscribe={onSubscribe}
      />

      {/* Chat and info sidebar */}
      {(showChat || isFullscreen) && (
        <StreamPlayerSidebar
          stream={stream}
          comments={comments}
          currentUser={currentUser}
          isSubscriber={isSubscriber}
          isFullscreen={isFullscreen}
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
          onSendComment={(text) => handleSendComment(text, currentUser)}
        />
      )}
    </div>
  );
};

export default StreamPlayer;
