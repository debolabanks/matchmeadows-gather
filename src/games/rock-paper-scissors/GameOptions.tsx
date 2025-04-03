
import React from "react";
import { Button } from "@/components/ui/button";

type GameOption = "rock" | "paper" | "scissors" | null;

interface GameOptionsProps {
  onSelectOption: (option: GameOption) => void;
  disabled: boolean;
  selectedOption: GameOption;
}

const GameOptions = ({ onSelectOption, disabled, selectedOption }: GameOptionsProps) => {
  const options: { value: GameOption; label: string; emoji: string }[] = [
    { value: "rock", label: "Rock", emoji: "✊" },
    { value: "paper", label: "Paper", emoji: "✋" },
    { value: "scissors", label: "Scissors", emoji: "✌️" }
  ];

  return (
    <div className="flex flex-col items-center mt-6">
      <h3 className="text-lg font-medium mb-4">Make your choice:</h3>
      <div className="flex justify-center gap-4">
        {options.map((option) => (
          <Button
            key={option.value}
            onClick={() => onSelectOption(option.value)}
            disabled={disabled}
            variant={selectedOption === option.value ? "default" : "outline"}
            className="flex flex-col items-center p-6 h-auto"
            aria-label={option.label}
          >
            <span className="text-3xl mb-2">{option.emoji}</span>
            <span>{option.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GameOptions;
