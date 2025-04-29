
import React from "react";

interface ScoreDisplayProps {
  player1Score: number;
  player2Score: number;
  player2Name: string;
  isMultiplayer: boolean;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  player1Score, 
  player2Score, 
  player2Name,
  isMultiplayer
}) => {
  if (!isMultiplayer) return null;
  
  return (
    <div className="bg-accent/20 rounded-md p-4 mb-4">
      <h3 className="text-center mb-2 font-medium">Score</h3>
      <div className="flex justify-around items-center">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Player 1</div>
          <div className="text-3xl font-bold">{player1Score}</div>
        </div>
        <div className="text-xl font-bold">-</div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            {isMultiplayer ? "Player 2" : player2Name}
          </div>
          <div className="text-3xl font-bold">{player2Score}</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
