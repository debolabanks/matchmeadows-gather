
export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
}

export interface CallSession {
  id: string;
  type: "video" | "voice";
  participants: string[];
  startTime: string;
  endTime?: string;
  duration?: number;
  status: "connecting" | "connected" | "ended" | "rejected";
}

export interface ChatContact {
  id: string;
  name: string;
  imageUrl: string;
  lastActive: string;
  isOnline: boolean;
  preferredLanguage?: string;
  lastMessage?: {
    text: string;
    timestamp: string;
    isFromContact: boolean;
    read: boolean;
  };
  verificationStatus?: 'verified' | 'pending' | 'unverified';
}

export interface MessageAttachment {
  id: string;
  type: "image" | "audio" | "video" | "file";
  url: string;
  name: string;
  size?: number;
  mimeType?: string;
  previewUrl?: string;
}

export interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
  timestamp: string;
}
