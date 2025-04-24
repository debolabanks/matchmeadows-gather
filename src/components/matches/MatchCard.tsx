
import { Match } from "@/types/match";
import { MessageSquare, Star, Ban, Flag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MatchScore from "@/components/MatchScore";
import AIMatchInsight from "@/components/AIMatchInsight";
import ReportDialog from "@/components/ReportDialog";
import MatchCardActions from "./MatchCardActions";
import { useState } from "react";

interface MatchCardProps {
  match: Match;
  onBlockUser: (id: string, name: string) => void;
}

const MatchCard = ({ match, onBlockUser }: MatchCardProps) => {
  const [expandedInsight, setExpandedInsight] = useState(false);
  
  const toggleInsight = () => {
    setExpandedInsight(!expandedInsight);
  };

  return (
    <div className="bg-card rounded-xl shadow-sm overflow-hidden border border-border hover:shadow-md transition-shadow">
      <div className="relative h-40">
        <img
          src={match.imageUrl}
          alt={`${match.name}'s profile`}
          className="w-full h-full object-cover"
        />
        {match.hasUnreadMessage && (
          <div className="absolute top-2 right-2 bg-love-500 rounded-full h-3 w-3"></div>
        )}
        
        {match.aiCompatibility && (
          <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Sparkles className="h-3 w-3 mr-1 text-amber-400" />
            {match.aiCompatibility.score}% match
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex gap-1">
          <ReportDialog 
            reportType="profile" 
            targetId={match.id}
            targetName={match.name}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full bg-black/40 text-white hover:bg-black/60"
            >
              <Flag className="h-3 w-3" />
              <span className="sr-only">Report {match.name}</span>
            </Button>
          </ReportDialog>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{match.name}</h3>
          <span className="text-xs text-muted-foreground">
            {match.matchDate}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-2">
          Active {match.lastActive}
        </p>
        
        {match.aiCompatibility && (
          <div 
            className="mb-3 cursor-pointer" 
            onClick={toggleInsight}
          >
            {expandedInsight ? (
              <AIMatchInsight 
                score={match.aiCompatibility.score}
                insights={match.aiCompatibility.insights}
                commonInterests={match.aiCompatibility.commonInterests}
                compatibilityReasons={match.aiCompatibility.compatibilityReasons}
              />
            ) : (
              <div className="flex items-center justify-between">
                <AIMatchInsight 
                  score={match.aiCompatibility.score}
                  insights={match.aiCompatibility.insights}
                  commonInterests={match.aiCompatibility.commonInterests}
                  compatibilityReasons={match.aiCompatibility.compatibilityReasons}
                  compact
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs text-muted-foreground"
                >
                  Details
                </Button>
              </div>
            )}
          </div>
        )}
        
        {match.score && (
          <div className="mb-3">
            <MatchScore score={match.score} compact />
          </div>
        )}
        
        <MatchCardActions match={match} onBlockUser={onBlockUser} />
      </div>
    </div>
  );
};

export default MatchCard;
