
import React from "react";

interface GameHeaderProps {
  gameTitle: string;
  gameSubtitle?: string;
  contactName?: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({ gameTitle, gameSubtitle, contactName }) => {
  return (
    <h1 className="text-2xl font-bold">
      {gameTitle}
      {gameSubtitle && (
        <span className="text-xl font-normal text-muted-foreground ml-2">
          {gameSubtitle}
        </span>
      )}
      {contactName && (
        <span className="text-xl font-normal text-muted-foreground ml-2">
          with {contactName}
        </span>
      )}
    </h1>
  );
};

export default GameHeader;
