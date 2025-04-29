
import { LocalTrack, LocalAudioTrack, LocalVideoTrack, Room } from "twilio-video";
import { CallSession } from "@/types/message";

/**
 * Cleans up resources associated with a call
 */
export const cleanupCallResources = (
  localTracks: LocalTrack[],
  twilioRoom: Room | null,
  timerRef: { current: number | null }
): void => {
  // Stop and clean up local tracks
  localTracks.forEach(track => {
    if (track instanceof LocalAudioTrack || track instanceof LocalVideoTrack) {
      track.stop();
    } else if ('stop' in track && typeof track.stop === 'function') {
      track.stop();
    }
  });
  
  // Disconnect from Twilio room if connected
  if (twilioRoom) {
    twilioRoom.disconnect();
  }
  
  // Clear any existing timers
  if (timerRef.current) {
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }
};

/**
 * Creates a new call session object
 */
export const createCallSession = (
  contactId: string,
  type: "video" | "voice",
  status: CallSession["status"] = "connecting"
): CallSession => {
  return {
    id: `call-${Date.now()}`,
    type,
    participants: ["currentUser", contactId],
    startTime: new Date().toISOString(),
    status,
  };
};

/**
 * Updates a call session with end time and duration
 */
export const endCallSession = (call: CallSession | null): CallSession | null => {
  if (!call) return null;
  
  const endTime = new Date().toISOString();
  const duration = call.startTime ? 
    Math.floor((Date.now() - new Date(call.startTime).getTime()) / 1000) : 
    0;
    
  return {
    ...call,
    status: "ended",
    endTime,
    duration
  };
};
