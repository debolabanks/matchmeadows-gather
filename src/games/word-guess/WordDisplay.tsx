
import React from "react";
import { motion } from "framer-motion";

interface WordDisplayProps {
  word: string;
  guessedLetters: string[];
}

const WordDisplay = ({ word, guessedLetters }: WordDisplayProps) => {
  return (
    <div className="mb-6 p-4 bg-accent/30 rounded-md text-center">
      {word.split("").map((letter, index) => (
        guessedLetters.includes(letter) ? (
          <motion.span 
            key={index} 
            className="text-2xl font-bold mx-1"
            initial={{ y: -20, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: index * 0.05,
              scale: {
                duration: 0.3,
                repeat: 1,
                repeatType: "reverse"
              }
            }}
          >
            {letter}
          </motion.span>
        ) : (
          <motion.span 
            key={index} 
            className="text-2xl font-bold mx-1 border-b-2 border-primary w-6 inline-block text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            _
          </motion.span>
        )
      ))}
    </div>
  );
};

export default WordDisplay;
