
import React from "react";
import { Button } from "@/components/ui/button";

interface GameOverMessageProps {
  gameWon: boolean;
  word: string;
  onPlayAgain: () => void;
}

const GameOverMessage = ({ gameWon, word, onPlayAgain }: GameOverMessageProps) => {
  if (!gameWon && !word) return null;
  
  return (
    <div className="text-center mt-4">
      <p className="text-lg font-medium">
        {gameWon ? "Congratulations! You guessed the word!" : `Game over! The word was: ${word}`}
      </p>
      <Button onClick={onPlayAgain} className="mt-2">
        Play Again
      </Button>
    </div>
  );
};

export default GameOverMessage;
