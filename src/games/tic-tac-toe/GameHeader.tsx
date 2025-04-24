
import React from "react";

export interface GameHeaderProps {
  title?: string;
  subtitle?: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({ title = "Game", subtitle }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

export default GameHeader;
