
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GameOptions from "./rock-paper-scissors/GameOptions";
import GameResult from "./rock-paper-scissors/GameResult";
import ScoreBoard from "./rock-paper-scissors/ScoreBoard";
import GameHeader from "./rock-paper-scissors/GameHeader";
import GameControls from "./rock-paper-scissors/GameControls";
import WinnerDisplay from "./rock-paper-scissors/WinnerDisplay";
import { useRockPaperScissors, GameOption } from "./rock-paper-scissors/useRockPaperScissors";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GameState {
  contactId?: string;
  contactName?: string;
  multiplayer?: boolean;
}

const RockPaperScissors = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [contactInfo, setContactInfo] = useState<GameState>({});
  const [isMultiplayerMode, setIsMultiplayerMode] = useState(false);

  useEffect(() => {
    // Get the contact info from location state
    if (location.state) {
      const { contactId, contactName, multiplayer } = location.state as GameState;
      setContactInfo({ contactId, contactName, multiplayer });
      
      // Enable multiplayer mode if we have a contact and multiplayer flag
      if (contactName && multiplayer) {
        setIsMultiplayerMode(true);
      }
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
    resetGame,
    setUseAI
  } = useRockPaperScissors({ 
    contactName: contactInfo.contactName,
    isMultiplayer: isMultiplayerMode 
  });

  // When multiplayer mode changes, update AI usage
  useEffect(() => {
    if (setUseAI) {
      setUseAI(!isMultiplayerMode);
    }
  }, [isMultiplayerMode, setUseAI]);

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

  const toggleMultiplayerMode = () => {
    const newMode = !isMultiplayerMode;
    setIsMultiplayerMode(newMode);
    if (setUseAI) {
      setUseAI(!newMode);
    }
    resetGame();
  };

  return (
    <div className="container py-6 max-w-lg mx-auto">
      <GameHeader 
        contactName={contactInfo.contactName}
        onBackClick={handleBackToGames}
      />

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
          
          <GameControls 
            isPlaying={isPlaying}
            onReset={resetGame}
          />
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
        
        <ScoreBoard 
          playerScore={playerScore} 
          opponentScore={opponentScore}
          opponentName={contactInfo.contactName}
        />
        
        {result && (
          <WinnerDisplay 
            result={result}
            opponentName={contactInfo.contactName}
          />
        )}
        
        <GameResult 
          result={result}
          playerChoice={playerChoice}
          opponentChoice={opponentChoice}
          isPlaying={isPlaying}
          isMultiplayer={isMultiplayerMode}
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
