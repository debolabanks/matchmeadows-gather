
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  MAX_WRONG_GUESSES,
  getRandomWord,
  checkWin,
  checkLoss,
  DEFAULT_CATEGORY,
} from "./gameUtils";
import { 
  playCorrectSound, 
  playWrongSound, 
  playWinSound, 
  playLoseSound, 
  playGameStartSound,
  playClickSound
} from "../utils/gameSounds";

interface WordGuessHookProps {
  contactInfo: {
    contactId?: string;
    contactName?: string;
  };
}

export const useWordGuess = ({ contactInfo }: WordGuessHookProps) => {
  const { toast } = useToast();
  
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [currentGuess, setCurrentGuess] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  
  // Multiplayer state
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [playerTurn, setPlayerTurn] = useState<1 | 2>(1);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  
  // Single player AI opponent state
  const [isOpponentTurn, setIsOpponentTurn] = useState(false);
  const [opponentTimeout, setOpponentTimeout] = useState<NodeJS.Timeout | null>(null);

  // Initialize the game with a random word
  useEffect(() => {
    startNewGame();
    
    // Cleanup timeouts on unmount
    return () => {
      if (opponentTimeout) {
        clearTimeout(opponentTimeout);
      }
    };
  }, []);

  // Cleanup function to clear any timeouts
  const cleanup = useCallback(() => {
    if (opponentTimeout) {
      clearTimeout(opponentTimeout);
    }
  }, [opponentTimeout]);

  // Start a new game with a random word from the selected category
  const startNewGame = () => {
    const newWord = getRandomWord(selectedCategory);
    setWord(newWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameOver(false);
    setGameWon(false);
    setPlayerTurn(1);
    setIsOpponentTurn(false);
    
    if (opponentTimeout) {
      clearTimeout(opponentTimeout);
    }
    
    // Play game start sound
    playGameStartSound();
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Start a new game with the new category if not currently in a game
    // or if they confirm they want to restart
    if (gameOver || guessedLetters.length === 0 || confirm("Changing category will start a new game. Continue?")) {
      setTimeout(() => {
        const newWord = getRandomWord(category);
        setWord(newWord);
        setGuessedLetters([]);
        setWrongGuesses(0);
        setGameOver(false);
        setGameWon(false);
        setPlayerTurn(1);
        setIsOpponentTurn(false);
        
        // Play game start sound
        playGameStartSound();
      }, 0);
    }
  };

  // Toggle between single player and multiplayer modes
  const toggleMultiplayerMode = () => {
    setIsMultiplayer(!isMultiplayer);
    startNewGame();
  };

  // Process a guess
  const handleGuess = (letter: string) => {
    // Ignore if game is over
    if (gameOver) return;
    
    // In single player mode, ignore if it's the opponent's turn
    if (!isMultiplayer && isOpponentTurn) return;
    
    // Play click sound
    playClickSound();
    
    // Convert to uppercase for consistency
    letter = letter.toUpperCase();
    
    // Ignore if already guessed or not a letter
    if (guessedLetters.includes(letter) || !/^[A-Z]$/.test(letter)) return;
    
    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);
    
    if (!word.includes(letter)) {
      // Play wrong guess sound
      playWrongSound();
      
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      
      if (checkLoss(newWrongGuesses)) {
        setGameOver(true);
        playLoseSound();
        toast({
          title: "Game Over!",
          description: `${isMultiplayer 
            ? (playerTurn === 1 ? "Player 1" : "Player 2") 
            : "You"} lost! The word was: ${word}`,
          duration: 5000,
        });
      } else {
        if (isMultiplayer) {
          // Switch turns in multiplayer mode
          setPlayerTurn(playerTurn === 1 ? 2 : 1);
        } else {
          // Switch to opponent's turn in single player mode
          setIsOpponentTurn(true);
          simulateOpponentGuess(newGuessedLetters);
        }
      }
    } else {
      // Play correct guess sound
      playCorrectSound();
      
      // Check if player won after a correct guess
      if (checkWin(word, newGuessedLetters)) {
        setGameOver(true);
        setGameWon(true);
        playWinSound();
        
        // Update score for the winning player
        if (isMultiplayer) {
          if (playerTurn === 1) {
            setPlayer1Score(player1Score + 1);
          } else {
            setPlayer2Score(player2Score + 1);
          }
        }
        
        toast({
          title: "Congratulations!",
          description: `${isMultiplayer 
            ? (playerTurn === 1 ? "Player 1" : "Player 2") 
            : "You"} won the game!`,
          duration: 5000,
        });
      }
    }
  };

  // Simulate opponent making a guess (single player mode only)
  const simulateOpponentGuess = (currentGuessedLetters: string[]) => {
    const timeout = setTimeout(() => {
      // Find letters not yet guessed
      const remainingLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        .split("")
        .filter(letter => !currentGuessedLetters.includes(letter));
      
      if (remainingLetters.length > 0) {
        // Play click sound for opponent
        playClickSound();
        
        // Random letter selection strategy
        const randomIndex = Math.floor(Math.random() * remainingLetters.length);
        const opponentGuess = remainingLetters[randomIndex];
        
        const newGuessedLetters = [...currentGuessedLetters, opponentGuess];
        setGuessedLetters(newGuessedLetters);
        
        if (!word.includes(opponentGuess)) {
          // Play wrong guess sound
          playWrongSound();
          setIsOpponentTurn(false); // Back to player's turn
        } else {
          // Play correct guess sound
          playCorrectSound();
          
          // If opponent guessed correctly, check win and maybe guess again
          if (checkWin(word, newGuessedLetters)) {
            setGameOver(true);
            setGameWon(false);
            playLoseSound();
            toast({
              title: "Game Over!",
              description: `${contactInfo.contactName || "Opponent"} won the game!`,
              duration: 5000,
            });
          } else {
            // Opponent guessed correctly, gets another turn
            simulateOpponentGuess(newGuessedLetters);
          }
        }
      }
    }, 1000);
    
    setOpponentTimeout(timeout);
  };

  // Handle input for guessing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentGuess(e.target.value);
  };

  // Submit a guess from the input
  const handleSubmitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentGuess.length === 1) {
      handleGuess(currentGuess);
      setCurrentGuess("");
    }
  };

  // Get the current player name based on turn
  const getCurrentPlayerName = () => {
    if (isMultiplayer) {
      return playerTurn === 1 ? "Player 1" : "Player 2";
    } else {
      return isOpponentTurn ? (contactInfo.contactName || "Opponent") : "You";
    }
  };

  return {
    word,
    guessedLetters,
    wrongGuesses,
    gameOver,
    gameWon,
    currentGuess,
    selectedCategory,
    isMultiplayer,
    playerTurn,
    player1Score,
    player2Score,
    isOpponentTurn,
    startNewGame,
    handleCategoryChange,
    toggleMultiplayerMode,
    handleGuess,
    handleInputChange,
    handleSubmitGuess,
    getCurrentPlayerName,
    cleanup
  };
};
