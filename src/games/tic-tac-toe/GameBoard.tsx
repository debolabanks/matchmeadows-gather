
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Update the Player type to match with useGameState
type Player = "X" | "O" | null;
// Using the same board type as in useGameState
type BoardType = Array<string | null>;

interface GameBoardProps {
  board: BoardType;  // Updated to match the type used in useGameState
  onMakeMove: (index: number) => void;  // Update to match how useGameState.makeMove works
  winner: Player;
  isDraw: boolean;
  currentPlayer: "X" | "O";
  contactName: string;
  isMultiplayerMode?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onMakeMove,
  winner,
  isDraw,
  currentPlayer,
  contactName,
  isMultiplayerMode
}) => {
  // Animation variants for cells
  const cellVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  };

  // Winner animation variants
  const winnerVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.2, 1] as number[],
      transition: { 
        repeat: Infinity,
        repeatType: "reverse" as const, 
        duration: 1
      }
    }
  };

  // Render the 3x3 grid from the flat array
  const renderBoard = () => {
    return Array(3).fill(null).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex gap-2">
        {Array(3).fill(null).map((_, colIndex) => {
          const index = rowIndex * 3 + colIndex;
          const cell = board[index];
          
          return (
            <motion.div
              key={`cell-${index}`}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={cellVariants}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex-1"
            >
              <Button
                variant="outline"
                className="h-24 w-full text-4xl font-bold"
                onClick={() => onMakeMove(index)}
                disabled={!!winner || isDraw || !!cell || (currentPlayer === "O" && !isMultiplayerMode)}
              >
                {cell && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    variants={winner === cell ? winnerVariants : undefined}
                  >
                    {cell}
                  </motion.span>
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>
    ));
  };

  return (
    <>
      <div className="flex flex-col gap-2 mb-4">
        {renderBoard()}
      </div>
      
      <div className="text-center mt-4">
        <motion.div 
          className="flex justify-center items-center gap-2 p-2 bg-accent/20 rounded-md"
          animate={{ 
            y: [0, -3, 0],
            transition: { repeat: Infinity, repeatType: "reverse", duration: 1.5 }
          }}
        >
          <div className="h-3 w-3 rounded-full bg-primary"></div>
          <div className="text-sm font-medium">
            {currentPlayer === "X" ? "Your turn" : `${contactName}'s turn`}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default GameBoard;
