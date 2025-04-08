
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface GameState {
  contactId?: string;
  contactName?: string;
}

const GAMES = [
  {
    id: "tic-tac-toe",
    name: "Tic Tac Toe",
    description: "Classic game of X's and O's",
    icon: "🎮",
    comingSoon: false,
    route: "/games/tic-tac-toe"
  },
  {
    id: "word-guess",
    name: "Word Guess",
    description: "Guess the word with hints",
    icon: "🔤",
    comingSoon: false,
    route: "/games/word-guess"
  },
  {
    id: "rock-paper-scissors",
    name: "Rock Paper Scissors",
    description: "Test your luck against your match",
    icon: "✂️",
    comingSoon: false,
    route: "/games/rock-paper-scissors"
  },
  {
    id: "chess",
    name: "Chess",
    description: "Strategic board game",
    icon: "♟️",
    comingSoon: true,
    route: "/games/chess"
  },
  {
    id: "trivia",
    name: "Trivia Challenge",
    description: "Test your knowledge together",
    icon: "🧠",
    comingSoon: true,
    route: "/games/trivia"
  }
];

const Games = () => {
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

  const handleBackToMessages = () => {
    navigate("/messages", { 
      state: contactInfo.contactId ? { contactId: contactInfo.contactId } : undefined
    });
  };

  const handleGameSelect = (game: typeof GAMES[0]) => {
    // If game is coming soon, just log the selection
    if (game.comingSoon) {
      console.log(`Selected game: ${game.id} with contact: ${contactInfo.contactName}`);
      return;
    }
    
    // Navigate to the selected game with contact info
    navigate(game.route, { 
      state: { 
        contactId: contactInfo.contactId,
        contactName: contactInfo.contactName
      } 
    });
  };

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBackToMessages}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Gamepad2 className="h-6 w-6" />
          Games
          {contactInfo.contactName && (
            <span className="text-xl font-normal text-muted-foreground">
              with {contactInfo.contactName}
            </span>
          )}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAMES.map(game => (
          <Card 
            key={game.id}
            className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors ${
              game.comingSoon ? 'opacity-60' : ''
            }`}
            onClick={() => handleGameSelect(game)}
          >
            <div className="flex flex-col items-center text-center p-4">
              <div className="text-4xl mb-2">{game.icon}</div>
              <h3 className="text-lg font-semibold">{game.name}</h3>
              <p className="text-sm text-muted-foreground">{game.description}</p>
              {game.comingSoon && (
                <span className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Coming Soon
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Games;
