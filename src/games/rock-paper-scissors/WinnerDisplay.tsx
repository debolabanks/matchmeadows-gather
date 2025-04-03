
import React from "react";
import { motion } from "framer-motion";
import type { GameResult } from "./useRockPaperScissors";

interface WinnerDisplayProps {
  result: GameResult;
  playerName?: string;
  opponentName?: string;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({
  result,
  playerName = "You",
  opponentName = "Opponent"
}) => {
  if (!result) return null;

  const colors = {
    win: "#16a34a", // green-600
    lose: "#dc2626", // red-600
    draw: "#9333ea"  // purple-600
  };

  const messages = {
    win: `${playerName} won!`,
    lose: `${opponentName} won!`,
    draw: "It's a draw!"
  };

  return (
    <motion.div
      className="my-4 py-3 px-6 rounded-md text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        backgroundColor: [
          "rgba(0,0,0,0.1)",
          `${colors[result]}30`,
          "rgba(0,0,0,0.1)"
        ]
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      <motion.div 
        className="text-xl font-bold"
        animate={{ 
          scale: [1, 1.1, 1],
          color: [
            "#000",
            colors[result],
            "#000"
          ]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        {messages[result]}
      </motion.div>
    </motion.div>
  );
};

export default WinnerDisplay;
