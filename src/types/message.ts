export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
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
