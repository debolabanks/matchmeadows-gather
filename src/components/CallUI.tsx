
import React, { useEffect, useState } from "react";
import { useCall } from "@/contexts/CallContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { stopIncomingCallSound } from "@/services/soundService";
import MobileCallUI from "./call/MobileCallUI";
import DesktopCallUI from "./call/DesktopCallUI";

interface CallUIProps {
  contactName?: string;
  contactImage?: string;
}

const CallUI: React.FC<CallUIProps> = ({ contactName = "User", contactImage }) => {
  const { currentCall, incomingCall, acceptCall, rejectCall, endCall } = useCall();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [localMuted, setLocalMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimerId, setCallTimerId] = useState<number | null>(null);
  
  const isIncomingCall = Boolean(incomingCall);
  const isOngoingCall = Boolean(currentCall && currentCall.status === "connected");
  const isConnectingCall = Boolean(currentCall && currentCall.status === "connecting");
  const callType = currentCall?.type || incomingCall?.type || "voice";
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleAcceptCall = () => {
    stopIncomingCallSound();
    acceptCall();
  };
  
  const handleRejectCall = () => {
    stopIncomingCallSound();
    rejectCall();
  };
  
  const handleEndCall = () => {
    if (callTimerId) {
      clearInterval(callTimerId);
      setCallTimerId(null);
    }
    endCall();
  };
  
  const toggleMute = () => {
    setLocalMuted(!localMuted);
    toast({
      title: !localMuted ? "Microphone muted" : "Microphone unmuted",
      variant: "default",
    });
  };
  
  const toggleCamera = () => {
    setCameraOff(!cameraOff);
    toast({
      title: !cameraOff ? "Camera turned off" : "Camera turned on",
      variant: "default",
    });
  };
  
  useEffect(() => {
    if (isOngoingCall && !callTimerId) {
      const timerId = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      setCallTimerId(Number(timerId));
      
      return () => {
        clearInterval(timerId);
        setCallTimerId(null);
      };
    }
    
    if (!isOngoingCall && callTimerId) {
      clearInterval(callTimerId);
      setCallTimerId(null);
      setCallDuration(0);
    }
  }, [isOngoingCall, callTimerId]);
  
  useEffect(() => {
    return () => {
      stopIncomingCallSound();
    };
  }, []);
  
  useEffect(() => {
    if (isIncomingCall) {
      return () => {
        stopIncomingCallSound();
      };
    }
  }, [isIncomingCall]);

  const callProps = {
    incomingCall,
    currentCall,
    isConnectingCall,
    isOngoingCall,
    isIncomingCall,
    callType,
    callDuration,
    contactName,
    contactImage,
    localMuted,
    cameraOff,
    formatDuration,
    handleAcceptCall,
    handleRejectCall,
    handleEndCall,
    toggleMute,
    toggleCamera,
  };

  return isMobile ? (
    <MobileCallUI {...callProps} />
  ) : (
    <DesktopCallUI {...callProps} />
  );
};

export default CallUI;
