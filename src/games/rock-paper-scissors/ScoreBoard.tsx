
import React from "react";

interface ScoreBoardProps {
  playerScore: number;
  opponentScore: number;
  opponentName?: string;
}

const ScoreBoard = ({ playerScore, opponentScore, opponentName }: ScoreBoardProps) => {
  return (
    <div className="bg-accent/20 rounded-md p-4 mb-4">
      <h3 className="text-center mb-2 font-medium">Score</h3>
      <div className="flex justify-around items-center">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">You</div>
          <div className="text-3xl font-bold">{playerScore}</div>
        </div>
        <div className="text-xl font-bold">-</div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">{opponentName || "Opponent"}</div>
          <div className="text-3xl font-bold">{opponentScore}</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
