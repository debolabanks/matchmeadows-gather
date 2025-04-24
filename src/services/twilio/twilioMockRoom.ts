
import Video, { 
  LocalTrack, 
  LocalVideoTrack, 
  LocalAudioTrack, 
  LocalDataTrack,
  Room, 
  RemoteParticipant 
} from 'twilio-video';

/**
 * For demonstration purposes only - creates a mock Room object
 * In a real implementation, this would be handled by Twilio's SDK
 */
export const createDemoRoom = (roomName: string, localTracks: LocalTrack[], isPresenter: boolean = false): Room => {
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
        on: (event: string, handler: Function) => {
          console.log(`[Fake Presenter] Registered handler for event: ${event}`);
          return fakePresenter;
        },
        off: (event: string, handler?: Function) => {
          console.log(`[Fake Presenter] Removed handler for event: ${event}`);
          return fakePresenter;
        },
        removeAllListeners: () => {
          console.log(`[Fake Presenter] Removed all listeners`);
        }
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
