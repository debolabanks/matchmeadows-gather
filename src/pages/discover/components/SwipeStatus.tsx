
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface SwipeStatusProps {
  swipesRemaining: number;
  remainingTime: string;
  isPremium: boolean;
}

const SwipeStatus = ({ swipesRemaining, remainingTime, isPremium }: SwipeStatusProps) => {
  return (
    <div className="mb-4 bg-primary-foreground p-3 rounded-lg border flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-full">
          <Clock className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">
            {swipesRemaining === Infinity ? 
              "Unlimited swipes" : 
              `${swipesRemaining} swipe${swipesRemaining !== 1 ? 's' : ''} remaining today`
            }
          </p>
          {!isPremium && remainingTime && swipesRemaining < 20 && (
            <p className="text-xs text-muted-foreground">Resets {remainingTime}</p>
          )}
        </div>
      </div>
      
      {!isPremium && (
        <Button variant="default" size="sm" asChild>
          <Link to="/subscription">Upgrade</Link>
        </Button>
      )}
    </div>
  );
};

export default SwipeStatus;
