
import { connectToRoom, ConnectOptions } from './twilioConnection';
import { 
  createLocalAudioTrack, 
  createLocalVideoTrack, 
  attachTrackToElement, 
  detachAllTracks,
  getDeviceOptions
} from './twilioRoomUtils';
import { createDemoRoom } from './twilioMockRoom';
import { Room } from 'twilio-video';

/**
 * Start a broadcast as a creator
 */
export const startBroadcast = async (roomName: string, options = {
  audio: true,
  video: true,
  quality: 'standard' as const,
  screenShare: false
}): Promise<Room> => {
  return connectToRoom({
    name: roomName,
    audio: options.audio,
    video: options.video,
    isPresenter: true,
    quality: options.quality,
    screenShare: options.screenShare
  });
};

/**
 * Join a broadcast as a viewer
 */
export const joinBroadcast = async (roomName: string): Promise<Room> => {
  return connectToRoom({
    name: roomName,
    audio: false, // Viewers don't need to send audio
    video: false, // Viewers don't need to send video
    isPresenter: false
  });
};

// Export all the utility functions
export {
  connectToRoom,
  createLocalAudioTrack,
  createLocalVideoTrack,
  attachTrackToElement,
  detachAllTracks,
  getDeviceOptions
};

// Export types
export type { ConnectOptions };
