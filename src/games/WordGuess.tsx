
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface GameState {
  contactId?: string;
  contactName?: string;
}

// Word list to randomly select from
const WORD_LIST = [
  "DATING", "MATCH", "LOVE", "PARTNER", "COUPLE", 
  "ROMANCE", "HEART", "AFFECTION", "CHEMISTRY", "SOULMATE",
  "DINNER", "CINEMA", "COFFEE", "BEACH", "TRAVEL",
  "FRIEND", "MESSAGE", "PROFILE", "PHOTO", "SMILE"
];

// Maximum number of wrong guesses allowed
const MAX_WRONG_GUESSES = 6;

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
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    const newWord = WORD_LIST[randomIndex];
    setWord(newWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameOver(false);
    setGameWon(false);
    setIsOpponentTurn(false);
    
    if (opponentTimeout) {
      clearTimeout(opponentTimeout);
    }
  };

  // Check if all letters in the word have been guessed
  const checkWin = (word: string, guessedLetters: string[]) => {
    return word.split("").every(letter => guessedLetters.includes(letter));
  };

  // Check if the game is lost
  const checkLoss = (wrongGuesses: number) => {
    return wrongGuesses >= MAX_WRONG_GUESSES;
  };

  // Process a guess
  const handleGuess = (letter: string) => {
    // Ignore if game is over or it's the opponent's turn
    if (gameOver || isOpponentTurn) return;
    
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
          description: `You lost! The word was: ${word}`,
          duration: 5000,
        });
      } else {
        // Switch to opponent's turn after a wrong guess
        setIsOpponentTurn(true);
        simulateOpponentGuess(newGuessedLetters);
      }
    } else {
      // Check if player won after a correct guess
      if (checkWin(word, newGuessedLetters)) {
        setGameOver(true);
        setGameWon(true);
        toast({
          title: "Congratulations!",
          description: "You won the game!",
          duration: 5000,
        });
      }
    }
  };

  // Simulate opponent making a guess
  const simulateOpponentGuess = (currentGuessedLetters: string[]) => {
    const timeout = setTimeout(() => {
      // Find letters not yet guessed
      const remainingLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        .split("")
        .filter(letter => !currentGuessedLetters.includes(letter));
      
      if (remainingLetters.length > 0) {
        // Random letter selection strategy
        // For more challenge, this could be improved with a smarter algorithm
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

  // Display the word with guessed letters shown and others hidden
  const displayWord = word.split("").map((letter, index) => (
    guessedLetters.includes(letter) ? (
      <span key={index} className="text-2xl font-bold mx-1">{letter}</span>
    ) : (
      <span key={index} className="text-2xl font-bold mx-1 border-b-2 border-primary w-6 inline-block text-center">_</span>
    )
  ));

  // Create keyboard for letter selection
  const keyboard = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter => (
    <Button
      key={letter}
      variant="outline"
      className="w-8 h-8 p-0 m-1 text-center"
      disabled={
        guessedLetters.includes(letter) || 
        gameOver || 
        isOpponentTurn
      }
      onClick={() => handleGuess(letter)}
    >
      {letter}
    </Button>
  ));

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
          {contactInfo.contactName && (
            <span className="text-xl font-normal text-muted-foreground ml-2">
              with {contactInfo.contactName}
            </span>
          )}
        </h1>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-medium">
            {gameOver 
              ? gameWon 
                ? "You won!" 
                : `${contactInfo.contactName || "Opponent"} won!`
              : isOpponentTurn 
                ? `${contactInfo.contactName || "Opponent"}'s turn...` 
                : "Your turn"}
          </div>
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
        
        <div className="mb-6 p-4 bg-accent/30 rounded-md text-center">
          {displayWord}
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            Wrong guesses: {wrongGuesses} / {MAX_WRONG_GUESSES}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${(wrongGuesses / MAX_WRONG_GUESSES) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <form onSubmit={handleSubmitGuess} className="mb-6 flex gap-2">
          <Input
            type="text"
            value={currentGuess}
            onChange={handleInputChange}
            maxLength={1}
            placeholder="Type a letter"
            className="w-full"
            disabled={gameOver || isOpponentTurn}
          />
          <Button 
            type="submit" 
            disabled={
              currentGuess.length !== 1 || 
              gameOver || 
              isOpponentTurn ||
              !/^[A-Za-z]$/.test(currentGuess)
            }
          >
            Guess
          </Button>
        </form>
        
        <div className="flex flex-wrap justify-center mb-4">
          {keyboard}
        </div>
        
        {gameOver && (
          <div className="text-center mt-4">
            <p className="text-lg font-medium">
              {gameWon ? "Congratulations! You guessed the word!" : `Game over! The word was: ${word}`}
            </p>
            <Button onClick={startNewGame} className="mt-2">
              Play Again
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WordGuess;
