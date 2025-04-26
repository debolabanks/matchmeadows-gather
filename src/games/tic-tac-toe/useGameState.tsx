
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { connectToRoom } from "@/services/twilio";

export const useGameState = (initialBoard = Array(9).fill(null), contactId?: string, gameSessionId?: string) => {
  const [board, setBoard] = useState<(string | null)[]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<"X" | "O" | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [isMultiplayerMode, setIsMultiplayerMode] = useState(Boolean(contactId));
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // Initialize connection when in multiplayer mode
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const initializeMultiplayer = async () => {
      if (contactId && gameSessionId) {
        try {
          const room = await connectToRoom({
            name: gameSessionId,
            audio: true,
            video: true
          });

          setIsConnected(true);
          
          cleanup = () => {
            room.disconnect();
            setIsConnected(false);
          };
        } catch (err) {
          console.error("Could not connect to game room:", err);
          toast({
            title: "Connection failed",
            description: "Could not connect to multiplayer room",
            variant: "destructive"
          });
        }
      }
    };

    if (isMultiplayerMode) {
      initializeMultiplayer();
    }

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [contactId, gameSessionId, isMultiplayerMode, toast]);

  // Check for winner or draw
  useEffect(() => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    
    // Check for winner
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a] as "X" | "O");
        setScores(prev => ({ ...prev, [board[a] as "X" | "O"]: prev[board[a] as "X" | "O"] + 1 }));
        return;
      }
    }
    
    // Check for draw
    if (!board.includes(null)) {
      setIsDraw(true);
    }
  }, [board]);

  const handleSquareClick = useCallback((index: number) => {
    // Don't allow clicks if there's a winner or it's a draw
    if (winner || isDraw || board[index]) {
      return;
    }
    
    // In multiplayer, only allow moves on your turn
    if (isMultiplayerMode && (
      (contactId && currentPlayer === "O") || 
      (!contactId && currentPlayer === "X")
    )) {
      toast({
        title: "Not your turn",
        description: "Please wait for your opponent's move",
        variant: "default"
      });
      return;
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  }, [board, currentPlayer, winner, isDraw, isMultiplayerMode, contactId, toast]);

  const handleResetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsDraw(false);
  }, []);

  return {
    board,
    currentPlayer,
    winner,
    isDraw,
    scores,
    isMultiplayerMode,
    isConnected,
    handleSquareClick,
    handleResetGame,
    setIsMultiplayerMode
  };
};

export default useGameState;
