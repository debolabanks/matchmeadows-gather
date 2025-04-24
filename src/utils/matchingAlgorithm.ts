
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
