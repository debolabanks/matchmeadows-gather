
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import GameHeader from "./tic-tac-toe/GameHeader";
import GameBoard from "./tic-tac-toe/GameBoard";
import GameStatus from "./tic-tac-toe/GameStatus";
import ScoreBoard from "./tic-tac-toe/ScoreBoard";
import { checkWinner, checkDraw } from "./tic-tac-toe/gameUtils";
import useGameState from "./tic-tac-toe/useGameState";
import { Badge } from "@/components/ui/badge";

interface GameState {
  contactId?: string;
  contactName?: string;
  multiplayer?: boolean;
}

const TicTacToe = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [contactInfo, setContactInfo] = useState<GameState>({});
  const [isMultiplayerMode, setIsMultiplayerMode] = useState(false);
  
  const {
    board,
    currentPlayer,
    winner,
    isDraw,
    scores,
    opponentMoveTimeout,
    makeMove,
    resetGame,
    setUseAI
  } = useGameState();
  
  useEffect(() => {
    // Get the contact info from location state
    if (location.state) {
      const { contactId, contactName, multiplayer } = location.state as GameState;
      setContactInfo({ contactId, contactName, multiplayer });
      
      // If we have contact info and multiplayer flag, enable multiplayer mode
      if (contactName && multiplayer) {
        setIsMultiplayerMode(true);
        // Disable AI opponent when in multiplayer mode with a real user
        setUseAI(false);
      }
    }
  }, [location.state, setUseAI]);

  const handleBackToGames = () => {
    // Clear any pending timeouts when navigating away
    if (opponentMoveTimeout) {
      clearTimeout(opponentMoveTimeout);
    }
    
    navigate("/games", { 
      state: contactInfo.contactId ? { 
        contactId: contactInfo.contactId,
        contactName: contactInfo.contactName 
      } : undefined
    });
  };

  const toggleMultiplayerMode = () => {
    const newMode = !isMultiplayerMode;
    setIsMultiplayerMode(newMode);
    setUseAI(!newMode);
    resetGame();
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
        <GameHeader contactName={contactInfo.contactName} />
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMultiplayerMode}
            className="flex items-center gap-1"
          >
            <Users className="h-4 w-4" />
            {isMultiplayerMode ? "Multiplayer Mode" : "Single Player Mode"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetGame}
          >
            New Game
          </Button>
        </div>
        
        {isMultiplayerMode && contactInfo.contactName && (
          <div className="bg-accent/20 p-2 rounded-md text-center text-sm mb-4">
            <span className="font-medium">Playing with: </span>
            {contactInfo.contactName}
            <Badge variant="secondary" className="ml-2 flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span className="text-xs">Multiplayer</span>
            </Badge>
          </div>
        )}
        
        <GameStatus 
          winner={winner} 
          isDraw={isDraw} 
          currentPlayer={currentPlayer} 
          contactName={contactInfo.contactName}
          onResetGame={resetGame}
          isMultiplayerMode={isMultiplayerMode}
        />
        
        <ScoreBoard
          playerScore={scores.player}
          opponentScore={scores.opponent}
          draws={scores.draws}
          contactName={contactInfo.contactName}
        />
        
        <GameBoard
          board={board}
          onMakeMove={makeMove}
          winner={winner}
          isDraw={isDraw}
          currentPlayer={currentPlayer}
          contactName={contactInfo.contactName || "Opponent"}
          isMultiplayerMode={isMultiplayerMode}
        />
      </Card>
    </div>
  );
};

export default TicTacToe;
