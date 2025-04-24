
import { CallSession } from "@/types/message";
import { RemoteParticipant } from "twilio-video";

export interface VideoCallState {
  callStatus: CallSession["status"];
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeakerOn: boolean;
  isFullscreen: boolean;
  duration: number;
  remoteParticipant: RemoteParticipant | null;
}

export interface UseVideoCallProps {
  contactId: string;
  contactName: string;
  contactImage: string;
  callType: "video" | "voice";
  isIncoming?: boolean;
  onEnd: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

export interface VideoCallRefs {
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  callContainerRef: React.RefObject<HTMLDivElement>;
}

export interface VideoCallActions {
  endCall: () => void;
  acceptCall: () => void;
  rejectCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleSpeaker: () => void;
  toggleFullscreen: () => void;
}
