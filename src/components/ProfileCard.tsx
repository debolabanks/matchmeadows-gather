
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export interface ProfileCardProps {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  imageUrl: string;
  distance: string;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
}

const ProfileCard = ({
  id,
  name,
  age,
  location,
  bio,
  interests,
  imageUrl,
  distance,
  onLike,
  onDislike
}: ProfileCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div 
      className="profile-card animate-fade-in"
      onClick={toggleDetails}
    >
      <div className="relative h-96">
        <img 
          src={imageUrl} 
          alt={`${name}'s profile`} 
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
          <h3 className="text-2xl font-bold">{name}, {age}</h3>
          <p className="text-sm opacity-90">{distance} away • {location}</p>
        </div>
      </div>
      
      {showDetails && (
        <div className="p-4 animate-slide-up">
          <div className="mb-4">
            <h4 className="font-semibold text-lg mb-2">About</h4>
            <p className="text-muted-foreground">{bio}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-2">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="px-3 py-1">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-center gap-4 p-4 border-t">
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onDislike(id);
          }}
          variant="outline" 
          size="icon" 
          className="swipe-button bg-white hover:bg-red-50"
        >
          <X className="h-6 w-6 text-red-500" />
        </Button>
        
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onLike(id);
          }}
          variant="outline" 
          size="icon" 
          className="swipe-button bg-white hover:bg-love-50"
        >
          <Heart className="h-6 w-6 text-love-500" />
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
