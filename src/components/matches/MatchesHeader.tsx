
import { Button } from "@/components/ui/button";
import { Sparkles, Globe } from "lucide-react";

interface MatchesHeaderProps {
  title: string;
}

const MatchesHeader = ({ title }: MatchesHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-1">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>AI Powered</span>
        </Button>
        
        <Button variant="outline" size="sm" className="gap-1">
          <Globe className="h-4 w-4 text-emerald-500" />
          <span>Cross-App Personalization</span>
        </Button>
      </div>
    </div>
  );
};

export default MatchesHeader;
