
import React from "react";
import { motion } from "framer-motion";

interface ScoreBoardProps {
  playerScore: number;
  opponentScore: number;
  draws: number;
  contactName?: string;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  playerScore,
  opponentScore,
  draws,
  contactName = "Opponent"
}) => {
  return (
    <div className="mb-4 p-3 bg-accent/20 rounded-md">
      <h3 className="text-sm font-medium text-center mb-2">Game Score</h3>
      <div className="grid grid-cols-3 gap-2 text-center">
        <motion.div 
          className="p-2 rounded-md bg-primary/10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-xs text-muted-foreground">You</div>
          <motion.div 
            className="text-xl font-bold"
            key={playerScore}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.5, times: [0, 0.5, 1] }}
          >
            {playerScore}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="p-2 rounded-md bg-yellow-500/10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="text-xs text-muted-foreground">Draws</div>
          <motion.div 
            className="text-xl font-bold"
            key={draws}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.5, times: [0, 0.5, 1] }}
          >
            {draws}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="p-2 rounded-md bg-secondary/10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="text-xs text-muted-foreground">{contactName}</div>
          <motion.div 
            className="text-xl font-bold"
            key={opponentScore}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.5, times: [0, 0.5, 1] }}
          >
            {opponentScore}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScoreBoard;
