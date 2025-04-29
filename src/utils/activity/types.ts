
// Activity tracking types

export type AppActivity = {
  appName: string;
  category: string;
  activityType: 'visit' | 'purchase' | 'interaction' | 'search';
  timestamp: string;
  duration?: number;
  keywords?: string[];
  interests?: string[];
};

export type UserActivityProfile = {
  topInterests: string[];
  recentSearches: string[];
  frequentCategories: string[];
  activityPatterns: {
    activeHours: number[];
    activeDays: string[];
    averageSessionDuration: number;
  };
  crossAppPreferences: Record<string, number>; // Interest category to strength mapping
};
