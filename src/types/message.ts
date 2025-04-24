
export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
  reactions?: MessageReaction[];
  attachments?: MessageAttachment[];
  isEncrypted?: boolean;
  isVoiceMessage?: boolean;
  language?: string;
  translation?: {
    text: string;
    language: string;
  };
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  timestamp: string;
}

export interface MessageAttachment {
  id: string;
  type: "image" | "file" | "audio" | "video";
  url: string;
  name: string;
  size?: number;
  previewUrl?: string;
  mimeType?: string;
}

export interface ChatContact {
  id: string;
  name: string;
  imageUrl: string;
  lastActive: string;
  isOnline?: boolean;
  preferredLanguage?: string;
  lastMessage?: {
    text: string;
    timestamp: string;
    isFromContact: boolean;
    read: boolean;
    hasAttachment?: boolean;
  };
  videoCallEnabled?: boolean;
  voiceCallEnabled?: boolean;
  verificationStatus?: "unverified" | "verified" | "pending";
  isMatched?: boolean;
}

export interface CallSession {
  id: string;
  type: "video" | "voice";
  participants: string[];
  startTime: string;
  endTime?: string;
  status: "connecting" | "connected" | "ended" | "rejected" | "missed";
  duration?: number;
}

