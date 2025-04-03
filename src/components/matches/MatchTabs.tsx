
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Sparkles, Globe, Clock } from "lucide-react";
import MatchesList, { Match } from "@/components/MatchesList";

interface MatchTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  matches: Match[];
  aiRecommendations: Match[];
}

const MatchTabs = ({ activeTab, setActiveTab, matches, aiRecommendations }: MatchTabsProps) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
      <TabsList className="grid grid-cols-4">
        <TabsTrigger value="all" className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>All Matches</span>
        </TabsTrigger>
        <TabsTrigger value="ai" className="flex items-center gap-1">
          <Sparkles className="h-4 w-4" />
          <span>AI Recommendations</span>
        </TabsTrigger>
        <TabsTrigger value="personalized" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span>Personalized</span>
        </TabsTrigger>
        <TabsTrigger value="recent" className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>Recent Activity</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <MatchesList matches={matches} />
      </TabsContent>
      
      <TabsContent value="ai">
        <div className="mb-4 bg-amber-50 text-amber-800 rounded-lg p-3 text-sm border border-amber-200">
          <p className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Our AI has analyzed your profile and found these potential matches for you.</span>
          </p>
        </div>
        <MatchesList matches={[...aiRecommendations, ...matches.sort((a, b) => 
          (b.aiCompatibility?.score || 0) - (a.aiCompatibility?.score || 0)
        ).slice(0, 3)]} />
      </TabsContent>
      
      <TabsContent value="personalized">
        <div className="mb-4 bg-emerald-50 text-emerald-800 rounded-lg p-3 text-sm border border-emerald-200">
          <p className="flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-emerald-500" />
            <span>Recommendations based on your activity across our partner apps and websites.</span>
          </p>
        </div>
        <MatchesList matches={[...matches, ...aiRecommendations].sort((a, b) => {
          // Handle potential missing personalizedScore property safely
          const aScore = a.aiCompatibility?.score || 0;
          const bScore = b.aiCompatibility?.score || 0;
          return bScore - aScore;
        })} />
      </TabsContent>
      
      <TabsContent value="recent">
        <MatchesList matches={matches.sort((a, b) => {
          if (a.hasUnreadMessage && !b.hasUnreadMessage) return -1;
          if (!a.hasUnreadMessage && b.hasUnreadMessage) return 1;
          return 0;
        })} />
      </TabsContent>
    </Tabs>
  );
};

export default MatchTabs;
