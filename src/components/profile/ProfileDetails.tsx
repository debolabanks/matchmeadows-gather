
import { Badge } from "@/components/ui/badge";

interface ProfileDetailsProps {
  bio: string;
  interests: string[];
  showDetails: boolean;
}

const ProfileDetails = ({ bio, interests, showDetails }: ProfileDetailsProps) => {
  if (!showDetails) return null;
  
  return (
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
  );
};

export default ProfileDetails;
