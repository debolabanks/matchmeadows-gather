
import { VideoCallState } from "./videoCallTypes";

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
