
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, Video } from "lucide-react";

interface ProfileImageProps {
  imageUrl: string;
  name: string;
  age: number;
  isVerified?: boolean;
  distance: string;
  location: string;
  preferredLanguage?: string;
  profileId?: string;  // Added profileId prop
}

const ProfileImage = ({
  imageUrl,
  name,
  age,
  isVerified,
  distance,
  location,
  preferredLanguage,
  profileId,
}: ProfileImageProps) => {
  return (
    <div className="relative h-72 w-full mb-4">
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      
      <div className="absolute bottom-4 left-4 text-white">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">{name}, {age}</h3>
          {isVerified && (
            <Badge variant="secondary" className="bg-primary/30 text-white border-0">
              <Check className="h-3 w-3 mr-1" /> Verified
            </Badge>
          )}
          
          {/* Live streaming indicator with link */}
          {profileId && Math.random() > 0.7 && (  // Just for demo purposes - 30% chance to show live
            <Link
              to={`/stream/${profileId}`}
              onClick={(e) => e.stopPropagation()}
              className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 hover:bg-red-600 transition-colors"
            >
              <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
              <Video className="h-3 w-3" /> 
              LIVE
            </Link>
          )}
        </div>
        
        <p className="text-sm text-gray-200 mt-1">{distance} • {location}</p>
        
        {preferredLanguage && (
          <p className="text-xs text-gray-300 mt-1">
            Speaks: {preferredLanguage}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileImage;
