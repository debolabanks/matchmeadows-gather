
import { CallSession } from "@/types/message";
import { LocalTrack, Room } from "twilio-video";

export type CallType = "video" | "voice";

export interface CallActionsInterface {
  startCall: (contactId: string, contactName: string, contactImage: string, type: CallType) => void;
  endCall: () => void;
  acceptIncomingCall: () => void;
  rejectIncomingCall: () => void;
  simulateIncomingCall: (fromId: string, fromName: string, fromImage: string, type: CallType) => void;
}

export interface UseCallReturn extends CallActionsInterface {
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
}
