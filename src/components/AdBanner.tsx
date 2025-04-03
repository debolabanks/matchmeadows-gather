
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

interface AdBannerProps {
  position?: "top" | "bottom" | "sidebar";
  variant?: "small" | "large";
}

const AdBanner = ({ position = "top", variant = "small" }: AdBannerProps) => {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) return null;
  
  if (variant === "small") {
    return (
      <Card className={`relative p-3 mb-4 bg-muted/50 border-dashed ${position === "sidebar" ? "w-full" : "w-full"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-xs bg-muted-foreground/10 px-2 py-1 rounded mr-2">Ad</div>
            <p className="text-sm">Upgrade to Premium for an ad-free experience</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link to="/subscription">Upgrade</Link>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => setDismissed(true)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="relative p-4 mb-6 bg-muted/20 border-dashed overflow-hidden">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 h-6 w-6 bg-background/50" 
        onClick={() => setDismissed(true)}
      >
        <X className="h-3 w-3" />
      </Button>
      
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-2/3">
          <div className="text-xs bg-muted-foreground/10 px-2 py-1 rounded w-fit mb-2">Advertisement</div>
          <h3 className="text-lg font-bold mb-2">Unlock Premium Features</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upgrade to Premium for an ad-free experience, Go Live streaming capabilities, 
            and priority matching. Starting at just $9.99/month.
          </p>
          <Button asChild>
            <Link to="/subscription">Upgrade Now</Link>
          </Button>
        </div>
        
        <div className="w-full md:w-1/3 bg-gradient-to-r from-love-100 to-love-200 rounded-lg p-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-love-600">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
        </div>
      </div>
    </Card>
  );
};

export default AdBanner;
