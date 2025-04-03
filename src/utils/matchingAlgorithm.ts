// Matching algorithm utility functions

export type MatchCriteria = {
  minAge?: number;
  maxAge?: number;
  gender?: "male" | "female" | "non-binary" | "any";
  maxDistance?: number;
  interests?: string[];
};

export const filterProfilesByPreferences = (
  profiles: any[], 
  preferences: MatchCriteria,
  userLocation?: { latitude: number; longitude: number }
) => {
  return profiles.filter(profile => {
    // Age filter
    if (preferences.minAge && profile.age < preferences.minAge) return false;
    if (preferences.maxAge && profile.age > preferences.maxAge) return false;
    
    // Gender filter
    if (preferences.gender && preferences.gender !== "any" && profile.gender !== preferences.gender) return false;
    
    // Distance filter
    if (preferences.maxDistance && userLocation && profile.coordinates) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        profile.coordinates.latitude,
        profile.coordinates.longitude
      );
      
      if (distance > preferences.maxDistance) return false;
    }
    
    // Interest matching (optional enhancement)
    if (preferences.interests && preferences.interests.length > 0) {
      // If they share at least one interest, it's a potential match
      const hasCommonInterest = profile.interests?.some((interest: string) => 
        preferences.interests?.includes(interest)
      );
      if (!hasCommonInterest) return false;
    }
    
    return true;
  });
};

// Calculate distance between two points using the Haversine formula
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

const toRad = (value: number): number => {
  return value * Math.PI / 180;
};

// Enhanced matching algorithm that considers compatibility factors
export const rankProfilesByCompatibility = (profiles: any[], userInterests: string[]) => {
  return profiles.map(profile => {
    let compatibilityScore = 0;
    
    // Calculate score based on shared interests
    if (profile.interests && userInterests) {
      const sharedInterests = profile.interests.filter((interest: string) => 
        userInterests.includes(interest)
      );
      compatibilityScore += sharedInterests.length * 10; // 10 points per shared interest
    }
    
    // Add more compatibility factors here as needed
    
    return {
      ...profile,
      compatibilityScore
    };
  }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);
};

// AI-enhanced compatibility calculation that provides deeper insights
export const calculateAICompatibility = (
  userProfile: any,
  targetProfile: any
): { 
  score: number; 
  insights: string[];
  commonInterests: string[];
  compatibilityReasons: string[];
} => {
  let score = 0;
  const insights: string[] = [];
  const compatibilityReasons: string[] = [];
  
  // Calculate base compatibility score from interests
  const userInterests = userProfile.interests || [];
  const targetInterests = targetProfile.interests || [];
  
  const commonInterests = userInterests.filter((interest: string) => 
    targetInterests.includes(interest)
  );
  
  // Interest compatibility (up to 50 points)
  const interestScore = Math.min(commonInterests.length * 10, 50);
  score += interestScore;
  
  if (commonInterests.length > 0) {
    insights.push(`You share ${commonInterests.length} interests`);
    compatibilityReasons.push(`Common interests: ${commonInterests.join(', ')}`);
  }
  
  // Location proximity (up to 20 points)
  if (userProfile.coordinates && targetProfile.coordinates) {
    const distance = calculateDistance(
      userProfile.coordinates.latitude,
      userProfile.coordinates.longitude,
      targetProfile.coordinates.latitude,
      targetProfile.coordinates.longitude
    );
    
    // Closer = better score (max 20 points for being very close)
    const proximityScore = Math.max(0, 20 - Math.floor(distance / 5));
    score += proximityScore;
    
    if (proximityScore > 15) {
      insights.push("You're very close to each other");
      compatibilityReasons.push("Close proximity");
    }
  }
  
  // Age compatibility (up to 15 points)
  if (userProfile.age && targetProfile.age) {
    const ageDifference = Math.abs(userProfile.age - targetProfile.age);
    // Less difference = better score (max 15 points)
    const ageScore = Math.max(0, 15 - ageDifference);
    score += ageScore;
    
    if (ageScore > 10) {
      insights.push("You're close in age");
      compatibilityReasons.push("Similar age group");
    }
  }
  
  // Communication style and activity patterns (simulated AI analysis)
  // In a real app, this would use actual message data and activity patterns
  const activityScore = Math.floor(Math.random() * 15); // Random score up to 15 points
  score += activityScore;
  
  if (activityScore > 10) {
    insights.push("Similar communication patterns");
    compatibilityReasons.push("Compatible communication styles");
  }
  
  return {
    score: Math.min(100, score), // Cap at 100%
    insights: insights.slice(0, 3), // Top 3 insights
    commonInterests,
    compatibilityReasons: compatibilityReasons.slice(0, 3) // Top 3 reasons
  };
};

// Get AI-powered match recommendations based on compatibility
export const getAIMatchRecommendations = (
  userProfile: any,
  profiles: any[]
): any[] => {
  return profiles.map(profile => {
    const compatibility = calculateAICompatibility(userProfile, profile);
    return {
      ...profile,
      aiCompatibility: compatibility
    };
  }).sort((a, b) => b.aiCompatibility.score - a.aiCompatibility.score);
};
