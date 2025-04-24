
import { useRef } from "react";
import { UseCallReturn } from "./call/callTypes";
import { useCallState } from "./call/useCallState";
import { useCallActions } from "./call/useCallActions";

/**
 * Hook to manage call functionality
 */
export const useCall = (): UseCallReturn => {
  const {
    activeCall,
    incomingCall,
    twilioRoom,
    localTracks,
    timerRef,
    setActiveCall,
    setIncomingCall,
    setTwilioRoom,
    setLocalTracks
  } = useCallState();

  const {
    startCall,
    endCall,
    acceptIncomingCall,
    rejectIncomingCall,
    simulateIncomingCall
  } = useCallActions({
    activeCall,
    twilioRoom,
    localTracks,
    incomingCall,
    timerRef,
    setActiveCall,
    setIncomingCall,
    setTwilioRoom,
    setLocalTracks
  });

  return {
    activeCall,
    incomingCall,
    twilioRoom,
    localTracks,
    startCall,
    endCall,
    acceptIncomingCall,
    rejectIncomingCall,
    simulateIncomingCall,
  };
};
