
import { useState, useCallback, useEffect } from "react";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useToast } from "@/hooks/use-toast";

export const useGameState = (initialBoard = Array(9).fill(null), contactId?: string, gameSessionId?: string) => {
  const [board, setBoard] = useState<(string | null)[]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<"X" | "O" | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [isMultiplayerMode, setIsMultiplayerMode] = useState(Boolean(contactId));
  const { toast } = useToast();
  
  // Initialize WebRTC for multiplayer
  const { 
    gameData, 
    sendGameData, 
    isConnected, 
    callPeer 
  } = useWebRTC({ gameId: gameSessionId });

  // Automatically initiate connection when in multiplayer mode
  useEffect(() => {
    if (contactId && gameSessionId && !isConnected) {
      callPeer(contactId);
    }
  }, [contactId, gameSessionId, isConnected, callPeer]);

  // Process game data received from peer
  useEffect(() => {
    if (gameData.length > 0) {
      const latestData = gameData[gameData.length - 1];
      
      if (latestData.data.type === 'move') {
        const { index, player } = latestData.data;
        
        // Validate and apply opponent's move
        if (player !== currentPlayer && board[index] === null) {
          const newBoard = [...board];
          newBoard[index] = player;
          setBoard(newBoard);
          setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
        }
      } else if (latestData.data.type === 'reset') {
        handleResetGame();
      }
    }
  }, [gameData]); // eslint-disable-line react-hooks/exhaustive-deps

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
    
    // In multiplayer mode, send the move to peer
    if (isMultiplayerMode && contactId) {
      sendGameData({
        type: 'move',
        index,
        player: currentPlayer
      }, contactId);
    }
  }, [board, currentPlayer, winner, isDraw, isMultiplayerMode, contactId, sendGameData, toast]);

  const handleResetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsDraw(false);
    
    // In multiplayer mode, send reset command to peer
    if (isMultiplayerMode && contactId) {
      sendGameData({
        type: 'reset'
      }, contactId);
    }
  }, [isMultiplayerMode, contactId, sendGameData]);

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
