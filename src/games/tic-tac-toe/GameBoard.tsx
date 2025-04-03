
import React from "react";
import { Button } from "@/components/ui/button";

type Player = "X" | "O" | null;
type Board = (Player)[][];

interface GameBoardProps {
  board: Board;
  onMakeMove: (row: number, col: number) => void;
  winner: Player;
  isDraw: boolean;
  currentPlayer: "X" | "O";
  contactName: string;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onMakeMove,
  winner,
  isDraw,
  currentPlayer,
  contactName
}) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((row, rowIndex) => 
          row.map((cell, colIndex) => (
            <Button
              key={`${rowIndex}-${colIndex}`}
              variant="outline"
              className="h-24 w-full text-4xl font-bold"
              onClick={() => onMakeMove(rowIndex, colIndex)}
              disabled={!!winner || isDraw || !!cell || currentPlayer === "O"}
            >
              {cell}
            </Button>
          ))
        )}
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        {currentPlayer === "X" ? "Your turn" : `${contactName}'s turn`}
      </div>
    </>
  );
};

export default GameBoard;
