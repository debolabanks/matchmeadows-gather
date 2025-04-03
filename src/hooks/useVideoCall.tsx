
import { useState, useRef, useEffect } from "react";
import { CallSession } from "@/types/message";
import { Room, RemoteParticipant } from "twilio-video";
import { useToast } from "@/hooks/use-toast";
import { attachTrackToElement } from "@/services/twilio";
import { useCallContext } from "@/contexts/CallContext";

export interface VideoCallState {
  callStatus: CallSession["status"];
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeakerOn: boolean;
  isFullscreen: boolean;
  duration: number;
  remoteParticipant: RemoteParticipant | null;
}

interface UseVideoCallProps {
  contactId: string;
  contactName: string;
  contactImage: string;
  callType: "video" | "voice";
  isIncoming?: boolean;
  onEnd: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

export const useVideoCall = ({
  contactId,
  contactName,
  callType,
  onEnd,
  isIncoming = false,
  onAccept,
  onReject
}: UseVideoCallProps) => {
  const [state, setState] = useState<VideoCallState>({
    callStatus: isIncoming ? "connecting" : "connecting",
    isMuted: false,
    isVideoOff: callType === "voice",
    isSpeakerOn: true,
    isFullscreen: false,
    duration: 0,
    remoteParticipant: null
  });
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();
  const { twilioRoom, localTracks } = useCallContext();

  // Update component state with a partial state object
  const updateState = (partialState: Partial<VideoCallState>) => {
    setState(prevState => ({ ...prevState, ...partialState }));
  };

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

  useEffect(() => {
    if (!twilioRoom) return;
    
    updateState({ callStatus: "connected" });
    
    const localVideoTrack = localTracks.find(track => track.kind === 'video');
    if (localVideoTrack && localVideoRef.current) {
      const videoElement = localVideoRef.current;
      attachTrackToElement(localVideoTrack as any, videoElement);
    }
    
    const handleTrackSubscribed = (track: any) => {
      if (track.kind === 'video' && remoteVideoRef.current) {
        attachTrackToElement(track, remoteVideoRef.current);
      }
    };
    
    const handleParticipantConnected = (participant: RemoteParticipant) => {
      updateState({ remoteParticipant: participant });
      
      participant.tracks.forEach(publication => {
        if (publication.isSubscribed) {
          handleTrackSubscribed(publication.track);
        }
      });
      
      participant.on('trackSubscribed', handleTrackSubscribed);
    };
    
    twilioRoom.participants.forEach(handleParticipantConnected);
    twilioRoom.on('participantConnected', handleParticipantConnected);
    
    startTimer();
    
    return () => {
      if (twilioRoom && typeof twilioRoom.off === 'function') {
        twilioRoom.off('participantConnected', handleParticipantConnected);
      }
      
      if (state.remoteParticipant && typeof state.remoteParticipant.removeAllListeners === 'function') {
        state.remoteParticipant.removeAllListeners();
      }
    };
  }, [twilioRoom, localTracks]);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = window.setInterval(() => {
      setState(prev => ({ ...prev, duration: prev.duration + 1 }));
    }, 1000);
  };

  const endCall = () => {
    updateState({ callStatus: "ended" });
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onEnd();
  };

  const acceptCall = () => {
    if (onAccept) {
      onAccept();
    }
    updateState({ callStatus: "connecting" });
  };

  const rejectCall = () => {
    if (onReject) {
      onReject();
    }
    updateState({ callStatus: "rejected" });
    setTimeout(onEnd, 1000);
  };

  const toggleMute = () => {
    const audioTrack = localTracks.find(track => track.kind === 'audio');
    if (audioTrack) {
      audioTrack.enable(!state.isMuted);
    }
    updateState({ isMuted: !state.isMuted });
  };

  const toggleVideo = () => {
    const videoTrack = localTracks.find(track => track.kind === 'video');
    if (videoTrack) {
      videoTrack.enable(!state.isVideoOff);
    }
    updateState({ isVideoOff: !state.isVideoOff });
  };

  const toggleSpeaker = () => {
    updateState({ isSpeakerOn: !state.isSpeakerOn });
    
    toast({
      title: state.isSpeakerOn ? "Speaker off" : "Speaker on",
      duration: 1500,
    });
  };

  const toggleFullscreen = () => {
    if (!callContainerRef.current) return;
    
    if (!state.isFullscreen) {
      if (callContainerRef.current.requestFullscreen) {
        callContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    updateState({ isFullscreen: !state.isFullscreen });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    state,
    refs: {
      localVideoRef,
      remoteVideoRef,
      callContainerRef
    },
    actions: {
      endCall,
      acceptCall,
      rejectCall,
      toggleMute,
      toggleVideo,
      toggleSpeaker,
      toggleFullscreen
    },
    formatDuration
  };
};
