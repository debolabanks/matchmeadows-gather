
import React from "react";
import { Button } from "@/components/ui/button";

interface LetterKeyboardProps {
  guessedLetters: string[];
  onLetterClick: (letter: string) => void;
  disabled: boolean;
}

const LetterKeyboard = ({ 
  guessedLetters, 
  onLetterClick, 
  disabled 
}: LetterKeyboardProps) => {
  const keyboard = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter => (
    <Button
      key={letter}
      variant="outline"
      className="w-8 h-8 p-0 m-1 text-center"
      disabled={guessedLetters.includes(letter) || disabled}
      onClick={() => onLetterClick(letter)}
    >
      {letter}
    </Button>
  ));

  return (
    <div className="flex flex-wrap justify-center mb-4">
      {keyboard}
    </div>
  );
};

export default LetterKeyboard;
