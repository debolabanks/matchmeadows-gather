
import { Heart, X, MessageSquare, Map, Shield, Flag, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import ProfileCardActions from "./ProfileCardActions";

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

  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Starting conversation",
      description: `Starting a new conversation with ${name}`
    });
    // In a real app, this would navigate to the messages page
    // or open a new chat with this user
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
          className="swipe-button bg-white hover:bg-red-50 rounded-full h-12 w-12"
        >
          <X className="h-6 w-6 text-red-500" />
        </Button>
        
        <Button 
          onClick={handleMessageClick}
          variant="outline" 
          size="icon" 
          className="swipe-button bg-white hover:bg-blue-50 rounded-full h-12 w-12"
        >
          <MessageSquare className="h-6 w-6 text-blue-500" />
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              onClick={(e) => e.stopPropagation()}
              variant="outline" 
              size="icon" 
              className="swipe-button bg-white hover:bg-gray-50 rounded-full h-12 w-12"
            >
              <Ban className="h-6 w-6 text-gray-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Block {name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This will prevent {name} from seeing your profile or contacting you. 
                You won't see their profile anymore either.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleBlockUser}>Block User</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onLike(id);
          }}
          variant="outline" 
          size="icon" 
          className="swipe-button bg-white hover:bg-love-50 rounded-full h-12 w-12"
        >
          <Heart className="h-6 w-6 text-love-500" />
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
