
import Video, { 
  LocalTrack, 
  LocalVideoTrack, 
  LocalAudioTrack, 
  Room, 
  RemoteParticipant 
} from 'twilio-video';

/**
 * Create a local audio track - not exported in index.ts to avoid conflicts
 * Use this directly if needed
 */
export const createLocalAudioTrack = async (options = {}): Promise<LocalAudioTrack> => {
  return Video.createLocalAudioTrack({
    name: 'microphone',
    ...options
  });
};

/**
 * Create a local video track - not exported in index.ts to avoid conflicts
 * Use this directly if needed
 */
export const createLocalVideoTrack = async (options = {}): Promise<LocalVideoTrack> => {
  return Video.createLocalVideoTrack({
    name: 'camera',
    width: 640,
    height: 480,
    ...options
  });
};

/**
 * Utility to attach a video track to an HTML element
 */
export const attachTrackToElement = (track: Video.VideoTrack, element: HTMLVideoElement | null) => {
  if (!element) return;
  
  // Detach any existing tracks
  track.detach().forEach(el => el.remove());
  
  // Attach the new track
  const trackElement = track.attach();
  element.appendChild(trackElement);
};

/**
 * Utility to detach all tracks and clean up
 */
export const detachAllTracks = (tracks: Video.VideoTrack[]) => {
  tracks.forEach(track => {
    track.detach().forEach(element => element.remove());
  });
};

/**
 * Get device information for configuration
 */
export const getDeviceOptions = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    
    const videoInputs = devices.filter(device => device.kind === 'videoinput');
    const audioInputs = devices.filter(device => device.kind === 'audioinput');
    const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
    
    return {
      videoInputs,
      audioInputs,
      audioOutputs
    };
  } catch (error) {
    console.error('Error getting media devices:', error);
    return {
      videoInputs: [],
      audioInputs: [],
      audioOutputs: []
    };
  }
};
