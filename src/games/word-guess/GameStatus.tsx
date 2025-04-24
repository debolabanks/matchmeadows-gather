
import React from "react";
import { motion } from "framer-motion";

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
    <motion.div 
      className="mb-4 p-3 bg-accent/20 rounded-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {gameOver ? (
        <motion.div 
          className="text-lg font-medium text-center"
          initial={{ scale: 0.9 }}
          animate={{ 
            scale: [1, 1.1, 1],
            color: gameWon ? ["#000", "#1E40AF", "#000"] : ["#000", "#B91C1C", "#000"]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: 2,
            repeatType: "reverse"
          }}
        >
          {gameWon 
            ? `${playerName} won!` 
            : `${opponentName} won!`}
        </motion.div>
      ) : (
        <div className="flex justify-center items-center gap-2">
          <motion.div 
            className="h-3 w-3 rounded-full bg-primary"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 1
            }}
          />
          <div className="text-lg font-medium">{`${playerName}'s turn`}</div>
        </div>
      )}
    </motion.div>
  );
};

export default GameStatus;
