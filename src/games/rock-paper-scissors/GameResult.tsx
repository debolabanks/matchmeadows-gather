
import React from "react";

type GameOption = "rock" | "paper" | "scissors" | null;

interface GameResultProps {
  result: "win" | "lose" | "draw" | null;
  playerChoice: GameOption;
  opponentChoice: GameOption;
  isPlaying: boolean;
}

const GameResult = ({ result, playerChoice, opponentChoice, isPlaying }: GameResultProps) => {
  const getEmoji = (choice: GameOption): string => {
    switch (choice) {
      case "rock": return "✊";
      case "paper": return "✋";
      case "scissors": return "✌️";
      default: return "❓";
    }
  };
  
  const getResultMessage = () => {
    if (!result) return "";
    
    switch (result) {
      case "win": return "You win!";
      case "lose": return "You lose!";
      case "draw": return "It's a draw!";
      default: return "";
    }
  };
  
  return (
    <div className="flex flex-col items-center my-6">
      {(playerChoice || opponentChoice) && (
        <>
          <div className="flex justify-around w-full mb-4">
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-2">You</span>
              <div className="text-5xl">
                {playerChoice ? getEmoji(playerChoice) : "❓"}
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-2">VS</span>
              <div className="text-2xl">🆚</div>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-2">Opponent</span>
              <div className="text-5xl">
                {isPlaying && !opponentChoice ? "🤔" : opponentChoice ? getEmoji(opponentChoice) : "❓"}
              </div>
            </div>
          </div>
          
          {result && (
            <div className="mt-4 text-xl font-bold">
              {getResultMessage()}
            </div>
          )}
        </>
      )}
      
      {!playerChoice && !opponentChoice && !isPlaying && (
        <div className="text-center text-lg my-8">
          Select rock, paper, or scissors to start
        </div>
      )}
    </div>
  );
};

export default GameResult;
