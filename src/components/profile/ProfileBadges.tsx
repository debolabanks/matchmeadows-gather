
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { calculateMatchLevel } from "@/utils/gamification";

interface ProfileBadgesProps {
  compatibility?: number;
  matchPoints?: number;
  badges?: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
}

const ProfileBadges = ({ compatibility = 0, matchPoints = 0, badges = [] }: ProfileBadgesProps) => {
  const [level, setLevel] = useState(1);
  const [animatedCompatibility, setAnimatedCompatibility] = useState(0);

  // Calculate level based on match points
  useEffect(() => {
    setLevel(calculateMatchLevel(matchPoints));
  }, [matchPoints]);

  // Animate compatibility score
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedCompatibility(prev => {
        if (prev < compatibility) {
          return Math.min(prev + 2, compatibility);
        }
        return compatibility;
      });
    }, 20);
    
    return () => clearInterval(interval);
  }, [compatibility]);

  // Get compatibility color based on score
  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-emerald-500";
    if (score >= 40) return "text-amber-500";
    if (score >= 20) return "text-orange-500";
    return "text-red-500";
  };

  // Get progress bar color based on compatibility score
  const getProgressBarClassName = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-emerald-500";
    if (score >= 40) return "bg-amber-500";
    if (score >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-2">
      {/* Compatibility score */}
      {compatibility > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <div className={`text-sm font-medium ${getCompatibilityColor(compatibility)}`}>
                  {animatedCompatibility}% Match
                </div>
                <Progress 
                  value={animatedCompatibility} 
                  className={`h-2 w-20 ${getProgressBarClassName(compatibility)}`}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Compatibility score based on shared interests and preferences</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {/* Level badge */}
      {matchPoints > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="bg-amber-500 hover:bg-amber-600 px-2 py-1 flex items-center gap-1">
                <Star className="h-3 w-3 fill-white" />
                <span>Level {level}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Level {level} - {matchPoints} interaction points</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {/* Achievement badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {badges.map(badge => (
            <TooltipProvider key={badge.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="px-2 py-1">
                    <span className="mr-1">{badge.icon}</span>
                    {badge.name}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{badge.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileBadges;
