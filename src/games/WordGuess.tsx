
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";

// Import our components
import WordDisplay from "./word-guess/WordDisplay";
import GameProgress from "./word-guess/GameProgress";
import LetterInput from "./word-guess/LetterInput";
import LetterKeyboard from "./word-guess/LetterKeyboard";
import GameOverMessage from "./word-guess/GameOverMessage";
import MultiplayerMode from "./word-guess/MultiplayerMode";
import CategorySelector from "./word-guess/CategorySelector";
import GameHeader from "./word-guess/GameHeader";
import ScoreDisplay from "./word-guess/ScoreDisplay";
import GameStatus from "./word-guess/GameStatus";
import { useWordGuess } from "./word-guess/useWordGuess";
import { MAX_WRONG_GUESSES, CATEGORY_NAMES } from "./word-guess/gameUtils";

interface GameState {
  contactId?: string;
  contactName?: string;
  multiplayer?: boolean;
}

const WordGuess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [contactInfo, setContactInfo] = useState<GameState>({});
  
  // Initialize contact info from location state
  useEffect(() => {
    if (location.state) {
      const { contactId, contactName, multiplayer } = location.state as GameState;
      setContactInfo({ contactId, contactName, multiplayer });
    }
  }, [location.state]);

  // Use our custom hook
  const gameState = useWordGuess({ contactInfo });
  
  // Navigate back to games page
  const handleBackToGames = () => {
    // Since opponentTimeout is not available directly from gameState, we can call a cleanup function instead
    // or check if the property exists before trying to clear it
    if (gameState.cleanup) {
      gameState.cleanup();
    }
    
    navigate("/games", { 
      state: contactInfo.contactId ? { 
        contactId: contactInfo.contactId,
        contactName: contactInfo.contactName 
      } : undefined
    });
  };

  // Enable multiplayer mode by default if we have a contact
  useEffect(() => {
    if (contactInfo.contactName && contactInfo.multiplayer && !gameState.isMultiplayer) {
      // Add a small delay to ensure the component is fully mounted
      const timer = setTimeout(() => {
        gameState.toggleMultiplayerMode();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [contactInfo.contactName, contactInfo.multiplayer, gameState.isMultiplayer]);

  return (
    <div className="container py-6 max-w-lg mx-auto">
      <GameHeader 
        contactName={contactInfo.contactName} 
        onBackClick={handleBackToGames} 
      />

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <MultiplayerMode
            isMultiplayer={gameState.isMultiplayer}
            onToggleMode={gameState.toggleMultiplayerMode}
            playerTurn={gameState.playerTurn}
            player1Name="You"
            player2Name={gameState.isMultiplayer ? (contactInfo.contactName || "Player 2") : contactInfo.contactName || "Opponent"}
          />
          <Button 
            onClick={gameState.startNewGame} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            New Game
          </Button>
        </div>
        
        <CategorySelector 
          selectedCategory={gameState.selectedCategory}
          onCategoryChange={gameState.handleCategoryChange}
          disabled={!gameState.gameOver && gameState.guessedLetters.length > 0}
        />
        
        <ScoreDisplay 
          player1Score={gameState.player1Score}
          player2Score={gameState.player2Score}
          player2Name={contactInfo.contactName || "Opponent"}
          isMultiplayer={gameState.isMultiplayer}
        />
        
        <GameStatus 
          gameOver={gameState.gameOver}
          gameWon={gameState.gameWon}
          playerName={gameState.getCurrentPlayerName()}
          opponentName={gameState.isMultiplayer ? 
            (gameState.playerTurn === 1 ? (contactInfo.contactName || "Player 2") : "You") : 
            (contactInfo.contactName || "Opponent")}
        />
        
        <WordDisplay 
          word={gameState.word} 
          guessedLetters={gameState.guessedLetters} 
        />
        
        <GameProgress 
          wrongGuesses={gameState.wrongGuesses} 
          maxWrongGuesses={MAX_WRONG_GUESSES} 
        />
        
        <LetterInput
          currentGuess={gameState.currentGuess}
          onChange={gameState.handleInputChange}
          onSubmit={gameState.handleSubmitGuess}
          disabled={gameState.gameOver || (!gameState.isMultiplayer && gameState.isOpponentTurn)}
        />
        
        <LetterKeyboard
          guessedLetters={gameState.guessedLetters}
          onLetterClick={gameState.handleGuess}
          disabled={gameState.gameOver || (!gameState.isMultiplayer && gameState.isOpponentTurn)}
        />
        
        {gameState.gameOver && (
          <GameOverMessage
            gameWon={gameState.gameWon}
            word={gameState.word}
            onPlayAgain={gameState.startNewGame}
          />
        )}
      </Card>
    </div>
  );
};

export default WordGuess;
