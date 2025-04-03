
import { MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MatchScore as MatchScoreType } from "@/utils/gamification";
import MatchScore from "@/components/MatchScore";

export interface Match {
  id: string;
  name: string;
  imageUrl: string;
  lastActive: string;
  matchDate: string;
  hasUnreadMessage: boolean;
  score?: MatchScoreType;
  compatibilityPercentage?: number;
}

interface MatchesListProps {
  matches: Match[];
}

const MatchesList = ({ matches }: MatchesListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Matches</h2>
      
      {matches.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No matches yet. Keep swiping!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-card rounded-xl shadow-sm overflow-hidden border border-border hover:shadow-md transition-shadow">
              <div className="relative h-40">
                <img
                  src={match.imageUrl}
                  alt={`${match.name}'s profile`}
                  className="w-full h-full object-cover"
                />
                {match.hasUnreadMessage && (
                  <div className="absolute top-2 right-2 bg-love-500 rounded-full h-3 w-3"></div>
                )}
                
                {match.compatibilityPercentage && (
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
                    {match.compatibilityPercentage}% compatible
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{match.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    Matched {match.matchDate}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  Active {match.lastActive}
                </p>
                
                {match.score && (
                  <div className="mb-3">
                    <MatchScore score={match.score} compact />
                  </div>
                )}
                
                <Link to={`/messages`} state={{ contactId: match.id }}>
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchesList;
