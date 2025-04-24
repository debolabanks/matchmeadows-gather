
import { useBroadcast } from "./broadcast/useBroadcast";
import StreamSettings from "./broadcast/StreamSettings";
import CameraPreview from "./broadcast/CameraPreview";

interface CreatorBroadcastProps {
  creatorId: string;
  creatorName: string;
}

const CreatorBroadcast = ({ creatorId, creatorName }: CreatorBroadcastProps) => {
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
            tags={tags}
            setTags={setTags}
            isSubscriberOnly={isSubscriberOnly}
            setIsSubscriberOnly={setIsSubscriberOnly}
            isLive={isLive}
          />
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
