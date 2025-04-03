
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export type GameOption = "rock" | "paper" | "scissors" | null;
export type GameResult = "win" | "lose" | "draw" | null;

interface UseRockPaperScissorsProps {
  contactName?: string;
}

export const useRockPaperScissors = ({ contactName }: UseRockPaperScissorsProps) => {
  const { toast } = useToast();
  
  const [playerChoice, setPlayerChoice] = useState<GameOption>(null);
  const [opponentChoice, setOpponentChoice] = useState<GameOption>(null);
  const [result, setResult] = useState<GameResult>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [opponentTimeout, setOpponentTimeout] = useState<NodeJS.Timeout | null>(null);

  const determineWinner = (player: GameOption, opponent: GameOption): GameResult => {
    if (player === opponent) return "draw";
    
    if (
      (player === "rock" && opponent === "scissors") ||
      (player === "paper" && opponent === "rock") ||
      (player === "scissors" && opponent === "paper")
    ) {
      return "win";
    }
    
    return "lose";
  };

  const handlePlayerChoice = (choice: GameOption) => {
    if (isPlaying || !choice) return;
    
    setIsPlaying(true);
    setPlayerChoice(choice);
    
    // Simulate opponent thinking and choosing
    const timeout = setTimeout(() => {
      const options: GameOption[] = ["rock", "paper", "scissors"];
      const randomChoice = options[Math.floor(Math.random() * options.length)];
      setOpponentChoice(randomChoice);
      
      const gameResult = determineWinner(choice, randomChoice);
      setResult(gameResult);
      
      // Update scores
      if (gameResult === "win") {
        setPlayerScore(prev => prev + 1);
        toast({
          title: "You won!",
          description: `${choice} beats ${randomChoice}`,
          duration: 3000,
        });
      } else if (gameResult === "lose") {
        setOpponentScore(prev => prev + 1);
        toast({
          title: `${contactName || "Opponent"} won!`,
          description: `${randomChoice} beats ${choice}`,
          duration: 3000,
        });
      } else {
        toast({
          title: "It's a draw!",
          description: `Both chose ${choice}`,
          duration: 3000,
        });
      }
      
      // Reset for next round
      setTimeout(() => {
        setIsPlaying(false);
      }, 1500);
      
    }, 1000);
    
    setOpponentTimeout(timeout);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setOpponentChoice(null);
    setResult(null);
    setPlayerScore(0);
    setOpponentScore(0);
    setIsPlaying(false);
    
    if (opponentTimeout) {
      clearTimeout(opponentTimeout);
    }
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (opponentTimeout) {
        clearTimeout(opponentTimeout);
      }
    };
  }, [opponentTimeout]);

  return {
    playerChoice,
    opponentChoice, 
    result,
    playerScore,
    opponentScore,
    isPlaying,
    handlePlayerChoice,
    resetGame
  };
};
