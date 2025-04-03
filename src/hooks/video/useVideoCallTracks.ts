
import { useEffect } from "react";
import { useCallContext } from "@/contexts/CallContext";
import { attachTrackToElement } from "@/services/twilio";
import { VideoCallState } from "./videoCallTypes";

export const useVideoCallTracks = (
  state: VideoCallState,
  updateState: (partialState: Partial<VideoCallState>) => void,
  localVideoRef: React.RefObject<HTMLVideoElement>,
  remoteVideoRef: React.RefObject<HTMLVideoElement>
) => {
  const { twilioRoom, localTracks } = useCallContext();

  // Handle Twilio track setup
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
    
    const handleParticipantConnected = (participant: any) => {
      updateState({ remoteParticipant: participant });
      
      participant.tracks.forEach((publication: any) => {
        if (publication.isSubscribed) {
          handleTrackSubscribed(publication.track);
        }
      });
      
      participant.on('trackSubscribed', handleTrackSubscribed);
    };
    
    twilioRoom.participants.forEach(handleParticipantConnected);
    twilioRoom.on('participantConnected', handleParticipantConnected);
    
    return () => {
      if (twilioRoom && typeof twilioRoom.off === 'function') {
        twilioRoom.off('participantConnected', handleParticipantConnected);
      }
      
      if (state.remoteParticipant && typeof state.remoteParticipant.removeAllListeners === 'function') {
        state.remoteParticipant.removeAllListeners();
      }
    };
  }, [twilioRoom, localTracks, localVideoRef, remoteVideoRef, updateState, state.remoteParticipant]);
};
