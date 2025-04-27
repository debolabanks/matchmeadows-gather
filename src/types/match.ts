
export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  name: string;
  imageUrl: string;
  lastActive: string;
  matchDate: string;
  hasUnread?: boolean;
  hasUnreadMessage?: boolean;
  compatibilityScore: number;
  aiCompatibility?: {
    score: number;
    strengths?: string[];
    weaknesses?: string[];
    suggestion?: string;
  };
  score?: number; // For backward compatibility
}
