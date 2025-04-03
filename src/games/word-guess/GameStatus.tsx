
import React from "react";

interface GameStatusProps {
  gameOver: boolean;
  gameWon: boolean;
  playerName: string;
  opponentName: string;
}

const GameStatus: React.FC<GameStatusProps> = ({ 
  gameOver, 
  gameWon, 
  playerName,
  opponentName
}) => {
  return (
    <div className="mb-4 text-lg font-medium">
      {gameOver 
        ? gameWon 
          ? `${playerName} won!` 
          : `${opponentName} won!`
        : `${playerName}'s turn`}
    </div>
  );
};

export default GameStatus;
