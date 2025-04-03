
import { useCallContext } from "@/contexts/CallContext";
import { UseVideoCallProps } from "./videoCallTypes";
import { useVideoCallState } from "./useVideoCallState";
import { useVideoCallTracks } from "./useVideoCallTracks";
import { useVideoCallActions } from "./useVideoCallActions";
import { formatDuration } from "./videoCallUtils";

export const useVideoCall = ({
  contactId,
  contactName,
  contactImage,
  callType,
  onEnd,
  isIncoming = false,
  onAccept,
  onReject
}: UseVideoCallProps) => {
  // Get context data
  const { localTracks } = useCallContext();
  
  // Initialize state and refs
  const { 
    state, 
    updateState, 
    refs, 
    timerRef, 
    startTimer 
  } = useVideoCallState({ callType, isIncoming });

  // Set up track handling
  useVideoCallTracks(
    state,
    updateState,
    refs.localVideoRef,
    refs.remoteVideoRef
  );

  // Initialize call actions
  const actions = useVideoCallActions(
    state,
    updateState,
    timerRef,
    localTracks,
    onEnd,
    onAccept,
    onReject
  );

  return {
    state,
    refs,
    actions,
    formatDuration
  };
};
