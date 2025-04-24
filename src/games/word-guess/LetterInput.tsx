
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LetterInputProps {
  currentGuess: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}

const LetterInput = ({ 
  currentGuess, 
  onChange, 
  onSubmit, 
  disabled 
}: LetterInputProps) => {
  return (
    <form onSubmit={onSubmit} className="mb-6 flex gap-2">
      <Input
        type="text"
        value={currentGuess}
        onChange={onChange}
        maxLength={1}
        placeholder="Type a letter"
        className="w-full"
        disabled={disabled}
      />
      <Button 
        type="submit" 
        disabled={
          currentGuess.length !== 1 || 
          disabled ||
          !/^[A-Za-z]$/.test(currentGuess)
        }
      >
        Guess
      </Button>
    </form>
  );
};

export default LetterInput;
