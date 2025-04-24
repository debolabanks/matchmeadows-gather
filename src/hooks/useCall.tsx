import { useState, useRef, useCallback, useEffect } from "react";
import { CallSession } from "@/types/message";
import { v4 as uuidv4 } from "uuid";
import { connectToRoom } from "@/services/twilio";
import { Room, LocalTrack } from "twilio-video";
import { useToast } from "@/hooks/use-toast";
import { playIncomingCallSound, stopAllSounds } from "@/services/soundService";
import webRTCService from "@/services/webrtc/webRTCService";
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

  // Initialize WebRTC service
  useEffect(() => {
    if (user?.id) {
      webRTCService.initialize(user.id);
    }
  }, [user?.id]);
  
  // Start a call with someone
  const startCall = useCallback(async (
    contactId: string, 
    contactName: string, 
    contactImage: string,
    type: "video" | "voice"
  ) => {
    try {
      // Set up local state to indicate we're in a call
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
      
      // Try to use WebRTC first for better performance and reliability
      try {
        await webRTCService.startLocalStream({ 
          audio: true, 
          video: type === "video" 
        });
        
        await webRTCService.call(contactId);
        
        // Create a "room" using our webRTC implementation
        const room = await connectToRoom({
          name: `call-${newCallSession.id}`,
          audio: true,
          video: type === "video",
          useWebRTC: true
        });
        
        twilioRoom.current = room;
        
        // Update call status to connected
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
        
      } catch (webrtcError) {
        console.error("WebRTC failed, falling back to Twilio:", webrtcError);
        
        // Fall back to Twilio if WebRTC fails
        const constraints = {
          audio: true,
          video: type === "video",
        };
        
        const tracks = [];
        
        if (constraints.audio) {
          const audioTrack = await navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => stream.getAudioTracks()[0]);
          tracks.push(audioTrack);
        }
        
        if (constraints.video) {
          const videoTrack = await navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => stream.getVideoTracks()[0]);
          tracks.push(videoTrack);
        }
        
        localTracks.current = tracks as unknown as LocalTrack[];
        
        const room = await connectToRoom({
          name: `call-${newCallSession.id}`,
          audio: constraints.audio,
          video: constraints.video,
          useWebRTC: false
        });
        
        twilioRoom.current = room;
        
        // Update call status to connected
        setState(prev => ({
          ...prev,
          activeCall: {
            ...prev.activeCall!,
            status: "connected"
          }
        }));
      }
      
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
  }, [toast, user?.id]);
  
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
      if ('stop' in track) {
        (track as any).stop();
      }
    });
    localTracks.current = [];
    
    // Also clean up WebRTC connections
    webRTCService.stopLocalStream();
    webRTCService.hangup();
    
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
