import { useRef } from "react";
import { Stream } from "@/types/stream";
import { User } from "@/types/user";
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

  // Check if user is a subscriber
  // In a real app, this would likely involve a more complex check against a subscriptions database
  const isSubscriber = currentUser?.id === stream.creatorId || 
                      currentUser?.profile?.subscriptionStatus === "active" || 
                      !stream.isSubscriberOnly;

  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe();
    }
  };

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
        onSubscribe={handleSubscribe}
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
