
import { MessageSquare, Star, Ban, Flag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MatchScore as MatchScoreType } from "@/utils/gamification";
import MatchScore from "@/components/MatchScore";
import AIMatchInsight from "@/components/AIMatchInsight";
import ReportDialog from "@/components/ReportDialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export interface Match {
  id: string;
  name: string;
  imageUrl: string;
  lastActive: string;
  matchDate: string;
  hasUnreadMessage: boolean;
  score?: MatchScoreType;
  compatibilityPercentage?: number;
  aiCompatibility?: {
    score: number;
    insights: string[];
    commonInterests: string[];
    compatibilityReasons: string[];
  };
}

interface MatchesListProps {
  matches: Match[];
}

const MatchesList = ({ matches: initialMatches }: MatchesListProps) => {
  const [matches, setMatches] = useState(initialMatches);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  const handleBlockUser = (id: string, name: string) => {
    // Remove the match from the list
    setMatches(matches.filter(match => match.id !== id));
    
    toast({
      title: "User Blocked",
      description: `You have blocked ${name}. They will no longer be able to contact you.`,
    });
    
    // In a real implementation, this would call an API to block the user
  };

  const toggleInsight = (id: string) => {
    setExpandedInsight(expandedInsight === id ? null : id);
  };

  return (
    <div className="space-y-4">
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
                    onClick={() => toggleInsight(match.id)}
                  >
                    {expandedInsight === match.id ? (
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
                
                <div className="flex gap-2">
                  <Link to={`/messages`} state={{ contactId: match.id }} className="flex-1">
                    <Button className="w-full" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </Link>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="h-10 w-10">
                        <Ban className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Block {match.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will prevent {match.name} from seeing your profile or contacting you. 
                          You won't see their profile anymore either.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleBlockUser(match.id, match.name)}>
                          Block User
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchesList;
