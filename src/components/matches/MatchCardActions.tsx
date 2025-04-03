
import { Match } from "@/types/match";
import { MessageSquare, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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

interface MatchCardActionsProps {
  match: Match;
  onBlockUser: (id: string, name: string) => void;
}

const MatchCardActions = ({ match, onBlockUser }: MatchCardActionsProps) => {
  return (
    <div className="flex gap-2">
      <Link to={`/messages`} state={{ contactId: match.id }} className="flex-1">
        <Button className="w-full" variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          Message
        </Button>
      </Link>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Ban className="h-4 w-4 text-muted-foreground" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block {match.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will prevent {match.name} from seeing your profile or contacting you. 
              You won't see their profile anymore either.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onBlockUser(match.id, match.name)}>
              Block User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MatchCardActions;
