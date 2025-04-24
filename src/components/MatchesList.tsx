
import { useState } from "react";
import { Match } from "@/types/match";
import MatchCard from "@/components/matches/MatchCard";
import EmptyMatchesList from "@/components/matches/EmptyMatchesList";
import { toast } from "@/components/ui/use-toast";

interface MatchesListProps {
  matches: Match[];
}

const MatchesList = ({ matches: initialMatches }: MatchesListProps) => {
  const [matches, setMatches] = useState(initialMatches);

  const handleBlockUser = (id: string, name: string) => {
    // Remove the match from the list
    setMatches(matches.filter(match => match.id !== id));
    
    toast({
      title: "User Blocked",
      description: `You have blocked ${name}. They will no longer be able to contact you.`,
    });
    
    // In a real implementation, this would call an API to block the user
  };

  if (matches.length === 0) {
    return <EmptyMatchesList />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map((match) => (
        <MatchCard 
          key={match.id} 
          match={match} 
          onBlockUser={handleBlockUser} 
        />
      ))}
    </div>
  );
};

export default MatchesList;
