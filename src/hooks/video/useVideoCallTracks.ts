
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
      console.log("Participant connected:", participant);
      updateState({ remoteParticipant: participant });
      
      // Check if participant.tracks exists and is iterable (Map or Array)
      if (participant.tracks && typeof participant.tracks.forEach === 'function') {
        participant.tracks.forEach((publication: any) => {
          if (publication.isSubscribed) {
            handleTrackSubscribed(publication.track);
          }
        });
      }
      
      // Only attach event listener if participant has .on method
      if (participant && typeof participant.on === 'function') {
        participant.on('trackSubscribed', handleTrackSubscribed);
      }
    };
    
    // Handle existing participants
    if (twilioRoom.participants && typeof twilioRoom.participants.forEach === 'function') {
      twilioRoom.participants.forEach(handleParticipantConnected);
    }
    
    // Listen for new participants
    if (typeof twilioRoom.on === 'function') {
      twilioRoom.on('participantConnected', handleParticipantConnected);
    }
    
    return () => {
      // Clean up event listeners safely
      if (twilioRoom && typeof twilioRoom.off === 'function') {
        twilioRoom.off('participantConnected', handleParticipantConnected);
      }
      
      if (state.remoteParticipant) {
        // Only call removeAllListeners if it exists
        if (typeof state.remoteParticipant.removeAllListeners === 'function') {
          state.remoteParticipant.removeAllListeners();
        } else if (typeof state.remoteParticipant.off === 'function') {
          // Fallback to .off if it exists
          state.remoteParticipant.off('trackSubscribed', handleTrackSubscribed);
        }
      }
    };
  }, [twilioRoom, localTracks, localVideoRef, remoteVideoRef, updateState, state.remoteParticipant]);
};
