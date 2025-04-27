
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
  const inFreeTrial = user?.profile?.trialStartDate ? 
    new Date() < new Date(new Date(user.profile.trialStartDate).getTime() + 7 * 24 * 60 * 60 * 1000) : 
    false;
  
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
  
  if (!isPremium && !inFreeTrial) {
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
  
  if (inFreeTrial && !isPremium) {
    const trialEndDate = new Date(new Date(user!.profile!.trialStartDate!).getTime() + 7 * 24 * 60 * 60 * 1000);
    const daysLeft = Math.ceil((trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-amber-800">
          <h3 className="font-semibold mb-1 flex items-center">
            <span className="mr-2">🎁</span> Free Trial Feature
          </h3>
          <p className="text-sm">
            You're using Go Live as part of your 7-day free trial. {daysLeft} day{daysLeft !== 1 ? 's' : ''} left. 
            <Link to="/subscription" className="underline font-medium ml-1">
              Upgrade to keep streaming.
            </Link>
          </p>
        </div>
        
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
              viewerCount={typeof viewerCount === 'string' ? parseInt(viewerCount, 10) || 0 : viewerCount || 0}
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
  }
  
  // Convert viewerCount to a number (ensuring it's properly typed)
  const numericViewerCount = typeof viewerCount === 'string' ? parseInt(viewerCount, 10) || 0 : viewerCount || 0;
  
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
            viewerCount={numericViewerCount}
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
