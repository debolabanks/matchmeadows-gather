
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
}

/**
 * Connect to a Twilio Video room
 * In a real implementation, we would fetch a token from the server first
 */
export const connectToRoom = async ({ name, audio, video, isPresenter = false }: ConnectOptions): Promise<Room> => {
  try {
    console.log(`Connecting to room: ${name} as ${isPresenter ? 'presenter' : 'viewer'}`);
    
    // Create appropriate tracks based on preferences
    const tracks: LocalTrack[] = [];
    
    if (audio) {
      const audioTrack = await createLocalAudioTrack();
      tracks.push(audioTrack);
    }
    
    if (video) {
      const videoTrack = await createLocalVideoTrack();
      tracks.push(videoTrack);
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
export const createLocalAudioTrack = async (): Promise<LocalAudioTrack> => {
  return Video.createLocalAudioTrack({
    name: 'microphone',
  });
};

/**
 * Create a local video track
 */
export const createLocalVideoTrack = async (): Promise<LocalVideoTrack> => {
  return Video.createLocalVideoTrack({
    name: 'camera',
    width: 640,
    height: 480,
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
      tracks: localTracks.map(track => ({
        track,
        kind: track.kind,
        send: () => {},
      })),
      publishTrack: (track: LocalTrack) => Promise.resolve(track),
      unpublishTrack: (track: LocalTrack) => Promise.resolve(track),
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
    off: (event: string, handler?: Function) => {
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
    once: (event: string, handler: Function) => {
      // Mock event binding
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
export const startBroadcast = async (roomName: string): Promise<Room> => {
  return connectToRoom({
    name: roomName,
    audio: true,
    video: true,
    isPresenter: true
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
