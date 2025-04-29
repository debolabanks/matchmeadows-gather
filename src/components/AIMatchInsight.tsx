
import { Sparkles, Zap, Heart, Globe, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AIMatchInsightProps {
  score: number;
  insights: string[];
  commonInterests: string[];
  compatibilityReasons: string[];
  compact?: boolean;
  personalizedScore?: number;
  crossAppInsights?: string[];
  recommendedActivities?: string[];
}

const AIMatchInsight = ({ 
  score, 
  insights, 
  commonInterests,
  compatibilityReasons,
  compact = false,
  personalizedScore,
  crossAppInsights = [],
  recommendedActivities = []
}: AIMatchInsightProps) => {
  // Determine compatibility level text and color
  const getCompatibilityLevel = (matchScore: number) => {
    if (matchScore >= 90) return { text: "Perfect Match", color: "text-love-600" };
    if (matchScore >= 80) return { text: "Excellent Match", color: "text-love-500" };
    if (matchScore >= 70) return { text: "Great Match", color: "text-amber-500" };
    if (matchScore >= 60) return { text: "Good Match", color: "text-emerald-500" };
    if (matchScore >= 50) return { text: "Potential Match", color: "text-blue-500" };
    return { text: "Average Match", color: "text-slate-500" };
  };
  
  const { text, color } = getCompatibilityLevel(score);
  
  // For personalized score
  const personalizedCompatibility = personalizedScore 
    ? getCompatibilityLevel(personalizedScore) 
    : { text: "", color: "" };
  
  // Display the highest score for the compact view
  const displayScore = personalizedScore ? Math.max(score, personalizedScore) : score;
  const displayText = personalizedScore && personalizedScore > score 
    ? personalizedCompatibility.text 
    : text;
  const displayColor = personalizedScore && personalizedScore > score 
    ? personalizedCompatibility.color 
    : color;
  
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
        <span className={`text-xs font-medium ${displayColor}`}>
          {displayText} • {displayScore}% compatible
        </span>
      </div>
    );
  }
  
  return (
    <TooltipProvider>
      <div className="rounded-lg border p-3 bg-card">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h4 className="font-semibold">AI Match Insights</h4>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground">Compatibility</span>
            <span className={`text-sm font-medium ${color}`}>{score}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-love-500 rounded-full" 
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="text-xs mt-1 text-center font-medium">{text}</p>
        </div>
        
        {personalizedScore && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                <span>Cross-App Compatibility</span>
              </span>
              <span className={`text-sm font-medium ${personalizedCompatibility.color}`}>
                {personalizedScore}%
              </span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full" 
                style={{ width: `${personalizedScore}%` }}
              />
            </div>
            <p className="text-xs mt-1 text-center font-medium">
              {personalizedCompatibility.text}
            </p>
          </div>
        )}
        
        {insights.length > 0 && (
          <div className="mb-3">
            <h5 className="text-xs uppercase text-muted-foreground mb-1.5">Why you match</h5>
            <ul className="space-y-1">
              {insights.map((insight, index) => (
                <li key={index} className="text-xs flex items-start gap-1.5">
                  <Zap className="h-3 w-3 text-amber-500 mt-0.5" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {crossAppInsights.length > 0 && (
          <div className="mb-3">
            <h5 className="text-xs uppercase text-muted-foreground mb-1.5 flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>Cross-App Insights</span>
            </h5>
            <ul className="space-y-1">
              {crossAppInsights.map((insight, index) => (
                <li key={index} className="text-xs flex items-start gap-1.5">
                  <Globe className="h-3 w-3 text-emerald-500 mt-0.5" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {recommendedActivities.length > 0 && (
          <div className="mb-3">
            <h5 className="text-xs uppercase text-muted-foreground mb-1.5 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Recommended Activities</span>
            </h5>
            <ul className="space-y-1">
              {recommendedActivities.map((activity, index) => (
                <li key={index} className="text-xs flex items-start gap-1.5">
                  <Heart className="h-3 w-3 text-love-500 mt-0.5" />
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {commonInterests.length > 0 && (
          <div>
            <h5 className="text-xs uppercase text-muted-foreground mb-1.5">Common interests</h5>
            <div className="flex flex-wrap gap-1">
              {commonInterests.map((interest, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger>
                    <Badge variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">You both like {interest}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default AIMatchInsight;
