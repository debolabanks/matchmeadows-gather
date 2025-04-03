
import React from "react";

interface GameHeaderProps {
  contactName?: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({ contactName }) => {
  return (
    <h1 className="text-2xl font-bold">
      Tic Tac Toe
      {contactName && (
        <span className="text-xl font-normal text-muted-foreground ml-2">
          with {contactName}
        </span>
      )}
    </h1>
  );
};

export default GameHeader;
