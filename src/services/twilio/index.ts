
// Export all Twilio service functionality
export * from "./twilioMockRoom";
export * from "./twilioTokenService";
export * from "./twilioBroadcast";

// Export from twilioRoomUtils and twilioConnection with conflict resolution
export { 
  // Only export these functions from twilioRoomUtils
  attachTrackToElement,
  detachAllTracks,
  getDeviceOptions
} from "./twilioRoomUtils";

export {
  // Export these from twilioConnection
  connectToRoom,
  createLocalAudioTrack,
  createLocalVideoTrack
} from "./twilioConnection";

// Export type definitions - using 'export type' syntax for TypeScript isolated modules
export type { ConnectOptions } from "./twilioConnection";
