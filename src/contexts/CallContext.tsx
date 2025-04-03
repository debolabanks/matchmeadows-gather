
import React, { createContext, useContext, useState, useEffect } from "react";
import { CallSession } from "@/types/message";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import { playIncomingCallSound } from "@/services/soundService";

interface CallContextType {
  currentCall: CallSession | null;
  incomingCall: CallSession | null;
  startCall: (contactId: string, type: "voice" | "video") => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
  isCallInProgress: boolean;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
};

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentCall, setCurrentCall] = useState<CallSession | null>(null);
  const [incomingCall, setIncomingCall] = useState<CallSession | null>(null);

  // Local state to track if a call is in progress
  const isCallInProgress = Boolean(currentCall && currentCall.status !== "ended" && currentCall.status !== "rejected");

  // Mock function to start a call
  const startCall = (contactId: string, type: "voice" | "video") => {
    if (isCallInProgress) {
      toast({
        title: "Call in progress",
        description: "Please end your current call before starting a new one.",
        variant: "destructive",
      });
      return;
    }

    // Create a new call session
    const newCall: CallSession = {
      id: `call-${Date.now()}`,
      type,
      participants: [user?.id || "currentUser", contactId],
      startTime: new Date().toISOString(),
      status: "connecting",
    };

    setCurrentCall(newCall);
    
    // Simulate connecting
    setTimeout(() => {
      if (newCall.id === currentCall?.id) {
        setCurrentCall((prev) => 
          prev ? { ...prev, status: "connected" } : null
        );
        
        toast({
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} call started`,
          description: "You are now connected",
        });
      }
    }, 2000);
  };

  // Mock function to accept an incoming call
  const acceptCall = () => {
    if (!incomingCall) return;
    
    setCurrentCall({
      ...incomingCall,
      status: "connected",
    });
    
    setIncomingCall(null);
    
    toast({
      title: "Call accepted",
      description: "You are now connected",
    });
  };

  // Mock function to reject an incoming call
  const rejectCall = () => {
    if (!incomingCall) return;
    
    setIncomingCall((prev) => 
      prev ? { ...prev, status: "rejected" } : null
    );
    
    setTimeout(() => {
      setIncomingCall(null);
    }, 1000);
    
    toast({
      title: "Call rejected",
      description: "The call has been rejected",
    });
  };

  // Mock function to end an ongoing call
  const endCall = () => {
    if (!currentCall) return;
    
    const endTime = new Date().toISOString();
    const startTime = new Date(currentCall.startTime);
    const duration = (new Date(endTime).getTime() - startTime.getTime()) / 1000;
    
    setCurrentCall({
      ...currentCall,
      status: "ended",
      endTime,
      duration,
    });
    
    toast({
      title: "Call ended",
      description: `Call duration: ${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')}`,
    });
    
    // Clear the ended call after a brief delay
    setTimeout(() => {
      setCurrentCall(null);
    }, 5000);
  };

  // Simulate incoming calls for demo purposes
  useEffect(() => {
    if (!user) return;
    
    let incomingCallTimeout: number | null = null;
    
    const scheduleIncomingCall = () => {
      // Random delay between 30-90 seconds for demo purposes
      const delay = Math.random() * 60000 + 30000;
      
      incomingCallTimeout = window.setTimeout(() => {
        // Only create incoming call if no other call is active
        if (!currentCall && !incomingCall) {
          const contactIds = ["1", "2", "3"];
          const randomContactId = contactIds[Math.floor(Math.random() * contactIds.length)];
          const callType: "voice" | "video" = Math.random() > 0.5 ? "voice" : "video";
          
          const newIncomingCall: CallSession = {
            id: `call-${Date.now()}`,
            type: callType,
            participants: [randomContactId, user.id || "currentUser"],
            startTime: new Date().toISOString(),
            status: "connecting",
          };
          
          setIncomingCall(newIncomingCall);
          playIncomingCallSound();
          
          // Auto-reject if not answered within 30 seconds
          setTimeout(() => {
            setIncomingCall((prev) => 
              prev && prev.id === newIncomingCall.id && prev.status === "connecting"
                ? null
                : prev
            );
          }, 30000);
        }
        
        // Schedule the next incoming call
        scheduleIncomingCall();
      }, delay);
    };
    
    // Start the cycle of incoming calls
    scheduleIncomingCall();
    
    // Cleanup
    return () => {
      if (incomingCallTimeout) {
        clearTimeout(incomingCallTimeout);
      }
    };
  }, [user, currentCall, incomingCall]);

  const value: CallContextType = {
    currentCall,
    incomingCall,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    isCallInProgress,
  };

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  );
};
