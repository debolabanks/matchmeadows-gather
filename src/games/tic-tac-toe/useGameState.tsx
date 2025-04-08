
import { useState, useEffect, useCallback } from "react";

type BoardType = Array<string | null>;
type Player = "X" | "O";

interface Scores {
  player: number;
  opponent: number;
  draws: number;
}

const useGameState = () => {
  const [board, setBoard] = useState<BoardType>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [scores, setScores] = useState<Scores>({
    player: 0,
    opponent: 0,
    draws: 0,
  });
  const [useAI, setUseAI] = useState(true);
  const [opponentMoveTimeout, setOpponentMoveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Check for winner or draw after each move
  useEffect(() => {
    const checkGameStatus = () => {
      // Check for winner
      const winningPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
      ];

      for (const pattern of winningPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          setWinner(board[a] as Player);
          
          // Update scores
          if (board[a] === "X") {
            setScores(prev => ({ ...prev, player: prev.player + 1 }));
          } else {
            setScores(prev => ({ ...prev, opponent: prev.opponent + 1 }));
          }
          
          return;
        }
      }

      // Check for draw
      if (!board.includes(null)) {
        setIsDraw(true);
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      }
    };

    checkGameStatus();
  }, [board]);

  // AI opponent move
  useEffect(() => {
    if (useAI && currentPlayer === "O" && !winner && !isDraw) {
      const timeout = setTimeout(() => {
        makeAIMove();
      }, 1000);
      
      setOpponentMoveTimeout(timeout);
      
      return () => {
        clearTimeout(timeout);
      };
    }
    
    return () => {
      if (opponentMoveTimeout) {
        clearTimeout(opponentMoveTimeout);
      }
    };
  }, [currentPlayer, winner, isDraw, useAI]);

  // Make a move
  const makeMove = (index: number) => {
    // Return early if the cell is already occupied, or if there's a winner or draw
    if (board[index] || winner || isDraw) {
      return;
    }
    
    // Return early if trying to make a move for the AI
    if (useAI && currentPlayer === "O") {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    
    // Switch turns
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  // AI makes a move
  const makeAIMove = () => {
    // If there's a winner or draw, return early
    if (winner || isDraw) {
      return;
    }

    const availableMoves = board
      .map((cell, index) => (cell === null ? index : null))
      .filter((index): index is number => index !== null);

    if (availableMoves.length > 0) {
      // Choose a random move from available moves
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      const selectedMove = availableMoves[randomIndex];
      
      const newBoard = [...board];
      newBoard[selectedMove] = "O";
      setBoard(newBoard);
      
      // Switch turns
      setCurrentPlayer("X");
    }
  };

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setIsDraw(false);
    
    if (opponentMoveTimeout) {
      clearTimeout(opponentMoveTimeout);
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
    resetGame,
    setUseAI
  };
};

export default useGameState;
