
import React from "react";
import type { GameOption, GameResult as GameResultType } from "./useRockPaperScissors";
import { motion } from "framer-motion";

interface GameResultProps {
  result: GameResultType;
  playerChoice: GameOption;
  opponentChoice: GameOption;
  isPlaying: boolean;
}

const GameResult = ({ result, playerChoice, opponentChoice, isPlaying }: GameResultProps) => {
  const getEmoji = (choice: GameOption): string => {
    switch (choice) {
      case "rock": return "✊";
      case "paper": return "✋";
      case "scissors": return "✌️";
      default: return "❓";
    }
  };
  
  const getResultMessage = () => {
    if (!result) return "";
    
    switch (result) {
      case "win": return "You win!";
      case "lose": return "You lose!";
      case "draw": return "It's a draw!";
      default: return "";
    }
  };
  
  return (
    <div className="flex flex-col items-center my-6">
      {(playerChoice || opponentChoice) && (
        <>
          <div className="flex justify-around w-full mb-4">
            <motion.div 
              className="flex flex-col items-center"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="text-sm text-muted-foreground mb-2">You</span>
              <motion.div 
                className="text-5xl"
                animate={{ 
                  scale: result === "win" ? [1, 1.2, 1] : 1,
                  rotate: result ? [0, 10, -10, 0] : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                {playerChoice ? getEmoji(playerChoice) : "❓"}
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-sm text-muted-foreground mb-2">VS</span>
              <div className="text-2xl">🆚</div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="text-sm text-muted-foreground mb-2">Opponent</span>
              <motion.div 
                className="text-5xl"
                animate={{ 
                  scale: result === "lose" ? [1, 1.2, 1] : 1,
                  rotate: result ? [0, 10, -10, 0] : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                {isPlaying && !opponentChoice ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  >
                    🤔
                  </motion.div>
                ) : opponentChoice ? (
                  getEmoji(opponentChoice)
                ) : (
                  "❓"
                )}
              </motion.div>
            </motion.div>
          </div>
          
          {result && (
            <motion.div 
              className="mt-4 text-xl font-bold"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
            >
              {getResultMessage()}
            </motion.div>
          )}
        </>
      )}
      
      {!playerChoice && !opponentChoice && !isPlaying && (
        <motion.div 
          className="text-center text-lg my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Select rock, paper, or scissors to start
        </motion.div>
      )}
    </div>
  );
};

export default GameResult;
