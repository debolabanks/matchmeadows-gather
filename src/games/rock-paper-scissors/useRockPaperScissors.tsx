
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  playWinSound, 
  playLoseSound, 
  playDrawSound,
  playGameStartSound,
  playClickSound
} from "../utils/gameSounds";

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

  // Play game start sound on component mount
  useEffect(() => {
    playGameStartSound();
    
    // Clean up timeouts on unmount
    return () => {
      if (opponentTimeout) {
        clearTimeout(opponentTimeout);
      }
    };
  }, []);

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
    
    // Play click sound when player makes a choice
    playClickSound();
    
    setIsPlaying(true);
    setPlayerChoice(choice);
    
    // Simulate opponent thinking and choosing
    const timeout = setTimeout(() => {
      const options: GameOption[] = ["rock", "paper", "scissors"];
      const randomChoice = options[Math.floor(Math.random() * options.length)];
      setOpponentChoice(randomChoice);
      
      const gameResult = determineWinner(choice, randomChoice);
      setResult(gameResult);
      
      // Play appropriate sound based on result
      if (gameResult === "win") {
        playWinSound();
        setPlayerScore(prev => prev + 1);
        toast({
          title: "You won!",
          description: `${choice} beats ${randomChoice}`,
          duration: 3000,
        });
      } else if (gameResult === "lose") {
        playLoseSound();
        setOpponentScore(prev => prev + 1);
        toast({
          title: `${contactName || "Opponent"} won!`,
          description: `${randomChoice} beats ${choice}`,
          duration: 3000,
        });
      } else {
        playDrawSound();
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
    playGameStartSound();
    
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
