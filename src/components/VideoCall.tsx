
import React, { useEffect } from "react";
import { useVideoCall } from "@/hooks/useVideoCall";
import { ActiveCallControls, IncomingCallControls } from "@/components/call/CallControls";
import CallAvatar from "@/components/call/CallAvatar";
import CallLayout from "@/components/call/CallLayout";
import { playIncomingCallSound, stopAllSounds } from "@/services/soundService";

interface VideoCallProps {
  contactId: string;
  contactName: string;
  contactImage: string;
  callType: "video" | "voice";
  onEnd: () => void;
  isIncoming?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}

const VideoCall = ({
  contactId,
  contactName,
  contactImage,
  callType,
  onEnd,
  isIncoming = false,
  onAccept,
  onReject
}: VideoCallProps) => {
  const {
    state,
    refs,
    actions,
    formatDuration
  } = useVideoCall({
    contactId,
    contactName,
    contactImage,
    callType,
    onEnd,
    isIncoming,
    onAccept,
    onReject
  });

  // Play sound effect for incoming calls
  useEffect(() => {
    if (isIncoming && state.callStatus === "connecting") {
      playIncomingCallSound();
    }
    
    return () => {
      stopAllSounds();
    };
  }, [isIncoming, state.callStatus]);

  return (
    <CallLayout
      remoteVideoRef={refs.remoteVideoRef}
      localVideoRef={refs.localVideoRef}
      containerRef={refs.callContainerRef}
      state={state}
      callType={callType}
      contactName={contactName}
      isFullscreen={state.isFullscreen}
    >
      {(callType === "voice" || state.callStatus !== "connected" || !state.remoteParticipant) && (
        <CallAvatar
          contactName={contactName}
          contactImage={contactImage}
          callStatus={state.callStatus}
          duration={state.duration}
          formatDuration={formatDuration}
        />
      )}
      
      <div className="bg-black p-4 flex justify-center">
        {isIncoming && state.callStatus === "connecting" ? (
          <IncomingCallControls 
            acceptCall={actions.acceptCall}
            rejectCall={actions.rejectCall}
          />
        ) : (
          <ActiveCallControls
            state={state}
            toggleMute={actions.toggleMute}
            toggleVideo={actions.toggleVideo}
            toggleSpeaker={actions.toggleSpeaker}
            toggleFullscreen={actions.toggleFullscreen}
            endCall={actions.endCall}
            callType={callType}
          />
        )}
      </div>
    </CallLayout>
  );
};

export default VideoCall;
