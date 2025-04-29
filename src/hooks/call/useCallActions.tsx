
import { useCallback } from "react";
import { connectToRoom, createLocalAudioTrack, createLocalVideoTrack } from "@/services/twilio";
import { CallType } from "./callTypes";
import { cleanupCallResources, createCallSession, endCallSession } from "./callUtils";
import { LocalTrack, Room } from "twilio-video";
import { CallSession } from "@/types/message";

interface UseCallActionsProps {
  activeCall: CallSession | null;
  twilioRoom: Room | null;
  localTracks: LocalTrack[];
  incomingCall: {
    from: {
      id: string;
      name: string;
      imageUrl: string;
    };
    type: CallType;
  } | null;
  timerRef: { current: number | null };
  setActiveCall: React.Dispatch<React.SetStateAction<CallSession | null>>;
  setIncomingCall: React.Dispatch<React.SetStateAction<UseCallActionsProps["incomingCall"]>>;
  setTwilioRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  setLocalTracks: React.Dispatch<React.SetStateAction<LocalTrack[]>>;
}

/**
 * Hook that provides call action handlers
 */
export const useCallActions = ({
  activeCall,
  twilioRoom,
  localTracks,
  incomingCall,
  timerRef,
  setActiveCall,
  setIncomingCall,
  setTwilioRoom,
  setLocalTracks
}: UseCallActionsProps) => {
  /**
   * Cleanup resources for an existing call
   */
  const cleanupResources = useCallback(() => {
    cleanupCallResources(localTracks, twilioRoom, timerRef);
    setLocalTracks([]);
    setTwilioRoom(null);
  }, [localTracks, twilioRoom, timerRef, setLocalTracks, setTwilioRoom]);

  /**
   * Start a new call with a contact
   */
  const startCall = useCallback(async (
    contactId: string, 
    contactName: string, 
    contactImage: string, 
    type: CallType
  ) => {
    if (activeCall) {
      endCall();
    }
    
    const newCall = createCallSession(contactId, type);
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
  }, [activeCall, cleanupResources, setActiveCall, setTwilioRoom, setLocalTracks]);

  /**
   * End an active call
   */
  const endCall = useCallback(() => {
    if (activeCall) {
      const endedCall = endCallSession(activeCall);
      console.log("Call ended:", endedCall);
      
      cleanupResources();
      setActiveCall(null);
    }
  }, [activeCall, cleanupResources, setActiveCall]);

  /**
   * Simulate an incoming call (for demo purposes)
   */
  const simulateIncomingCall = useCallback((
    fromId: string, 
    fromName: string, 
    fromImage: string, 
    type: CallType
  ) => {
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
  }, [activeCall, setIncomingCall, timerRef]);

  /**
   * Accept an incoming call
   */
  const acceptIncomingCall = useCallback(async () => {
    if (incomingCall) {
      const newCall = createCallSession(incomingCall.from.id, incomingCall.type);
      
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
  }, [incomingCall, cleanupResources, setActiveCall, setIncomingCall, setTwilioRoom, setLocalTracks]);

  /**
   * Reject an incoming call
   */
  const rejectIncomingCall = useCallback(() => {
    if (incomingCall) {
      console.log(`Rejected call from ${incomingCall.from.name}`);
      
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      setIncomingCall(null);
    }
  }, [incomingCall, timerRef, setIncomingCall]);

  return {
    startCall,
    endCall,
    acceptIncomingCall,
    rejectIncomingCall,
    simulateIncomingCall
  };
};
