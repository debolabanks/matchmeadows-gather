
import { useState, useEffect } from "react";
import { getAIMatchRecommendations } from "@/utils/matchingAlgorithm";
import { Match } from "@/components/MatchesList";
import { getDefaultMatchScore } from "@/utils/gamification";

interface MatchRecommendationsProps {
  userProfile: any;
  existingMatches: Match[];
}

export const useMatchRecommendations = ({ userProfile, existingMatches }: MatchRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  
  useEffect(() => {
    const baseRecommendations = getAIMatchRecommendations(
      userProfile,
      [...existingMatches, ...additionalProfiles]
    );
    
    setRecommendations(baseRecommendations);
  }, [userProfile, existingMatches]);
  
  const aiRecommendations = recommendations
    .filter(profile => !existingMatches.some(match => match.id === profile.id))
    .map(profile => ({
      id: profile.id,
      name: profile.name,
      imageUrl: profile.imageUrl,
      lastActive: profile.lastActive,
      matchDate: "AI Recommendation",
      hasUnreadMessage: false,
      compatibilityPercentage: profile.aiCompatibility.score,
      aiCompatibility: profile.aiCompatibility,
      score: profile.score || getDefaultMatchScore()
    }));

  return {
    recommendations,
    aiRecommendations
  };
};

// Additional sample profiles for recommendation purposes
export const additionalProfiles = [
  {
    id: "7",
    name: "Maya",
    age: 29,
    gender: "female",
    location: "Oakland, CA",
    interests: ["Hiking", "Yoga", "Coffee", "Art", "Photography"],
    coordinates: {
      latitude: 37.8044,
      longitude: -122.2711
    },
    imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    lastActive: "3 hours ago",
    matchDate: "Just now",
    hasUnreadMessage: false,
    score: {
      ...getDefaultMatchScore(),
      level: 2,
      points: 180,
      streak: 1,
      badges: []
    }
  },
  {
    id: "8",
    name: "Lily",
    age: 27,
    gender: "female",
    location: "San Jose, CA",
    interests: ["Reading", "Travel", "Music", "Cinema"],
    coordinates: {
      latitude: 37.3382,
      longitude: -121.8863
    },
    imageUrl: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    lastActive: "1 day ago",
    matchDate: "Just now",
    hasUnreadMessage: false,
    score: {
      ...getDefaultMatchScore(),
      level: 1,
      points: 95,
      streak: 0,
      badges: []
    }
  }
];
