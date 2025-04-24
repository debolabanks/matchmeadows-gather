
import React from "react";

export interface ScoreBoardProps {
  scores: {
    X: number;
    O: number;
  };
  contactName?: string;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ scores, contactName = "Opponent" }) => {
  return (
    <div className="flex justify-center gap-4 mb-6 bg-accent/10 rounded-md p-3">
      <div className="text-center">
        <div className="text-sm font-medium mb-1">You</div>
        <div className="text-2xl font-bold">{scores.X}</div>
      </div>
      
      <div className="w-px bg-border"></div>
      
      <div className="text-center">
        <div className="text-sm font-medium mb-1">{contactName}</div>
        <div className="text-2xl font-bold">{scores.O}</div>
      </div>
    </div>
  );
};

export default ScoreBoard;
