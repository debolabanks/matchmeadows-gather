
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Match } from "@/types/match";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gamepad2, Users2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import webRTCService from "@/services/webrtc/webRTCService";

interface GameInviteProps {
  currentGameId?: string;
  currentGameName?: string;
}

const GameInvite = ({ currentGameId, currentGameName }: GameInviteProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>([
    {
      id: "1",
      name: "Sophie Chen",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
      lastActive: new Date().toISOString(),
      matchDate: new Date().toISOString(),
      hasUnreadMessage: false,
    },
    {
      id: "2",
      name: "James Wilson",
      imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
      lastActive: new Date().toISOString(),
      matchDate: new Date().toISOString(),
      hasUnreadMessage: true,
    },
    {
      id: "3",
      name: "Olivia Martinez",
      imageUrl: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
      lastActive: new Date().toISOString(),
      matchDate: new Date().toISOString(),
      hasUnreadMessage: false,
    }
  ]);
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());

  const handleInvite = async (match: Match) => {
    try {
      setIsLoading(true);
      setInvitedIds(prev => new Set(prev).add(match.id));
      
      // Create a unique game session ID
      const gameSessionId = `game-${currentGameId}-${Date.now()}`;
      
      // Initialize WebRTC connection and send invitation
      await webRTCService.call(match.id, gameSessionId);
      
      toast({
        title: "Invitation sent",
        description: `${match.name} has been invited to join your game.`
      });
      
      // Navigate to the appropriate game with multiplayer params
      if (currentGameId) {
        navigate(`/games/${currentGameId}`, { 
          state: { 
            contactId: match.id,
            contactName: match.name,
            multiplayer: true,
            gameSessionId
          } 
        });
      }
    } catch (error) {
      console.error("Error sending game invitation:", error);
      toast({
        title: "Invitation failed",
        description: "Could not send the game invitation. Please try again.",
        variant: "destructive"
      });
      
      setInvitedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(match.id);
        return newSet;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
        >
          <Users2 className="h-4 w-4" />
          Invite to play
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            Invite a Friend to Play
            {currentGameName && <span className="text-muted-foreground text-sm font-normal">({currentGameName})</span>}
          </SheetTitle>
          <SheetDescription>
            Invite your matches to play this game together in real-time using WebRTC.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Your Matches</h4>
          
          <ScrollArea className="h-[300px]">
            {matches.length > 0 ? (
              <div className="space-y-2">
                {matches.map(match => (
                  <div 
                    key={match.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={match.imageUrl} alt={match.name} />
                        <AvatarFallback>{match.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{match.name}</p>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant={invitedIds.has(match.id) ? "secondary" : "default"}
                      onClick={() => handleInvite(match)}
                      disabled={isLoading || invitedIds.has(match.id)}
                    >
                      {invitedIds.has(match.id) ? "Invited" : "Invite"}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                <p>No matches found</p>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => navigate("/discover")}
                  className="mt-2"
                >
                  Go to Discover
                </Button>
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default GameInvite;
