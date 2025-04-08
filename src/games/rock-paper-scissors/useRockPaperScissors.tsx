
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  playGameStartSound,
  playWinSound,
  playLoseSound,
  playDrawSound
} from "../utils/gameSounds";

export type GameOption = "rock" | "paper" | "scissors" | null;
export type GameResult = "win" | "lose" | "draw" | null;

interface RockPaperScissorsProps {
  contactName?: string;
  isMultiplayer?: boolean;
}

export const useRockPaperScissors = ({
  contactName,
  isMultiplayer = false
}: RockPaperScissorsProps) => {
  const [playerChoice, setPlayerChoice] = useState<GameOption>(null);
  const [opponentChoice, setOpponentChoice] = useState<GameOption>(null);
  const [result, setResult] = useState<GameResult>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [useAI, setUseAI] = useState(!isMultiplayer);
  
  const { toast } = useToast();

  // Determine the winner
  const determineWinner = useCallback((player: GameOption, opponent: GameOption): GameResult => {
    if (!player || !opponent) return null;
    
    if (player === opponent) return "draw";
    
    if (
      (player === "rock" && opponent === "scissors") ||
      (player === "paper" && opponent === "rock") ||
      (player === "scissors" && opponent === "paper")
    ) {
      return "win";
    }
    
    return "lose";
  }, []);

  // Play appropriate sound based on result
  const playResultSound = useCallback((gameResult: GameResult) => {
    if (gameResult === "win") {
      playWinSound();
    } else if (gameResult === "lose") {
      playLoseSound();
    } else if (gameResult === "draw") {
      playDrawSound();
    }
  }, []);

  // Generate AI opponent's choice
  const generateOpponentChoice = useCallback((): GameOption => {
    const options: GameOption[] = ["rock", "paper", "scissors"];
    const randomIndex = Math.floor(Math.random() * 3);
    return options[randomIndex];
  }, []);

  // Handle player choice
  const handlePlayerChoice = useCallback((choice: GameOption) => {
    if (isPlaying || !choice) return;
    
    setPlayerChoice(choice);
    setIsPlaying(true);
    
    // In multiplayer mode with a real opponent, we would wait for their choice
    // For now, we'll still use AI for opponent's move in multiplayer mode
    if (useAI) {
      setTimeout(() => {
        const aiChoice = generateOpponentChoice();
        setOpponentChoice(aiChoice);
        
        const gameResult = determineWinner(choice, aiChoice);
        setResult(gameResult);
        
        // Update scores
        if (gameResult === "win") {
          setPlayerScore(prev => prev + 1);
          toast({
            title: "You won!",
            description: `${choice} beats ${aiChoice}`,
          });
        } else if (gameResult === "lose") {
          setOpponentScore(prev => prev + 1);
          toast({
            title: `${contactName || "Opponent"} won!`,
            description: `${aiChoice} beats ${choice}`,
          });
        } else {
          toast({
            title: "It's a draw!",
            description: `Both chose ${choice}`,
          });
        }
        
        playResultSound(gameResult);
        setIsPlaying(false);
      }, 1500);
    } else if (isMultiplayer) {
      // In a real multiplayer implementation, we would send the choice to the opponent
      // and wait for their response, but for now we'll simulate this
      setTimeout(() => {
        const simulatedOpponentChoice = generateOpponentChoice();
        setOpponentChoice(simulatedOpponentChoice);
        
        const gameResult = determineWinner(choice, simulatedOpponentChoice);
        setResult(gameResult);
        
        // Update scores
        if (gameResult === "win") {
          setPlayerScore(prev => prev + 1);
          toast({
            title: "You won!",
            description: `${choice} beats ${simulatedOpponentChoice}`,
          });
        } else if (gameResult === "lose") {
          setOpponentScore(prev => prev + 1);
          toast({
            title: `${contactName || "Opponent"} won!`,
            description: `${simulatedOpponentChoice} beats ${choice}`,
          });
        } else {
          toast({
            title: "It's a draw!",
            description: `Both chose ${choice}`,
          });
        }
        
        playResultSound(gameResult);
        setIsPlaying(false);
      }, 1500);
    }
  }, [
    isPlaying, 
    useAI, 
    isMultiplayer, 
    generateOpponentChoice, 
    determineWinner, 
    contactName, 
    toast, 
    playResultSound
  ]);

  // Reset the game
  const resetGame = useCallback(() => {
    setPlayerChoice(null);
    setOpponentChoice(null);
    setResult(null);
    setIsPlaying(false);
    playGameStartSound();
  }, []);
  
  // Play game start sound on initial mount
  useEffect(() => {
    playGameStartSound();
  }, []);
  
  return {
    playerChoice,
    opponentChoice,
    result,
    playerScore,
    opponentScore,
    isPlaying,
    handlePlayerChoice,
    resetGame,
    setUseAI
  };
};
