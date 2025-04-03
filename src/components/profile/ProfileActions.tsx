
import { Heart, X, MessageSquare, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
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
}

const ProfileActions = ({ id, name, onLike, onDislike, onBlock }: ProfileActionsProps) => {
  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Starting conversation",
      description: `Starting a new conversation with ${name}`
    });
    // In a real app, this would navigate to the messages page
  };

  return (
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
  );
};

export default ProfileActions;
