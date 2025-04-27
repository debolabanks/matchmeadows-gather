
import { UserProfileWithId } from "@/types/user";
import { ProfileCardProps } from "@/components/ProfileCard";

export const convertProfileToCardProps = (profile: UserProfileWithId): Omit<ProfileCardProps, 'onLike' | 'onDislike'> => {
  return {
    id: profile.id,
    name: profile.name || 'Anonymous',
    imageUrl: profile.photos?.[0] || '/placeholder.svg',
    age: profile.age || 25,
    distance: String(profile.distance || 5),
    location: profile.location || 'Nearby',
    bio: profile.bio || '',
    interests: profile.interests || [],
    photos: profile.photos || [],
    boosted: profile.boosted || false,
    boostExpiry: profile.boostExpiry || null,
    compatibility: profile.compatibility || Math.floor(Math.random() * 100)
  };
};
