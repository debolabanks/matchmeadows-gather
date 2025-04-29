
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface GameControlsProps {
  isPlaying: boolean;
  onReset: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ isPlaying, onReset }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="text-lg font-medium">
        {isPlaying 
          ? "Waiting for opponent..."
          : "Choose your move"}
      </div>
      <Button 
        onClick={onReset} 
        variant="outline" 
        size="sm"
        className="flex items-center gap-1"
      >
        <RefreshCw className="h-4 w-4" />
        Reset Game
      </Button>
    </div>
  );
};

export default GameControls;
