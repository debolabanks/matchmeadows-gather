
import React from "react";

interface WordDisplayProps {
  word: string;
  guessedLetters: string[];
}

const WordDisplay = ({ word, guessedLetters }: WordDisplayProps) => {
  return (
    <div className="mb-6 p-4 bg-accent/30 rounded-md text-center">
      {word.split("").map((letter, index) => (
        guessedLetters.includes(letter) ? (
          <span key={index} className="text-2xl font-bold mx-1">{letter}</span>
        ) : (
          <span key={index} className="text-2xl font-bold mx-1 border-b-2 border-primary w-6 inline-block text-center">_</span>
        )
      ))}
    </div>
  );
};

export default WordDisplay;
