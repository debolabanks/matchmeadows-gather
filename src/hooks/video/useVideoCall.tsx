
import { useCallContext } from "@/contexts/CallContext";
import { VideoCallState, UseVideoCallProps, VideoCallRefs, VideoCallActions } from "./videoCallTypes";
import { useVideoCallState } from "./useVideoCallState";
import { useVideoCallTracks } from "./useVideoCallTracks";
import { useVideoCallActions } from "./useVideoCallActions";

/**
 * Format seconds into a readable duration string (MM:SS)
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Initialize the video call state
 */
export const initializeVideoCallState = (callType: "video" | "voice", isIncoming: boolean): VideoCallState => {
  return {
    callStatus: isIncoming ? "connecting" : "connecting",
    isMuted: false,
    isVideoOff: callType === "voice",
    isSpeakerOn: true,
    isFullscreen: false,
    duration: 0,
    remoteParticipant: null
  };
};

/**
 * Hook to manage video call functionality
 */
export const useVideoCall = ({
  contactId,
  contactName,
  contactImage,
  callType,
  onEnd,
  isIncoming = false,
  onAccept,
  onReject
}: UseVideoCallProps) => {
  // Get context data
  const { localTracks } = useCallContext();
  
  // Initialize state and refs
  const { 
    state, 
    updateState, 
    refs, 
    timerRef, 
    startTimer 
  } = useVideoCallState({ callType, isIncoming });

  // Set up track handling
  useVideoCallTracks(
    state,
    updateState,
    refs.localVideoRef,
    refs.remoteVideoRef
  );

  // Initialize call actions
  const actions = useVideoCallActions(
    state,
    updateState,
    timerRef,
    localTracks,
    onEnd,
    onAccept,
    onReject
  );

  return {
    state,
    refs,
    actions,
    formatDuration
  };
};

