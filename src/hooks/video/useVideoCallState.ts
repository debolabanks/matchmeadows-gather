
import { useState, useEffect, useRef } from "react";
import { VideoCallState, UseVideoCallProps } from "./videoCallTypes";
import { initializeVideoCallState } from "./videoCallUtils";

export const useVideoCallState = ({ 
  callType, 
  isIncoming = false
}: Pick<UseVideoCallProps, "callType" | "isIncoming">) => {
  // Initialize state
  const [state, setState] = useState<VideoCallState>(
    initializeVideoCallState(callType, isIncoming)
  );
  
  // Create refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // Update component state with a partial state object
  const updateState = (partialState: Partial<VideoCallState>) => {
    setState(prevState => ({ ...prevState, ...partialState }));
  };

  // Handle timer initialization
  useEffect(() => {
    if (isIncoming && state.callStatus === "connecting") {
      return;
    }
    
    updateState({ callStatus: "connecting" });
    
    if (state.callStatus === "connected") {
      startTimer();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.callStatus, isIncoming]);

  // Start the call duration timer
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = window.setInterval(() => {
      setState(prev => ({ ...prev, duration: prev.duration + 1 }));
    }, 1000);
  };

  return {
    state,
    updateState,
    refs: {
      localVideoRef,
      remoteVideoRef,
      callContainerRef
    },
    timerRef,
    startTimer
  };
};
