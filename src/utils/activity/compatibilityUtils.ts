
import { UserActivityProfile } from './types';
import { analyzeUserActivity } from './analysisUtils';

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
