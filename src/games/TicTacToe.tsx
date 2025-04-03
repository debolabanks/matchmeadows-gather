
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

interface GameState {
  contactId?: string;
  contactName?: string;
}

type Player = "X" | "O" | null;
type Board = (Player)[][];

const initialBoard = (): Board => [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

const TicTacToe = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<GameState>({});
  const [board, setBoard] = useState<Board>(initialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<Player>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [opponentMoveTimeout, setOpponentMoveTimeout] = useState<NodeJS.Timeout | null>(null);
  
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

  const checkWinner = (board: Board): Player => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
        return board[i][0];
      }
    }
    
    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
        return board[0][i];
      }
    }
    
    // Check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
      return board[0][0];
    }
    
    if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
      return board[0][2];
    }
    
    return null;
  };

  const checkDraw = (board: Board): boolean => {
    // If there's a winner, it's not a draw
    if (checkWinner(board)) return false;
    
    // Check if all cells are filled
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === null) {
          return false;
        }
      }
    }
    
    return true;
  };

  const makeMove = (row: number, col: number) => {
    // Don't allow moves if there's a winner or it's a draw
    if (winner || isDraw || board[row][col] !== null) return;

    // Don't allow moves if it's the opponent's turn
    if (currentPlayer === "O") return;
    
    const newBoard = [...board.map(r => [...r])];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    
    const gameWinner = checkWinner(newBoard);
    const gameDraw = checkDraw(newBoard);
    
    if (gameWinner) {
      setWinner(gameWinner);
      toast({
        title: "Game Over!",
        description: `${gameWinner === "X" ? "You" : contactInfo.contactName || "Opponent"} won the game!`,
        duration: 5000,
      });
      return;
    }
    
    if (gameDraw) {
      setIsDraw(true);
      toast({
        title: "Game Over!",
        description: "It's a draw!",
        duration: 5000,
      });
      return;
    }
    
    // Switch player
    setCurrentPlayer("O");
    
    // Simulate opponent move after a delay
    const timeout = setTimeout(() => {
      makeOpponentMove(newBoard);
    }, 1000);
    
    setOpponentMoveTimeout(timeout);
  };

  const makeOpponentMove = (currentBoard: Board) => {
    // Find available moves
    const availableMoves: [number, number][] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i][j] === null) {
          availableMoves.push([i, j]);
        }
      }
    }
    
    if (availableMoves.length > 0) {
      // Pick a random available move
      const [row, col] = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      
      const newBoard = [...currentBoard.map(r => [...r])];
      newBoard[row][col] = "O";
      setBoard(newBoard);
      
      const gameWinner = checkWinner(newBoard);
      const gameDraw = checkDraw(newBoard);
      
      if (gameWinner) {
        setWinner(gameWinner);
        toast({
          title: "Game Over!",
          description: `${gameWinner === "X" ? "You" : contactInfo.contactName || "Opponent"} won the game!`,
          duration: 5000,
        });
        return;
      }
      
      if (gameDraw) {
        setIsDraw(true);
        toast({
          title: "Game Over!",
          description: "It's a draw!",
          duration: 5000,
        });
        return;
      }
      
      // Switch back to player
      setCurrentPlayer("X");
    }
  };

  const resetGame = () => {
    setBoard(initialBoard());
    setCurrentPlayer("X");
    setWinner(null);
    setIsDraw(false);
    
    if (opponentMoveTimeout) {
      clearTimeout(opponentMoveTimeout);
      setOpponentMoveTimeout(null);
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
        <h1 className="text-2xl font-bold">
          Tic Tac Toe
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
            {winner 
              ? `Winner: ${winner === "X" ? "You" : contactInfo.contactName || "Opponent"}`
              : isDraw 
                ? "It's a draw!" 
                : `Current Player: ${currentPlayer === "X" ? "You" : contactInfo.contactName || "Opponent"}`}
          </div>
          <Button 
            onClick={resetGame} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            New Game
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          {board.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
              <Button
                key={`${rowIndex}-${colIndex}`}
                variant="outline"
                className="h-24 w-full text-4xl font-bold"
                onClick={() => makeMove(rowIndex, colIndex)}
                disabled={!!winner || isDraw || !!cell || currentPlayer === "O"}
              >
                {cell}
              </Button>
            ))
          )}
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          {currentPlayer === "X" ? "Your turn" : `${contactInfo.contactName || "Opponent"}'s turn`}
        </div>
      </Card>
    </div>
  );
};

export default TicTacToe;
