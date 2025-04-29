import { useState, useRef, useCallback, useEffect } from "react";
import { CallSession } from "@/types/message";
import { v4 as uuidv4 } from "uuid";
import { connectToRoom } from "@/services/twilio";
import { Room, LocalTrack } from "twilio-video";
import { useToast } from "@/hooks/use-toast";
import { playIncomingCallSound, stopAllSounds } from "@/services/soundService";
import { useAuth } from "@/hooks/useAuth";

interface CallState {
  activeCall: CallSession | null;
  incomingCall: {
    from: {
      id: string;
      name: string;
      image: string;
    };
    type: "video" | "voice";
  } | null;
}

export const useCall = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<CallState>({
    activeCall: null,
    incomingCall: null,
  });
  const twilioRoom = useRef<Room | null>(null);
  const localTracks = useRef<LocalTrack[]>([]);

  // Start a call with someone
  const startCall = useCallback(async (
    contactId: string, 
    contactName: string, 
    contactImage: string,
    type: "video" | "voice"
  ) => {
    try {
      const newCallSession: CallSession = {
        id: uuidv4(),
        type: type,
        participants: [contactId, "currentUser"],
        startTime: new Date().toISOString(),
        status: "connecting",
      };
      
      setState(prev => ({
        ...prev,
        activeCall: newCallSession,
      }));

      // Create a room using Twilio
      const room = await connectToRoom({
        name: `call-${newCallSession.id}`,
        audio: true,
        video: type === "video"
      });
      
      twilioRoom.current = room;
      
      setState(prev => ({
        ...prev,
        activeCall: {
          ...prev.activeCall!,
          status: "connected"
        }
      }));
      
      toast({
        title: `${type === "video" ? "Video" : "Voice"} call started`,
        description: `Connected with ${contactName}`,
      });
      
    } catch (error) {
      console.error("Failed to start call:", error);
      
      toast({
        title: "Call failed",
        description: "Could not establish connection",
        variant: "destructive",
      });
      
      setState(prev => ({
        ...prev,
        activeCall: null,
      }));
    }
  }, [toast]);

  // End the current call
  const endCall = useCallback(() => {
    stopAllSounds();
    
    // Disconnect from Twilio room if it exists
    if (twilioRoom.current) {
      twilioRoom.current.disconnect();
      twilioRoom.current = null;
    }
    
    // Stop all local tracks
    localTracks.current.forEach(track => {
      // Fixed: Use the correct method to stop tracks
      if (track.kind !== 'data') {
        track.disable();
      }
    });
    localTracks.current = [];
    
    setState(prev => {
      // Only update if we have an active call to prevent unnecessary rerenders
      if (prev.activeCall) {
        return {
          ...prev,
          activeCall: null,
          incomingCall: null,
        };
      }
      return prev;
    });
    
  }, []);
  
  // Simulate an incoming call for testing
  const simulateIncomingCall = useCallback((
    fromId: string, 
    fromName: string, 
    fromImage: string,
    type: "video" | "voice"
  ) => {
    playIncomingCallSound();
    
    setState(prev => ({
      ...prev,
      incomingCall: {
        from: {
          id: fromId,
          name: fromName,
          image: fromImage,
        },
        type,
      },
    }));
  }, []);
  
  // Accept an incoming call
  const acceptIncomingCall = useCallback(() => {
    if (!state.incomingCall) return;
    
    stopAllSounds();
    
    const { from, type } = state.incomingCall;
    
    // Create new call session
    const newCallSession: CallSession = {
      id: uuidv4(),
      type: type,
      participants: [from.id, "currentUser"],
      startTime: new Date().toISOString(),
      status: "connected",
    };
    
    setState(prev => ({
      ...prev,
      activeCall: newCallSession,
      incomingCall: null,
    }));
    
    // Actually start the call
    startCall(from.id, from.name, from.image, type);
  }, [state.incomingCall, startCall]);
  
  // Reject an incoming call
  const rejectIncomingCall = useCallback(() => {
    stopAllSounds();
    
    setState(prev => ({
      ...prev,
      incomingCall: null,
    }));
  }, []);
  
  return {
    activeCall: state.activeCall,
    incomingCall: state.incomingCall,
    twilioRoom: twilioRoom.current,
    localTracks: localTracks.current,
    startCall,
    endCall,
    simulateIncomingCall,
    acceptIncomingCall,
    rejectIncomingCall,
  };
};
