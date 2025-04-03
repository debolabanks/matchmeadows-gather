import { useState, useRef, useCallback } from "react";
import { CallSession } from "@/types/message";
import { connectToRoom, createLocalAudioTrack, createLocalVideoTrack } from "@/services/twilio";
import Video, { LocalTrack, LocalAudioTrack, LocalVideoTrack, Room } from "twilio-video";

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

  const cleanupResources = useCallback(() => {
    localTracks.forEach(track => {
      if (track instanceof LocalAudioTrack || track instanceof LocalVideoTrack) {
        track.stop();
      } else if ('stop' in track && typeof track.stop === 'function') {
        track.stop();
      }
    });
    setLocalTracks([]);
    
    if (twilioRoom) {
      twilioRoom.disconnect();
      setTwilioRoom(null);
    }
    
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [localTracks, twilioRoom]);

  const startCall = useCallback(async (contactId: string, contactName: string, contactImage: string, type: CallType) => {
    if (activeCall) {
      endCall();
    }
    
    const newCall: CallSession = {
      id: `call-${Date.now()}`,
      type,
      participants: ["currentUser", contactId],
      startTime: new Date().toISOString(),
      status: "connecting",
    };
    
    setActiveCall(newCall);
    
    try {
      const room = await connectToRoom({
        name: `room-${contactId}-${Date.now()}`,
        audio: true,
        video: type === "video",
      });
      
      setTwilioRoom(room);
      
      const tracks = Array.from(room.localParticipant.tracks.values())
        .map(publication => publication.track)
        .filter(track => track !== null) as LocalTrack[];
      
      setLocalTracks(tracks);
      
      setActiveCall(prev => prev ? {
        ...prev,
        status: "connected"
      } : null);
      
      console.log(`Started ${type} call with ${contactName} using Twilio`);
    } catch (error) {
      console.error("Failed to start call:", error);
      
      setActiveCall(prev => prev ? {
        ...prev,
        status: "ended",
        endTime: new Date().toISOString()
      } : null);
      
      cleanupResources();
    }
  }, [activeCall, cleanupResources]);

  const endCall = useCallback(() => {
    if (activeCall) {
      const endedCall: CallSession = {
        ...activeCall,
        status: "ended",
        endTime: new Date().toISOString(),
        duration: activeCall.startTime ? 
          Math.floor((Date.now() - new Date(activeCall.startTime).getTime()) / 1000) : 
          0
      };
      
      console.log("Call ended:", endedCall);
      
      cleanupResources();
      
      setActiveCall(null);
    }
  }, [activeCall, cleanupResources]);

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
      
      try {
        const room = await connectToRoom({
          name: `room-${incomingCall.from.id}-${Date.now()}`,
          audio: true,
          video: incomingCall.type === "video",
        });
        
        setTwilioRoom(room);
        
        const tracks = Array.from(room.localParticipant.tracks.values())
          .map(publication => publication.track)
          .filter(track => track !== null) as LocalTrack[];
        
        setLocalTracks(tracks);
        
        setActiveCall(prev => prev ? {
          ...prev,
          status: "connected"
        } : null);
        
        console.log(`Accepted ${incomingCall.type} call from ${incomingCall.from.name} using Twilio`);
      } catch (error) {
        console.error("Failed to accept call:", error);
        
        setActiveCall(prev => prev ? {
          ...prev,
          status: "ended",
          endTime: new Date().toISOString()
        } : null);
        
        cleanupResources();
      }
    }
  }, [incomingCall, cleanupResources]);

  const rejectIncomingCall = useCallback(() => {
    if (incomingCall) {
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
