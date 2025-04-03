
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
  // Animation variants for cells
  const cellVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((row, rowIndex) => 
          row.map((cell, colIndex) => (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={cellVariants}
              transition={{ duration: 0.2, delay: rowIndex * 0.1 + colIndex * 0.1 }}
            >
              <Button
                variant="outline"
                className="h-24 w-full text-4xl font-bold"
                onClick={() => onMakeMove(rowIndex, colIndex)}
                disabled={!!winner || isDraw || !!cell || currentPlayer === "O"}
              >
                {cell && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    {cell}
                  </motion.span>
                )}
              </Button>
            </motion.div>
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
