
import { useState } from "react";
import { CallSession } from "@/types/message";

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
}

export const useCall = (): UseCallReturn => {
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [incomingCall, setIncomingCall] = useState<UseCallReturn["incomingCall"]>(null);

  // Start a new outgoing call
  const startCall = (contactId: string, contactName: string, contactImage: string, type: CallType) => {
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
    
    // In a real app, you would initiate a WebRTC connection here
    console.log(`Starting ${type} call with ${contactName}`);
  };

  // End the current call
  const endCall = () => {
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
      
      // Clear the active call
      setActiveCall(null);
    }
  };

  // Simulate receiving an incoming call (for demo purposes)
  const simulateIncomingCall = (fromId: string, fromName: string, fromImage: string, type: CallType) => {
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
      setTimeout(() => {
        setIncomingCall(prev => {
          if (prev && prev.from.id === fromId) {
            return null;
          }
          return prev;
        });
      }, 30000);
    }
  };

  // Accept an incoming call
  const acceptIncomingCall = () => {
    if (incomingCall) {
      const newCall: CallSession = {
        id: `call-${Date.now()}`,
        type: incomingCall.type,
        participants: ["currentUser", incomingCall.from.id],
        startTime: new Date().toISOString(),
        status: "connected",
      };
      
      setActiveCall(newCall);
      setIncomingCall(null);
      
      // In a real app, you would establish the WebRTC connection here
      console.log(`Accepted ${incomingCall.type} call from ${incomingCall.from.name}`);
    }
  };

  // Reject an incoming call
  const rejectIncomingCall = () => {
    if (incomingCall) {
      // In a real app, you would notify the caller
      console.log(`Rejected call from ${incomingCall.from.name}`);
      
      setIncomingCall(null);
    }
  };

  return {
    activeCall,
    incomingCall,
    startCall,
    endCall,
    acceptIncomingCall,
    rejectIncomingCall,
    simulateIncomingCall
  };
};
