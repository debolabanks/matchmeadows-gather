
import { useToast } from "@/hooks/use-toast";
import { VideoCallState, VideoCallActions } from "./videoCallTypes";

export const useVideoCallActions = (
  state: VideoCallState,
  updateState: (partialState: Partial<VideoCallState>) => void,
  timerRef: React.MutableRefObject<number | null>,
  localTracks: any[],
  onEnd: () => void,
  onAccept?: () => void,
  onReject?: () => void
): VideoCallActions => {
  const { toast } = useToast();

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
    if (!document || !document.exitFullscreen) return;

    updateState({ isFullscreen: !state.isFullscreen });
    if (!state.isFullscreen) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return {
    endCall,
    acceptCall,
    rejectCall,
    toggleMute,
    toggleVideo,
    toggleSpeaker,
    toggleFullscreen
  };
};
