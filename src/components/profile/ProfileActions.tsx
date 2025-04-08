
import { Heart, X, MessageSquare, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import AdBanner from "@/components/AdBanner";
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

interface ProfileActionsProps {
  id: string;
  name: string;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onBlock: () => void;
  isMatched?: boolean;
}

const ProfileActions = ({ id, name, onLike, onDislike, onBlock, isMatched = false }: ProfileActionsProps) => {
  const { user } = useAuth();
  const isSubscribed = user?.profile?.subscriptionStatus === "active";
  
  return (
    <>
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
        
        <Link 
          to="/messages" 
          state={{ contactId: id, isMatched: isMatched }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button 
            variant="outline" 
            size="icon" 
            className="swipe-button bg-white hover:bg-blue-50 rounded-full h-12 w-12"
            title={isMatched ? "Send message" : "Match required to message"}
          >
            <MessageSquare className="h-6 w-6 text-blue-500" />
          </Button>
        </Link>
        
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
              <AlertDialogAction onClick={onBlock}>Block User</AlertDialogAction>
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
      
      {!isSubscribed && (
        <div className="mt-2 p-2 border-t">
          <AdBanner variant="small" position="profile-card" adSlot="profile-action-ad" />
        </div>
      )}
    </>
  );
};

export default ProfileActions;
