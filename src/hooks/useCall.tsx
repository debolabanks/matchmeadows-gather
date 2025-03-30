
import { useState, useRef, useCallback } from "react";
import { CallSession } from "@/types/message";
import { connectToRoom, createLocalAudioTrack, createLocalVideoTrack } from "@/services/twilioService";
import Video, { LocalTrack, Room } from "twilio-video";

type CallType = "video" | "voice";

interface UseCallReturn {
  activeCall: CallSession | null;
  incomingCall: {
    from: {
      id: string;
      name: string;
      imageUrl: string;
    };
    type: CallType;
  } | null;
  startCall: (contactId: string, contactName: string, contactImage: string, type: CallType) => void;
  endCall: () => void;
  acceptIncomingCall: () => void;
  rejectIncomingCall: () => void;
  simulateIncomingCall: (fromId: string, fromName: string, fromImage: string, type: CallType) => void;
  twilioRoom: Room | null;
  localTracks: LocalTrack[];
}

export const useCall = (): UseCallReturn => {
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [incomingCall, setIncomingCall] = useState<UseCallReturn["incomingCall"]>(null);
  const [twilioRoom, setTwilioRoom] = useState<Room | null>(null);
  const [localTracks, setLocalTracks] = useState<LocalTrack[]>([]);
  
  const timerRef = useRef<number | null>(null);

  // Cleanup function for when call ends
  const cleanupResources = useCallback(() => {
    // Stop all local tracks
    localTracks.forEach(track => track.stop());
    setLocalTracks([]);
    
    // Disconnect from Twilio room if active
    if (twilioRoom) {
      twilioRoom.disconnect();
      setTwilioRoom(null);
    }
    
    // Clear any active timers
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [localTracks, twilioRoom]);

  // Start a new outgoing call
  const startCall = useCallback(async (contactId: string, contactName: string, contactImage: string, type: CallType) => {
    // End any existing call first
    if (activeCall) {
      endCall();
    }
    
    // Create a new call session
    const newCall: CallSession = {
      id: `call-${Date.now()}`,
      type,
      participants: ["currentUser", contactId],
      startTime: new Date().toISOString(),
      status: "connecting",
    };
    
    setActiveCall(newCall);
    
    try {
      // Connect to Twilio room
      const room = await connectToRoom({
        name: `room-${contactId}-${Date.now()}`,
        audio: true,
        video: type === "video",
      });
      
      setTwilioRoom(room);
      
      // Get local tracks from room
      const tracks = Array.from(room.localParticipant.tracks.values())
        .map(publication => publication.track)
        .filter(track => track !== null) as LocalTrack[];
      
      setLocalTracks(tracks);
      
      // Update call status
      setActiveCall(prev => prev ? {
        ...prev,
        status: "connected"
      } : null);
      
      console.log(`Started ${type} call with ${contactName} using Twilio`);
    } catch (error) {
      console.error("Failed to start call:", error);
      
      // Update call status to reflect error
      setActiveCall(prev => prev ? {
        ...prev,
        status: "ended",
        endTime: new Date().toISOString()
      } : null);
      
      // Clean up anyway
      cleanupResources();
    }
  }, [activeCall, cleanupResources]);

  // End the current call
  const endCall = useCallback(() => {
    if (activeCall) {
      // Update call status and set end time
      const endedCall: CallSession = {
        ...activeCall,
        status: "ended",
        endTime: new Date().toISOString(),
        duration: activeCall.startTime ? 
          Math.floor((Date.now() - new Date(activeCall.startTime).getTime()) / 1000) : 
          0
      };
      
      // In a real app, you would save the call to history here
      console.log("Call ended:", endedCall);
      
      // Clean up resources
      cleanupResources();
      
      // Clear the active call
      setActiveCall(null);
    }
  }, [activeCall, cleanupResources]);

  // Simulate receiving an incoming call (for demo purposes)
  const simulateIncomingCall = useCallback((fromId: string, fromName: string, fromImage: string, type: CallType) => {
    if (!activeCall) {
      setIncomingCall({
        from: {
          id: fromId,
          name: fromName,
          imageUrl: fromImage
        },
        type
      });
      
      // Auto-reject after 30 seconds if not answered
      timerRef.current = window.setTimeout(() => {
        setIncomingCall(prev => {
          if (prev && prev.from.id === fromId) {
            return null;
          }
          return prev;
        });
      }, 30000);
    }
  }, [activeCall]);

  // Accept an incoming call
  const acceptIncomingCall = useCallback(async () => {
    if (incomingCall) {
      const newCall: CallSession = {
        id: `call-${Date.now()}`,
        type: incomingCall.type,
        participants: ["currentUser", incomingCall.from.id],
        startTime: new Date().toISOString(),
        status: "connecting",
      };
      
      setActiveCall(newCall);
      setIncomingCall(null);
      
      // Connect to Twilio room
      try {
        const room = await connectToRoom({
          name: `room-${incomingCall.from.id}-${Date.now()}`,
          audio: true,
          video: incomingCall.type === "video",
        });
        
        setTwilioRoom(room);
        
        // Get local tracks from room
        const tracks = Array.from(room.localParticipant.tracks.values())
          .map(publication => publication.track)
          .filter(track => track !== null) as LocalTrack[];
        
        setLocalTracks(tracks);
        
        // Update call status
        setActiveCall(prev => prev ? {
          ...prev,
          status: "connected"
        } : null);
        
        console.log(`Accepted ${incomingCall.type} call from ${incomingCall.from.name} using Twilio`);
      } catch (error) {
        console.error("Failed to accept call:", error);
        
        // Update call status to reflect error
        setActiveCall(prev => prev ? {
          ...prev,
          status: "ended",
          endTime: new Date().toISOString()
        } : null);
        
        // Clean up anyway
        cleanupResources();
      }
    }
  }, [incomingCall, cleanupResources]);

  // Reject an incoming call
  const rejectIncomingCall = useCallback(() => {
    if (incomingCall) {
      // In a real app, you would notify the caller
      console.log(`Rejected call from ${incomingCall.from.name}`);
      
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      setIncomingCall(null);
    }
  }, [incomingCall]);

  return {
    activeCall,
    incomingCall,
    startCall,
    endCall,
    acceptIncomingCall,
    rejectIncomingCall,
    simulateIncomingCall,
    twilioRoom,
    localTracks
  };
};
