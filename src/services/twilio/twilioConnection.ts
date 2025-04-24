
import Video, { 
  LocalTrack, 
  LocalVideoTrack, 
  LocalAudioTrack, 
  Room 
} from 'twilio-video';
import { createDemoRoom } from './twilioMockRoom';
import { getRoomAccessDetails } from './twilioTokenService';
import webRTCService from '../webrtc/webRTCService';

export interface ConnectOptions {
  name: string; // Room name
  audio: boolean;
  video: boolean;
  isPresenter?: boolean; // Whether this user is broadcasting (presenter) or viewing
  quality?: 'low' | 'standard' | 'high'; // Stream quality
  screenShare?: boolean; // Whether to include screen sharing
  useWebRTC?: boolean; // Whether to use native WebRTC instead of Twilio
}

/**
 * Connect to a video room - either Twilio or WebRTC based
 */
export const connectToRoom = async ({ 
  name, 
  audio, 
  video, 
  isPresenter = false,
  quality = 'standard',
  screenShare = false,
  useWebRTC = true // Default to WebRTC for better performance
}: ConnectOptions): Promise<Room> => {
  try {
    console.log(`Connecting to room: ${name} as ${isPresenter ? 'presenter' : 'viewer'} using ${useWebRTC ? 'WebRTC' : 'Twilio'}`);
    
    // If using WebRTC implementation, don't use Twilio
    if (useWebRTC) {
      // Start local media stream
      if (audio || video) {
        await webRTCService.startLocalStream({ audio, video });
      }
      
      // Start screen sharing if requested
      if (screenShare && isPresenter) {
        try {
          await webRTCService.startScreenSharing();
        } catch (err) {
          console.error("Failed to get screen sharing:", err);
        }
      }
      
      // Return a mock room that works with our WebRTC implementation
      // This ensures compatibility with existing code
      return createDemoRoom(name, [], isPresenter);
    }
    
    // Original Twilio implementation
    const tracks: LocalTrack[] = [];
    
    if (audio) {
      const audioTrack = await Video.createLocalAudioTrack({
        name: 'microphone'
      });
      tracks.push(audioTrack);
    }
    
    if (video) {
      // Set video quality based on the quality parameter
      const videoOptions = {
        low: { width: 320, height: 240 },
        standard: { width: 640, height: 480 },
        high: { width: 1280, height: 720 }
      };
      
      const videoTrack = await Video.createLocalVideoTrack({
        name: 'camera',
        ...videoOptions[quality]
      });
      
      tracks.push(videoTrack);
    }
    
    // Get room access token from our token service
    const { token, identity } = await getRoomAccessDetails(name, isPresenter ? 'presenter' : 'viewer');
    
    // Check if we're in demo mode (no actual Twilio credentials)
    if (token.startsWith('demo-token-')) {
      console.log("Using demo room since no Twilio credentials are present");
      return createDemoRoom(name, tracks, isPresenter);
    }
    
    // In production with real token, connect to actual Twilio service
    return await Video.connect(token, { 
      name, 
      tracks, 
      audio, 
      video 
    });
    
  } catch (error) {
    console.error('Error connecting to room:', error);
    throw error;
  }
};

// Export these for backward compatibility
export const createLocalAudioTrack = Video.createLocalAudioTrack;
export const createLocalVideoTrack = Video.createLocalVideoTrack;
