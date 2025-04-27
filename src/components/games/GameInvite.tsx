
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Match } from "@/types/match"; 

interface GameInviteProps {
  gameType?: "tic-tac-toe" | "rock-paper-scissors" | "word-guess";
  currentGameId?: string;
  currentGameName?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  sender?: Match;
}

const GameInvite = ({ 
  gameType, 
  currentGameId, 
  currentGameName,
  onAccept, 
  onDecline, 
  sender 
}: GameInviteProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Use currentGameId if provided, otherwise use gameType
  const gameTypeToUse = currentGameId || gameType || "tic-tac-toe";
  
  const handleAccept = () => {
    setIsLoading(true);
    if (onAccept) onAccept();
    setTimeout(() => {
      navigate(`/games/${gameTypeToUse}`);
    }, 1000);
  };
  
  // Demo matches for previewing different states
  const mockMatches = {
    recent: {
      id: "match-1",
      userId: "user-1",
      matchedUserId: "user-2",
      name: "Sophia Martinez",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      lastActive: new Date().toISOString(),
      matchDate: new Date().toISOString(),
      hasUnreadMessage: false,
      compatibilityScore: 85
    },
    unseen: {
      id: "match-2",
      userId: "user-1",
      matchedUserId: "user-3",
      name: "David Chen",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      lastActive: new Date().toISOString(),
      matchDate: new Date().toISOString(),
      hasUnreadMessage: true,
      compatibilityScore: 90
    },
    older: {
      id: "match-3",
      userId: "user-1",
      matchedUserId: "user-4",
      name: "Emma Wilson",
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      lastActive: new Date(Date.now() - 86400000).toISOString(),
      matchDate: new Date(Date.now() - 86400000).toISOString(),
      hasUnreadMessage: false,
      compatibilityScore: 75
    }
  };
  
  // Use provided sender or fallback to a mock match
  const matchData = sender || mockMatches.recent;
  
  const gameNames = {
    "tic-tac-toe": "Tic-Tac-Toe",
    "rock-paper-scissors": "Rock Paper Scissors",
    "word-guess": "Word Guess Challenge"
  };
  
  // Use currentGameName if provided, otherwise use gameNames lookup
  const gameNameToDisplay = currentGameName || gameNames[gameTypeToUse as keyof typeof gameNames] || "Game";
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-center">Game Invitation</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={matchData.imageUrl} alt={matchData.name} />
          <AvatarFallback>{matchData.name[0]}</AvatarFallback>
        </Avatar>
        <div className="text-center space-y-2">
          <p className="font-medium text-lg">{matchData.name}</p>
          <p className="text-muted-foreground">
            wants to play <span className="font-semibold">{gameNameToDisplay}</span> with you!
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-3">
        <Button variant="outline" onClick={onDecline} disabled={isLoading}>
          Decline
        </Button>
        <Button onClick={handleAccept} disabled={isLoading}>
          {isLoading ? "Loading..." : "Accept"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GameInvite;
