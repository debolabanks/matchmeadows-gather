
// Gamification utility functions for match interactions

export type MatchScore = {
  level: number;
  points: number;
  streak: number;
  badges: MatchBadge[];
};

export type MatchBadge = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export const calculateMatchLevel = (points: number): number => {
  if (points < 100) return 1;
  if (points < 300) return 2;
  if (points < 600) return 3;
  if (points < 1000) return 4;
  if (points < 1500) return 5;
  return Math.floor(points / 300) + 1;
};

export const getDefaultMatchScore = (): MatchScore => {
  return {
    level: 1,
    points: 0,
    streak: 0,
    badges: []
  };
};

// Points awarded for different actions
export const POINTS_CONFIG = {
  SEND_MESSAGE: 5,
  REPLY_QUICKLY: 10, // Reply within 1 hour
  DAILY_CONVERSATION: 15,
  VIDEO_CALL: 30,
  SHARE_PHOTO: 10,
  STREAK_BONUS: 5, // Additional points per day of streak
};

// Calculate badges based on interactions
export const calculateBadges = (
  messageCount: number,
  responseRate: number,
  callCount: number,
  daysMatched: number
): MatchBadge[] => {
  const badges: MatchBadge[] = [];
  
  if (messageCount >= 50) {
    badges.push({
      id: 'chat-50',
      name: 'Chatty',
      description: 'Exchanged 50+ messages',
      icon: '💬'
    });
  }
  
  if (responseRate >= 0.9) {
    badges.push({
      id: 'responsive',
      name: 'Responsive',
      description: 'Responds to 90% of messages',
      icon: '⚡'
    });
  }
  
  if (callCount >= 5) {
    badges.push({
      id: 'video-star',
      name: 'Video Star',
      description: 'Had 5+ video calls',
      icon: '📹'
    });
  }
  
  if (daysMatched >= 30) {
    badges.push({
      id: 'committed',
      name: 'Committed',
      description: 'Matched for 30+ days',
      icon: '🤝'
    });
  }
  
  return badges;
};

// Calculate compatibility score based on factors
export const calculateCompatibilityScore = (
  sharedInterests: number,
  messageFrequency: number,
  callDuration: number
): number => {
  const interestScore = Math.min(sharedInterests * 10, 50);
  const messageScore = Math.min(messageFrequency * 5, 30);
  const callScore = Math.min(callDuration / 10, 20);
  
  return interestScore + messageScore + callScore;
};
