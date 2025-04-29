
import React from "react";
import { Button } from "@/components/ui/button";
import { Users, User } from "lucide-react";

interface MultiplayerModeProps {
  isMultiplayer: boolean;
  onToggleMode: () => void;
  playerTurn: 1 | 2;
  player1Name?: string;
  player2Name?: string;
}

const MultiplayerMode = ({ 
  isMultiplayer, 
  onToggleMode, 
  playerTurn,
  player1Name = "Player 1",
  player2Name = "Player 2"
}: MultiplayerModeProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleMode}
          className="flex items-center gap-1"
        >
          {isMultiplayer ? <Users className="h-4 w-4" /> : <User className="h-4 w-4" />}
          {isMultiplayer ? "Multiplayer Mode" : "Single Player Mode"}
        </Button>
        
        {isMultiplayer && (
          <div className="text-sm font-medium">
            <span className={`${playerTurn === 1 ? "text-primary font-bold" : "text-muted-foreground"}`}>
              {player1Name}
            </span>
            <span className="mx-2">vs</span>
            <span className={`${playerTurn === 2 ? "text-primary font-bold" : "text-muted-foreground"}`}>
              {player2Name}
            </span>
          </div>
        )}
      </div>
      
      {isMultiplayer && (
        <div className="bg-accent/20 p-2 rounded-md text-center text-sm">
          <span className="font-medium">Current Turn: </span>
          {playerTurn === 1 ? player1Name : player2Name}
        </div>
      )}
    </div>
  );
};

export default MultiplayerMode;
