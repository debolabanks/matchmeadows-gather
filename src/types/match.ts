
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
    insights?: string[];
    commonInterests?: string[];
    compatibilityReasons?: string[];
  };
  score?: number | {
    level: number;
    points: number;
    streak: number;
    badges: any[];
  }; // For backward compatibility
  compatibilityPercentage?: number; // For backward compatibility
}
