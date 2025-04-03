
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

// Import our components
import WordDisplay from "./word-guess/WordDisplay";
import GameProgress from "./word-guess/GameProgress";
import LetterInput from "./word-guess/LetterInput";
import LetterKeyboard from "./word-guess/LetterKeyboard";
import GameOverMessage from "./word-guess/GameOverMessage";
import MultiplayerMode from "./word-guess/MultiplayerMode";
import { 
  MAX_WRONG_GUESSES, 
  getRandomWord, 
  checkWin, 
  checkLoss 
} from "./word-guess/gameUtils";

interface GameState {
  contactId?: string;
  contactName?: string;
}

const WordGuess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [contactInfo, setContactInfo] = useState<GameState>({});
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [currentGuess, setCurrentGuess] = useState("");
  
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
    
    // Get the contact info from location state
    if (location.state) {
      const { contactId, contactName } = location.state as GameState;
      setContactInfo({ contactId, contactName });
    }
    
    // Cleanup timeouts on unmount
    return () => {
      if (opponentTimeout) {
        clearTimeout(opponentTimeout);
      }
    };
  }, [location.state]);

  // Start a new game with a random word
  const startNewGame = () => {
    const newWord = getRandomWord();
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
    
    // Convert to uppercase for consistency
    letter = letter.toUpperCase();
    
    // Ignore if already guessed or not a letter
    if (guessedLetters.includes(letter) || !/^[A-Z]$/.test(letter)) return;
    
    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);
    
    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      
      if (checkLoss(newWrongGuesses)) {
        setGameOver(true);
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
      // Check if player won after a correct guess
      if (checkWin(word, newGuessedLetters)) {
        setGameOver(true);
        setGameWon(true);
        
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
        // Random letter selection strategy
        const randomIndex = Math.floor(Math.random() * remainingLetters.length);
        const opponentGuess = remainingLetters[randomIndex];
        
        const newGuessedLetters = [...currentGuessedLetters, opponentGuess];
        setGuessedLetters(newGuessedLetters);
        
        if (!word.includes(opponentGuess)) {
          setIsOpponentTurn(false); // Back to player's turn
        } else {
          // If opponent guessed correctly, check win and maybe guess again
          if (checkWin(word, newGuessedLetters)) {
            setGameOver(true);
            setGameWon(false);
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

  // Navigate back to games page
  const handleBackToGames = () => {
    if (opponentTimeout) {
      clearTimeout(opponentTimeout);
    }
    
    navigate("/games", { 
      state: contactInfo.contactId ? { 
        contactId: contactInfo.contactId,
        contactName: contactInfo.contactName 
      } : undefined
    });
  };

  // Get the current player name based on turn
  const getCurrentPlayerName = () => {
    if (isMultiplayer) {
      return playerTurn === 1 ? "Player 1" : "Player 2";
    } else {
      return isOpponentTurn ? (contactInfo.contactName || "Opponent") : "You";
    }
  };

  return (
    <div className="container py-6 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBackToGames}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Word Guess
          {contactInfo.contactName && !isMultiplayer && (
            <span className="text-xl font-normal text-muted-foreground ml-2">
              with {contactInfo.contactName}
            </span>
          )}
        </h1>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <MultiplayerMode
            isMultiplayer={isMultiplayer}
            onToggleMode={toggleMultiplayerMode}
            playerTurn={playerTurn}
            player1Name="Player 1"
            player2Name={isMultiplayer ? "Player 2" : contactInfo.contactName || "Opponent"}
          />
          <Button 
            onClick={startNewGame} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            New Game
          </Button>
        </div>
        
        {isMultiplayer && (
          <div className="bg-accent/20 rounded-md p-4 mb-4">
            <h3 className="text-center mb-2 font-medium">Score</h3>
            <div className="flex justify-around items-center">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Player 1</div>
                <div className="text-3xl font-bold">{player1Score}</div>
              </div>
              <div className="text-xl font-bold">-</div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  {isMultiplayer ? "Player 2" : contactInfo.contactName || "Opponent"}
                </div>
                <div className="text-3xl font-bold">{player2Score}</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-4 text-lg font-medium">
          {gameOver 
            ? gameWon 
              ? `${isMultiplayer ? (playerTurn === 1 ? "Player 1" : "Player 2") : "You"} won!` 
              : `${isMultiplayer ? (playerTurn === 1 ? "Player 1" : "Player 2") : contactInfo.contactName || "Opponent"} won!`
            : `${getCurrentPlayerName()}'s turn`}
        </div>
        
        <WordDisplay word={word} guessedLetters={guessedLetters} />
        
        <GameProgress wrongGuesses={wrongGuesses} maxWrongGuesses={MAX_WRONG_GUESSES} />
        
        <LetterInput
          currentGuess={currentGuess}
          onChange={handleInputChange}
          onSubmit={handleSubmitGuess}
          disabled={gameOver || (!isMultiplayer && isOpponentTurn)}
        />
        
        <LetterKeyboard
          guessedLetters={guessedLetters}
          onLetterClick={handleGuess}
          disabled={gameOver || (!isMultiplayer && isOpponentTurn)}
        />
        
        {gameOver && (
          <GameOverMessage
            gameWon={gameWon}
            word={word}
            onPlayAgain={startNewGame}
          />
        )}
      </Card>
    </div>
  );
};

export default WordGuess;
