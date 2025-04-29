import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Calendar, Award, User } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Match } from "@/types/match";
import MatchCardActions from "./MatchCardActions";

interface MatchCardProps {
  match: Match;
  onChatClick?: (matchId: string) => void;
  onVideoClick?: (matchId: string) => void;
  onBlockUser?: (matchId: string, name: string) => void;
}

const MatchCard = ({ match, onChatClick, onVideoClick, onBlockUser }: MatchCardProps) => {
  const [showActions, setShowActions] = useState(false);
  
  const formattedMatchDate = formatDistanceToNow(parseISO(match.matchDate), { 
    addSuffix: true 
  });
  
  const formattedLastActive = formatDistanceToNow(parseISO(match.lastActive), {
    addSuffix: true
  });

  const getCompatibilityInsights = () => {
    const score = match.compatibilityScore || 0;
    
    if (match.aiCompatibility) {
      return (
        <div className="text-sm text-muted-foreground mt-2">
          <p className="font-medium text-primary">Match Insights:</p>
          <p className="mt-1">{match.aiCompatibility.suggestion || "You seem to have common interests!"}</p>
          {match.aiCompatibility.strengths && match.aiCompatibility.strengths.length > 0 && (
            <div className="mt-1">
              <span className="font-medium text-green-600">Strengths: </span>
              {match.aiCompatibility.strengths.join(', ')}
            </div>
          )}
          {match.aiCompatibility.weaknesses && match.aiCompatibility.weaknesses.length > 0 && (
            <div className="mt-1">
              <span className="font-medium text-amber-600">Areas to explore: </span>
              {match.aiCompatibility.weaknesses.join(', ')}
            </div>
          )}
        </div>
      );
    } else {
      if (score >= 90) {
        return (
          <div className="text-sm text-muted-foreground mt-2">
            <p className="font-medium text-primary">Match Insights:</p>
            <p className="mt-1">You two have exceptional compatibility! Perfect match potential.</p>
            <div className="mt-1">
              <span className="font-medium text-green-600">Strengths: </span>
              Shared interests, values, and communication style
            </div>
          </div>
        );
      } else if (score >= 70) {
        return (
          <div className="text-sm text-muted-foreground mt-2">
            <p className="font-medium text-primary">Match Insights:</p>
            <p className="mt-1">You have strong compatibility. Great conversation potential!</p>
            <div className="mt-1">
              <span className="font-medium text-green-600">Strengths: </span>
              Similar interests and complementary personalities
            </div>
            <div className="mt-1">
              <span className="font-medium text-amber-600">Areas to explore: </span>
              Different activity preferences
            </div>
          </div>
        );
      } else if (score >= 50) {
        return (
          <div className="text-sm text-muted-foreground mt-2">
            <p className="font-medium text-primary">Match Insights:</p>
            <p className="mt-1">You have decent compatibility. Worth getting to know each other!</p>
          </div>
        );
      }
      return null;
    }
  };
  
  const handleChatClick = () => {
    if (onChatClick) {
      onChatClick(match.id);
    }
  };
  
  const handleVideoClick = () => {
    if (onVideoClick) {
      onVideoClick(match.id);
    }
  };

  const getScoreColor = () => {
    const score = match.compatibilityScore || 0;
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-500";
    return "text-muted-foreground";
  };

  return (
    <Card 
      className="relative w-full shadow-sm hover:shadow-md transition-shadow duration-200"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={match.imageUrl} alt={match.name} />
              <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{match.name}</h3>
              <div className="flex items-center text-xs text-muted-foreground space-x-2">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Matched {formattedMatchDate}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <Badge variant={match.hasUnreadMessage ? "default" : "outline"} className="text-xs">
              {match.hasUnreadMessage ? "New message" : "Active"}
            </Badge>
            
            <div className={`mt-1 text-sm font-medium flex items-center ${getScoreColor()}`}>
              <Award className="h-4 w-4 mr-1" />
              {match.compatibilityScore || 0}% Match
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-2">
        <div className="text-xs text-muted-foreground">
          <span>Last active {formattedLastActive}</span>
        </div>
        
        {getCompatibilityInsights()}
      </CardContent>

      <CardFooter className="pt-2 flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleChatClick}
          className="flex-1 mr-2"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Chat
        </Button>
        
        <Link to={`/profile/${match.matchedUserId}`} className="flex-1">
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
        </Link>
      </CardFooter>
      
      {showActions && (
        <div className="absolute top-2 right-2">
          <MatchCardActions match={match} onBlockUser={onBlockUser} />
        </div>
      )}
    </Card>
  );
};

export default MatchCard;
