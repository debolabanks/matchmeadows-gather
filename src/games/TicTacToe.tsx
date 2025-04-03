
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import GameHeader from "./tic-tac-toe/GameHeader";
import GameBoard from "./tic-tac-toe/GameBoard";
import GameStatus from "./tic-tac-toe/GameStatus";
import { initialBoard, checkWinner, checkDraw } from "./tic-tac-toe/gameUtils";
import useGameState from "./tic-tac-toe/useGameState";

interface GameState {
  contactId?: string;
  contactName?: string;
}

const TicTacToe = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [contactInfo, setContactInfo] = useState<GameState>({});
  
  const {
    board,
    currentPlayer,
    winner,
    isDraw,
    opponentMoveTimeout,
    makeMove,
    resetGame
  } = useGameState();
  
  useEffect(() => {
    // Get the contact info from location state
    if (location.state) {
      const { contactId, contactName } = location.state as GameState;
      setContactInfo({ contactId, contactName });
    }
  }, [location.state]);

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
        <GameStatus 
          winner={winner} 
          isDraw={isDraw} 
          currentPlayer={currentPlayer} 
          contactName={contactInfo.contactName}
          onResetGame={resetGame}
        />
        
        <GameBoard
          board={board}
          onMakeMove={makeMove}
          winner={winner}
          isDraw={isDraw}
          currentPlayer={currentPlayer}
          contactName={contactInfo.contactName || "Opponent"}
        />
      </Card>
    </div>
  );
};

export default TicTacToe;
