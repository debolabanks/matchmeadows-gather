
import { useState } from "react";
import { CallSession } from "@/types/message";
import { LocalTrack, Room } from "twilio-video";
import { CallType } from "./callTypes";

interface UseCallStateReturn {
  activeCall: CallSession | null;
  incomingCall: {
    from: {
      id: string;
      name: string;
      imageUrl: string;
    };
    type: CallType;
  } | null;
  twilioRoom: Room | null;
  localTracks: LocalTrack[];
  timerRef: React.MutableRefObject<number | null>;
  setActiveCall: React.Dispatch<React.SetStateAction<CallSession | null>>;
  setIncomingCall: React.Dispatch<React.SetStateAction<UseCallStateReturn["incomingCall"]>>;
  setTwilioRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  setLocalTracks: React.Dispatch<React.SetStateAction<LocalTrack[]>>;
}

/**
 * Hook to manage call state
 */
export const useCallState = (): UseCallStateReturn => {
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [incomingCall, setIncomingCall] = useState<UseCallStateReturn["incomingCall"]>(null);
  const [twilioRoom, setTwilioRoom] = useState<Room | null>(null);
  const [localTracks, setLocalTracks] = useState<LocalTrack[]>([]);
  
  // Use ref to store timer ID
  const timerRef = { current: null as number | null };

  return {
    activeCall,
    incomingCall,
    twilioRoom,
    localTracks,
    timerRef,
    setActiveCall,
    setIncomingCall,
    setTwilioRoom,
    setLocalTracks
  };
};
