
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import ProfileCardActions from "./ProfileCardActions";
import ProfileImage from "./profile/ProfileImage";
import ProfileDetails from "./profile/ProfileDetails";
import ProfileActions from "./profile/ProfileActions";

export interface ProfileCardProps {
  id: string;
  name: string;
  age: number;
  gender?: "male" | "female" | "non-binary" | "prefer-not-to-say";
  location: string;
  bio: string;
  interests: string[];
  imageUrl: string;
  distance: string;
  coordinates?: { latitude: number; longitude: number };
  isVerified?: boolean;
  preferredLanguage?: string;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
}

const ProfileCard = ({
  id,
  name,
  age,
  gender,
  location,
  bio,
  interests,
  imageUrl,
  distance,
  isVerified,
  preferredLanguage,
  onLike,
  onDislike
}: ProfileCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const { user } = useAuth();
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleBlockUser = () => {
    setIsBlocked(true);
    toast({
      title: "User Blocked",
      description: `You have blocked ${name}. They will no longer be able to contact you.`,
    });
    // In a real implementation, this would call an API to block the user
    onDislike(id); // Dislike the user to remove from current stack
  };

  if (isBlocked) {
    return null; // Don't render blocked profiles
  }

  return (
    <div 
      className="profile-card animate-fade-in rounded-lg overflow-hidden shadow-lg border border-border relative"
      onClick={toggleDetails}
    >
      <ProfileCardActions profileId={id} profileName={name} />
      
      <ProfileImage 
        imageUrl={imageUrl}
        name={name}
        age={age}
        isVerified={isVerified}
        distance={distance}
        location={location}
        preferredLanguage={preferredLanguage}
      />
      
      <ProfileDetails 
        bio={bio}
        interests={interests}
        showDetails={showDetails}
      />
      
      <ProfileActions 
        id={id}
        name={name}
        onLike={onLike}
        onDislike={onDislike}
        onBlock={handleBlockUser}
      />
    </div>
  );
};

export default ProfileCard;
