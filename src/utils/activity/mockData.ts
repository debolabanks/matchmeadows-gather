
import { AppActivity } from './types';

// Mock data for simulating cross-app activity
export const mockCrossAppActivities: AppActivity[] = [
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
