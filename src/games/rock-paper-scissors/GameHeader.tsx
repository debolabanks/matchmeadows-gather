
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface GameHeaderProps {
  contactName?: string;
  onBackClick: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ contactName, onBackClick }) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onBackClick}
        className="h-8 w-8"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-2xl font-bold">
        Rock Paper Scissors
        {contactName && (
          <span className="text-xl font-normal text-muted-foreground ml-2">
            with {contactName}
          </span>
        )}
      </h1>
    </div>
  );
};

export default GameHeader;
