
import { useBroadcast } from "./broadcast/useBroadcast";
import StreamSettings from "./broadcast/StreamSettings";
import CameraPreview from "./broadcast/CameraPreview";
import CreatorEarnings from "./creator/CreatorEarnings";
import { useAuth } from "@/hooks/useAuth";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

interface CreatorBroadcastProps {
  creatorId: string;
  creatorName: string;
}

const CreatorBroadcast = ({ creatorId, creatorName }: CreatorBroadcastProps) => {
  const { user } = useAuth();
  const isPremium = user?.profile?.subscriptionStatus === "active";
  
  // For handling tags as a string array
  const [tagsInput, setTagsInput] = useState<string>("");
  
  const {
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    tags,
    setTags,
    isSubscriberOnly,
    setIsSubscriberOnly,
    isLive,
    isMicEnabled,
    isVideoEnabled,
    viewerCount,
    broadcastDuration,
    isLoading,
    startBroadcastHandler,
    stopBroadcastHandler,
    toggleMic,
    toggleVideo
  } = useBroadcast(creatorId, creatorName);
  
  // Handle tags input
  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    // Convert comma-separated string to array
    const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setTags(tagsArray);
  };
  
  if (!isPremium) {
    return (
      <div className="text-center py-12">
        <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Premium Feature</h3>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          The Go Live streaming feature is only available for premium subscribers.
          Upgrade now to start broadcasting to your audience!
        </p>
        <Button asChild>
          <Link to="/subscription">Upgrade to Premium</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column - Stream settings */}
        <div className="md:col-span-2 space-y-4">
          <StreamSettings
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            category={category}
            setCategory={setCategory}
            tags={tagsInput}
            setTags={handleTagsChange}
            isSubscriberOnly={isSubscriberOnly}
            setIsSubscriberOnly={setIsSubscriberOnly}
            isLive={isLive}
          />
          
          {/* Creator earnings section (only when not live) */}
          {!isLive && (
            <CreatorEarnings creatorId={creatorId} />
          )}
        </div>
        
        {/* Right column - Video preview */}
        <div>
          <CameraPreview
            isLive={isLive}
            isVideoEnabled={isVideoEnabled}
            isMicEnabled={isMicEnabled}
            isLoading={isLoading}
            viewerCount={viewerCount}
            broadcastDuration={broadcastDuration}
            title={title}
            toggleMic={toggleMic}
            toggleVideo={toggleVideo}
            startBroadcastHandler={startBroadcastHandler}
            stopBroadcastHandler={stopBroadcastHandler}
            creatorId={creatorId}
          />
        </div>
      </div>
    </div>
  );
};

export default CreatorBroadcast;
