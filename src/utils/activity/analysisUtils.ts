
import { AppActivity, UserActivityProfile } from './types';
import { getUserCrossAppActivity } from './mockData';

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
