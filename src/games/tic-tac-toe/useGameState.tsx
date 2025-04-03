
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Board, Player, initialBoard, checkWinner, checkDraw } from "./gameUtils";
import { 
  playCorrectSound, 
  playWrongSound, 
  playWinSound, 
  playLoseSound, 
  playDrawSound,
  playGameStartSound,
  playClickSound
} from "../utils/gameSounds";

const useGameState = () => {
  const { toast } = useToast();
  const [board, setBoard] = useState<Board>(initialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<Player>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [opponentMoveTimeout, setOpponentMoveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [scores, setScores] = useState({
    player: 0,
    opponent: 0,
    draws: 0
  });
  
  // Play game start sound when component mounts
  useEffect(() => {
    playGameStartSound();
    
    // Clean up timeouts on unmount
    return () => {
      if (opponentMoveTimeout) {
        clearTimeout(opponentMoveTimeout);
      }
    };
  }, [opponentMoveTimeout]);

  const makeMove = (row: number, col: number) => {
    // Don't allow moves if there's a winner or it's a draw
    if (winner || isDraw || board[row][col] !== null) return;

    // Don't allow moves if it's the opponent's turn
    if (currentPlayer === "O") return;
    
    // Play click sound
    playClickSound();
    
    const newBoard = [...board.map(r => [...r])];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    
    const gameWinner = checkWinner(newBoard);
    const gameDraw = checkDraw(newBoard);
    
    if (gameWinner) {
      setWinner(gameWinner);
      // Update scores
      if (gameWinner === "X") {
        setScores(prev => ({ ...prev, player: prev.player + 1 }));
        playWinSound();
      } else {
        setScores(prev => ({ ...prev, opponent: prev.opponent + 1 }));
        playLoseSound();
      }
      toast({
        title: "Game Over!",
        description: `${gameWinner === "X" ? "You" : "Opponent"} won the game!`,
        duration: 5000,
      });
      return;
    }
    
    if (gameDraw) {
      setIsDraw(true);
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      playDrawSound();
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
      // Play click sound for opponent
      playClickSound();
      
      // Pick a random available move
      const [row, col] = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      
      const newBoard = [...currentBoard.map(r => [...r])];
      newBoard[row][col] = "O";
      setBoard(newBoard);
      
      const gameWinner = checkWinner(newBoard);
      const gameDraw = checkDraw(newBoard);
      
      if (gameWinner) {
        setWinner(gameWinner);
        // Update scores
        if (gameWinner === "X") {
          setScores(prev => ({ ...prev, player: prev.player + 1 }));
          playWinSound();
        } else {
          setScores(prev => ({ ...prev, opponent: prev.opponent + 1 }));
          playLoseSound();
        }
        toast({
          title: "Game Over!",
          description: `${gameWinner === "X" ? "You" : "Opponent"} won the game!`,
          duration: 5000,
        });
        return;
      }
      
      if (gameDraw) {
        setIsDraw(true);
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
        playDrawSound();
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
    playGameStartSound();
    
    if (opponentMoveTimeout) {
      clearTimeout(opponentMoveTimeout);
      setOpponentMoveTimeout(null);
    }
  };

  return {
    board,
    currentPlayer,
    winner,
    isDraw,
    scores,
    opponentMoveTimeout,
    makeMove,
    resetGame
  };
};

export default useGameState;
