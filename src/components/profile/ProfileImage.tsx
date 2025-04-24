
import { Shield, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileImageProps {
  imageUrl: string;
  name: string;
  age: number;
  isVerified?: boolean;
  distance: string;
  location: string;
  preferredLanguage?: string;
}

const ProfileImage = ({
  imageUrl,
  name,
  age,
  isVerified,
  distance,
  location,
  preferredLanguage
}: ProfileImageProps) => {
  return (
    <div className="relative h-96">
      <img 
        src={imageUrl} 
        alt={`${name}'s profile`} 
        className="h-full w-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold">{name}, {age}</h3>
          {isVerified && (
            <Shield className="h-5 w-5 text-blue-400" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm opacity-90 flex items-center">
            <Map className="h-3 w-3 mr-1" />
            {distance} away • {location}
          </p>
          {preferredLanguage && (
            <Badge variant="outline" className="text-xs border-blue-400/30 text-blue-400">
              Speaks {preferredLanguage}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileImage;
