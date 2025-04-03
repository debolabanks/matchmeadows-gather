
import { analyzeUserActivity } from './analysisUtils';
import { generatePersonalizedInsights } from './compatibilityUtils';
import { AppActivity, UserActivityProfile } from './types';

// Re-export types and functions that are used externally
export type { AppActivity, UserActivityProfile };
export { analyzeUserActivity, generatePersonalizedInsights };

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
