
import Video, { 
  LocalTrack, 
  LocalVideoTrack, 
  LocalAudioTrack, 
  LocalDataTrack,
  Room, 
  RemoteParticipant 
} from 'twilio-video';

// This would normally come from a server endpoint that generates tokens
// In a production app, never expose your Twilio credentials in frontend code
const DEMO_TOKEN = "DEMO_MODE_NO_ACTUAL_CONNECTION";

interface ConnectOptions {
  name: string; // Room name
  audio: boolean;
  video: boolean;
  isPresenter?: boolean; // Whether this user is broadcasting (presenter) or viewing
  quality?: 'low' | 'standard' | 'high'; // Stream quality
  screenShare?: boolean; // Whether to include screen sharing
}

/**
 * Connect to a Twilio Video room
 * In a real implementation, we would fetch a token from the server first
 */
export const connectToRoom = async ({ 
  name, 
  audio, 
  video, 
  isPresenter = false,
  quality = 'standard',
  screenShare = false
}: ConnectOptions): Promise<Room> => {
  try {
    console.log(`Connecting to room: ${name} as ${isPresenter ? 'presenter' : 'viewer'}`);
    
    // Create appropriate tracks based on preferences
    const tracks: LocalTrack[] = [];
    
    if (audio) {
      const audioTrack = await createLocalAudioTrack();
      tracks.push(audioTrack);
    }
    
    if (video) {
      // Set video quality based on the quality parameter
      const videoOptions = {
        low: { width: 320, height: 240 },
        standard: { width: 640, height: 480 },
        high: { width: 1280, height: 720 }
      };
      
      const videoTrack = await createLocalVideoTrack({
        name: 'camera',
        ...videoOptions[quality]
      });
      
      tracks.push(videoTrack);
    }
    
    // Add screen sharing if requested (in a real app)
    if (screenShare && isPresenter) {
      try {
        // This is just a placeholder for demo - in a real app we would capture the screen
        console.log("Screen sharing would be enabled in a real implementation");
        // const screenTrack = await Video.createLocalVideoTrack({ name: 'screen' });
        // tracks.push(screenTrack);
      } catch (err) {
        console.error("Failed to get screen sharing:", err);
      }
    }
    
    // In real implementation, we would use:
    // return await Video.connect(token, { name, tracks });
    
    // For demo, create a simulated room without actually connecting to Twilio
    return createDemoRoom(name, tracks, isPresenter);
    
  } catch (error) {
    console.error('Error connecting to Twilio room:', error);
    throw error;
  }
};

/**
 * Create a local audio track
 */
export const createLocalAudioTrack = async (options = {}): Promise<LocalAudioTrack> => {
  return Video.createLocalAudioTrack({
    name: 'microphone',
    ...options
  });
};

/**
 * Create a local video track
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
 * For demonstration purposes only - creates a mock Room object
 * In a real implementation, this would be handled by Twilio's SDK
 */
const createDemoRoom = (roomName: string, localTracks: LocalTrack[], isPresenter: boolean = false): Room => {
  // This is a simplified mock of a Twilio Room for demonstration
  // In a real app, this would come from the Twilio SDK
  const eventHandlers: Record<string, Function[]> = {};
  
  const demoRoom = {
    name: roomName,
    localParticipant: {
      identity: isPresenter ? 'creator' : 'viewer',
      tracks: new Map(localTracks.map(track => [
        track.id,
        {
          track,
          trackSid: track.id,
          trackName: track.name,
          isTrackEnabled: true,
          kind: track.kind,
          send: () => {},
        }
      ])),
      publishTrack: (track: LocalTrack) => Promise.resolve({
        track,
        trackSid: track.id,
        trackName: track.name,
        isTrackEnabled: true,
        kind: track.kind,
      }),
      unpublishTrack: (track: LocalTrack) => Promise.resolve({
        track,
        trackSid: track.id,
        trackName: track.name,
        isTrackEnabled: true,
        kind: track.kind,
      }),
    },
    participants: new Map<string, RemoteParticipant>(),
    disconnect: () => {
      // Safely stop tracks with type checking
      localTracks.forEach(track => {
        if ('stop' in track && typeof track.stop === 'function') {
          track.stop();
        } else if (track instanceof LocalAudioTrack || track instanceof LocalVideoTrack) {
          track.stop();
        }
      });
      console.log('Disconnected from room:', roomName);
      
      // Call any disconnect event handlers
      if (eventHandlers['disconnected']) {
        eventHandlers['disconnected'].forEach(handler => handler());
      }
    },
    on: (event: string, handler: Function) => {
      // Add event handler
      if (!eventHandlers[event]) {
        eventHandlers[event] = [];
      }
      eventHandlers[event].push(handler);
      console.log(`[Demo Room] Registered handler for event: ${event}`);
      return demoRoom;
    },
    // Fix the TypeScript error by using 'any' type for event parameter
    off: (event: any, handler?: Function) => {
      // Remove event handler
      if (eventHandlers[event]) {
        if (handler) {
          // Remove specific handler
          eventHandlers[event] = eventHandlers[event].filter(h => h !== handler);
        } else {
          // Remove all handlers for this event
          delete eventHandlers[event];
        }
      }
      return demoRoom;
    },
    once: (event: any, handler: Function) => {
      // Add a one-time event handler
      const onceHandler = (...args: any[]) => {
        handler(...args);
        demoRoom.off(event, onceHandler);
      };
      
      demoRoom.on(event, onceHandler);
      return demoRoom;
    },
    // Mock other Room properties and methods as needed
  } as unknown as Room;
  
  // Simulate the connected state and add a fake remote participant if this is a viewer
  setTimeout(() => {
    console.log(`[Demo Room] Connected to room: ${roomName}`);
    
    // If this is a viewer, simulate a presenter being in the room
    if (!isPresenter) {
      const fakePresenter = {
        identity: 'creator',
        tracks: new Map(),
      } as unknown as RemoteParticipant;
      
      // Add the fake presenter to the participants map
      demoRoom.participants.set('creator', fakePresenter);
      
      // Trigger the participantConnected event
      if (eventHandlers['participantConnected']) {
        eventHandlers['participantConnected'].forEach(handler => handler(fakePresenter));
      }
    }
  }, 1000);
  
  return demoRoom;
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
