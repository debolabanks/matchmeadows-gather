
// Activity tracking utility functions

// Types for cross-app activity data
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

// Mock data for simulating cross-app activity
const mockCrossAppActivities: AppActivity[] = [
  {
    appName: "FoodieApp",
    category: "Food",
    activityType: "search",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    keywords: ["Italian restaurant", "Pizza", "Pasta"],
    interests: ["Italian cuisine", "Dining out"]
  },
  {
    appName: "TripPlanner",
    category: "Travel",
    activityType: "interaction",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    duration: 15,
    keywords: ["Beach vacation", "Hotels"],
    interests: ["Beach", "Travel", "Vacation"]
  },
  {
    appName: "FitTrack",
    category: "Fitness",
    activityType: "visit",
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    duration: 25,
    interests: ["Running", "Fitness", "Outdoor activities"]
  },
  {
    appName: "BookCorner",
    category: "Reading",
    activityType: "purchase",
    timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    keywords: ["Fiction", "Mystery novel"],
    interests: ["Reading", "Fiction", "Mystery"]
  },
  {
    appName: "MusicStream",
    category: "Music",
    activityType: "interaction",
    timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    duration: 45,
    keywords: ["Rock playlist", "Live concerts"],
    interests: ["Music", "Rock", "Concerts"]
  }
];

/**
 * Get activity data for the current user
 * In a real implementation, this would retrieve actual cross-app activity data
 */
export const getUserCrossAppActivity = (): AppActivity[] => {
  // In a real implementation, this would fetch from an API or database
  return [...mockCrossAppActivities];
};

/**
 * Analyze user activity to create a profile of interests and behaviors
 */
export const analyzeUserActivity = (): UserActivityProfile => {
  const activities = getUserCrossAppActivity();
  
  // Extract all interests from activities
  const allInterests = activities.flatMap(activity => activity.interests || []);
  
  // Count occurrences of each interest
  const interestCounts: Record<string, number> = {};
  allInterests.forEach(interest => {
    interestCounts[interest] = (interestCounts[interest] || 0) + 1;
  });
  
  // Sort interests by count
  const topInterests = Object.entries(interestCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([interest]) => interest)
    .slice(0, 5);
  
  // Extract recent searches
  const recentSearches = activities
    .filter(activity => activity.activityType === 'search')
    .flatMap(activity => activity.keywords || [])
    .slice(0, 5);
  
  // Count categories
  const categoryCount: Record<string, number> = {};
  activities.forEach(activity => {
    categoryCount[activity.category] = (categoryCount[activity.category] || 0) + 1;
  });
  
  // Sort categories by count
  const frequentCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category)
    .slice(0, 3);
  
  // Calculate average session duration
  const durationsWithValues = activities
    .filter(activity => activity.duration !== undefined)
    .map(activity => activity.duration as number);
  
  const averageSessionDuration = durationsWithValues.length > 0 
    ? durationsWithValues.reduce((sum, duration) => sum + duration, 0) / durationsWithValues.length
    : 0;
  
  // Create cross-app preferences mapping
  const crossAppPreferences: Record<string, number> = {};
  activities.forEach(activity => {
    (activity.interests || []).forEach(interest => {
      // Weigh more recent activities higher
      const daysAgo = (Date.now() - new Date(activity.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      const weight = Math.max(1, 5 - daysAgo); // Higher weight for more recent activities
      
      crossAppPreferences[interest] = (crossAppPreferences[interest] || 0) + weight;
    });
  });
  
  return {
    topInterests,
    recentSearches,
    frequentCategories,
    activityPatterns: {
      activeHours: [9, 12, 18, 21], // Mock active hours
      activeDays: ['Monday', 'Wednesday', 'Friday', 'Sunday'], // Mock active days
      averageSessionDuration
    },
    crossAppPreferences
  };
};

/**
 * Find compatible interests between a user and a potential match
 */
export const findCompatibleInterests = (
  userProfile: UserActivityProfile,
  matchInterests: string[]
): string[] => {
  // Get all interests from the user profile
  const userInterests = new Set([
    ...userProfile.topInterests,
    ...Object.keys(userProfile.crossAppPreferences)
  ]);
  
  // Find overlap with match interests
  return matchInterests.filter(interest => userInterests.has(interest));
};

/**
 * Generate personalized compatibility insights based on cross-app activity
 */
export const generatePersonalizedInsights = (
  userProfile: UserActivityProfile,
  matchProfile: any
): {
  personalizedScore: number;
  insights: string[];
  recommendedActivities: string[];
} => {
  const compatibleInterests = findCompatibleInterests(
    userProfile, 
    matchProfile.interests || []
  );
  
  // Calculate a personalized compatibility score
  let personalizedScore = Math.min(100, 50 + compatibleInterests.length * 10);
  
  // Generate insights based on compatible interests
  const insights: string[] = [];
  
  if (compatibleInterests.length > 0) {
    insights.push(`You both share interests in ${compatibleInterests.slice(0, 2).join(' and ')}`);
  }
  
  // Check for activity pattern compatibility
  const userActiveHours = new Set(userProfile.activityPatterns.activeHours);
  const matchActiveHours = [8, 12, 19, 22]; // Mock data for the match
  
  const commonActiveHours = matchActiveHours.filter(hour => userActiveHours.has(hour));
  
  if (commonActiveHours.length > 0) {
    insights.push("You're both active online at similar times");
    personalizedScore += 5;
  }
  
  // Check for category preferences
  const matchCategories = ['Food', 'Travel', 'Music']; // Mock data for the match
  const commonCategories = userProfile.frequentCategories.filter(
    category => matchCategories.includes(category)
  );
  
  if (commonCategories.length > 0) {
    insights.push(`You both enjoy ${commonCategories[0]} activities`);
    personalizedScore += 5;
  }
  
  // Generate recommended activities based on shared interests
  const recommendedActivities = compatibleInterests.map(interest => {
    switch(interest) {
      case "Italian cuisine":
        return "Try an Italian cooking class together";
      case "Beach":
      case "Travel":
        return "Plan a weekend beach getaway";
      case "Running":
      case "Fitness":
        return "Go for a morning run in the park";
      case "Music":
      case "Concerts":
        return "Attend a live music event";
      case "Reading":
        return "Visit a bookstore or reading cafe";
      default:
        return `Explore your shared interest in ${interest}`;
    }
  });
  
  return {
    personalizedScore: Math.min(100, personalizedScore),
    insights: insights.slice(0, 3),
    recommendedActivities: [...new Set(recommendedActivities)].slice(0, 3)
  };
};

/**
 * Enhance match profiles with personalized insights
 */
export const enhanceMatchesWithPersonalization = (matches: any[]) => {
  const userProfile = analyzeUserActivity();
  
  return matches.map(match => {
    const { personalizedScore, insights, recommendedActivities } = generatePersonalizedInsights(
      userProfile,
      match
    );
    
    // Enhance the AI compatibility with cross-app insights
    const enhancedAiCompatibility = match.aiCompatibility 
      ? {
          ...match.aiCompatibility,
          personalizedScore,
          crossAppInsights: insights,
          recommendedActivities
        }
      : {
          score: personalizedScore,
          insights: [],
          commonInterests: [],
          compatibilityReasons: [],
          personalizedScore,
          crossAppInsights: insights,
          recommendedActivities
        };
    
    return {
      ...match,
      aiCompatibility: enhancedAiCompatibility
    };
  });
};
