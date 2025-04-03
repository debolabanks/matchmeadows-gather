
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import GameOptions from "./rock-paper-scissors/GameOptions";
import GameResult from "./rock-paper-scissors/GameResult";
import ScoreBoard from "./rock-paper-scissors/ScoreBoard";
import GameHeader from "./rock-paper-scissors/GameHeader";
import GameControls from "./rock-paper-scissors/GameControls";
import { useRockPaperScissors, GameOption } from "./rock-paper-scissors/useRockPaperScissors";

interface GameState {
  contactId?: string;
  contactName?: string;
}

const RockPaperScissors = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [contactInfo, setContactInfo] = useState<GameState>({});

  useEffect(() => {
    // Get the contact info from location state
    if (location.state) {
      const { contactId, contactName } = location.state as GameState;
      setContactInfo({ contactId, contactName });
    }
  }, [location.state]);

  const {
    playerChoice,
    opponentChoice,
    result,
    playerScore,
    opponentScore,
    isPlaying,
    handlePlayerChoice,
    resetGame
  } = useRockPaperScissors({ contactName: contactInfo.contactName });

  const handleBackToGames = () => {
    navigate("/games", { 
      state: contactInfo.contactId ? { 
        contactId: contactInfo.contactId,
        contactName: contactInfo.contactName 
      } : undefined
    });
  };

  const handleSelectOption = (option: GameOption) => {
    handlePlayerChoice(option);
  };

  return (
    <div className="container py-6 max-w-lg mx-auto">
      <GameHeader 
        contactName={contactInfo.contactName}
        onBackClick={handleBackToGames}
      />

      <Card className="p-6">
        <GameControls 
          isPlaying={isPlaying}
          onReset={resetGame}
        />
        
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
          onSelectOption={handleSelectOption}
          disabled={isPlaying}
          selectedOption={playerChoice}
        />
      </Card>
    </div>
  );
};

export default RockPaperScissors;
