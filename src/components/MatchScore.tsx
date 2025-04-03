
import { MatchScore as MatchScoreType } from "@/utils/gamification";
import { Star, Award, Zap, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MatchScoreProps {
  score: MatchScoreType;
  compact?: boolean;
}

const MatchScore = ({ score, compact = false }: MatchScoreProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        <span className="text-sm font-medium">Lvl {score.level}</span>
        {score.badges.length > 0 && (
          <span className="text-xs text-muted-foreground">{score.badges.length} badges</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20">
            <Trophy className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <h4 className="font-semibold">Level {score.level}</h4>
            <p className="text-xs text-muted-foreground">{score.points} points</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
          <Zap className="h-3 w-3 text-yellow-500" />
          <span className="text-xs font-medium">{score.streak} day streak</span>
        </div>
      </div>
      
      {score.badges.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Badges earned:</p>
          <div className="flex flex-wrap gap-1">
            <TooltipProvider>
              {score.badges.map(badge => (
                <Tooltip key={badge.id}>
                  <TooltipTrigger>
                    <Badge variant="outline" className="px-2 py-1">
                      <span className="mr-1">{badge.icon}</span>
                      {badge.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">{badge.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchScore;
