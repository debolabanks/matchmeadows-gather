
import React from "react";

interface GameProgressProps {
  wrongGuesses: number;
  maxWrongGuesses: number;
}

const GameProgress = ({ wrongGuesses, maxWrongGuesses }: GameProgressProps) => {
  return (
    <div className="mb-6">
      <p className="text-sm text-muted-foreground mb-2">
        Wrong guesses: {wrongGuesses} / {maxWrongGuesses}
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full" 
          style={{ width: `${(wrongGuesses / maxWrongGuesses) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default GameProgress;
