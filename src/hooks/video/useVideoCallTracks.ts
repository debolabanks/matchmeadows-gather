
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

  // Handle local tracks setup
  useEffect(() => {
    // Attach local video track to local video element
    const localVideoTrack = localTracks.find(track => track.kind === 'video');
    if (localVideoTrack && localVideoRef.current) {
      const videoElement = localVideoRef.current;
      try {
        // Detach any existing tracks first
        if (videoElement.childNodes.length > 0) {
          Array.from(videoElement.childNodes).forEach(node => node.remove());
        }
        
        attachTrackToElement(localVideoTrack as any, videoElement);
        console.log("Local video track attached successfully");
      } catch (error) {
        console.error("Error attaching local video track:", error);
      }
    } else if (!localVideoTrack) {
      console.log("No local video track found to attach");
    } else if (!localVideoRef.current) {
      console.log("Local video ref is not available");
    }
  }, [localTracks, localVideoRef]);

  // Handle Twilio track setup
  useEffect(() => {
    if (!twilioRoom) return;
    
    updateState({ callStatus: "connected" });
    
    const handleTrackSubscribed = (track: any) => {
      if (track.kind === 'video' && remoteVideoRef.current) {
        // Detach any existing tracks first
        if (remoteVideoRef.current.childNodes.length > 0) {
          Array.from(remoteVideoRef.current.childNodes).forEach(node => node.remove());
        }
        
        attachTrackToElement(track, remoteVideoRef.current);
        console.log("Remote video track attached successfully");
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
  }, [twilioRoom, remoteVideoRef, updateState, state.remoteParticipant]);
};
