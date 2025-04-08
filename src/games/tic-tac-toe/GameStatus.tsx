
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface GameStatusProps {
  winner: "X" | "O" | null;
  isDraw: boolean;
  currentPlayer: "X" | "O";
  contactName?: string;
  onResetGame: () => void;
  isMultiplayerMode?: boolean;  // Added the missing prop
}

const GameStatus: React.FC<GameStatusProps> = ({
  winner,
  isDraw,
  currentPlayer,
  contactName,
  onResetGame,
  isMultiplayerMode
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="text-lg font-medium">
        {winner 
          ? `Winner: ${winner === "X" ? "You" : contactName || "Opponent"}`
          : isDraw 
            ? "It's a draw!" 
            : `Current Player: ${currentPlayer === "X" ? "You" : contactName || "Opponent"}`}
      </div>
      <Button 
        onClick={onResetGame} 
        variant="outline" 
        size="sm"
        className="flex items-center gap-1"
      >
        <RefreshCw className="h-4 w-4" />
        New Game
      </Button>
    </div>
  );
};

export default GameStatus;
