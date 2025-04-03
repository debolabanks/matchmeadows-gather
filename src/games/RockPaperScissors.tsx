
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import GameOptions from "./rock-paper-scissors/GameOptions";
import GameResult from "./rock-paper-scissors/GameResult";
import ScoreBoard from "./rock-paper-scissors/ScoreBoard";

interface GameState {
  contactId?: string;
  contactName?: string;
}

type GameOption = "rock" | "paper" | "scissors" | null;

const RockPaperScissors = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [contactInfo, setContactInfo] = useState<GameState>({});
  const [playerChoice, setPlayerChoice] = useState<GameOption>(null);
  const [opponentChoice, setOpponentChoice] = useState<GameOption>(null);
  const [result, setResult] = useState<"win" | "lose" | "draw" | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [opponentTimeout, setOpponentTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
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

  const determineWinner = (player: GameOption, opponent: GameOption): "win" | "lose" | "draw" => {
    if (player === opponent) return "draw";
    
    if (
      (player === "rock" && opponent === "scissors") ||
      (player === "paper" && opponent === "rock") ||
      (player === "scissors" && opponent === "paper")
    ) {
      return "win";
    }
    
    return "lose";
  };

  const handlePlayerChoice = (choice: GameOption) => {
    if (isPlaying || !choice) return;
    
    setIsPlaying(true);
    setPlayerChoice(choice);
    
    // Simulate opponent thinking and choosing
    const timeout = setTimeout(() => {
      const options: GameOption[] = ["rock", "paper", "scissors"];
      const randomChoice = options[Math.floor(Math.random() * options.length)];
      setOpponentChoice(randomChoice);
      
      const gameResult = determineWinner(choice, randomChoice);
      setResult(gameResult);
      
      // Update scores
      if (gameResult === "win") {
        setPlayerScore(prev => prev + 1);
        toast({
          title: "You won!",
          description: `${choice} beats ${randomChoice}`,
          duration: 3000,
        });
      } else if (gameResult === "lose") {
        setOpponentScore(prev => prev + 1);
        toast({
          title: `${contactInfo.contactName || "Opponent"} won!`,
          description: `${randomChoice} beats ${choice}`,
          duration: 3000,
        });
      } else {
        toast({
          title: "It's a draw!",
          description: `Both chose ${choice}`,
          duration: 3000,
        });
      }
      
      // Reset for next round
      setTimeout(() => {
        setIsPlaying(false);
      }, 1500);
      
    }, 1000);
    
    setOpponentTimeout(timeout);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setOpponentChoice(null);
    setResult(null);
    setPlayerScore(0);
    setOpponentScore(0);
    setIsPlaying(false);
    
    if (opponentTimeout) {
      clearTimeout(opponentTimeout);
    }
  };

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
          Rock Paper Scissors
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
            {isPlaying 
              ? "Waiting for opponent..."
              : "Choose your move"}
          </div>
          <Button 
            onClick={resetGame} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Game
          </Button>
        </div>
        
        <ScoreBoard 
          playerScore={playerScore} 
          opponentScore={opponentScore}
          opponentName={contactInfo.contactName}
        />
        
        <GameResult 
          result={result}
          playerChoice={playerChoice}
          opponentChoice={opponentChoice}
          isPlaying={isPlaying}
        />
        
        <GameOptions 
          onSelectOption={handlePlayerChoice}
          disabled={isPlaying}
          selectedOption={playerChoice}
        />
      </Card>
    </div>
  );
};

export default RockPaperScissors;
