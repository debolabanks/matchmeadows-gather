
import { MatchScore } from "@/utils/gamification";

export interface Match {
  id: string;
  name: string;
  imageUrl: string;
  lastActive: string;
  matchDate: string;
  hasUnreadMessage: boolean;
  score?: MatchScore;
  compatibilityPercentage?: number;
  aiCompatibility?: {
    score: number;
    insights: string[];
    commonInterests: string[];
    compatibilityReasons: string[];
    personalizedScore?: number;
    crossAppInsights?: string[];
    recommendedActivities?: string[];
  };
}
