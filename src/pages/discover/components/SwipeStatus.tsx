
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Gift } from "lucide-react";
import { User } from "@/contexts/authTypes";
import { getTrialStatus } from "@/hooks/useSwipes";

interface SwipeStatusProps {
  swipesRemaining: number;
  remainingTime: string;
  isPremium: boolean;
  user: User | null;
}

const SwipeStatus = ({ swipesRemaining, remainingTime, isPremium, user }: SwipeStatusProps) => {
  const trialStatus = user ? getTrialStatus(user) : { isActive: false, daysRemaining: 0 };
  
  // Show different UI for users in trial
  if (trialStatus.isActive) {
    return (
      <div className="mb-4 bg-primary/10 p-3 rounded-lg border border-primary/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-full">
            <Gift className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">
              Free trial active - Unlimited swipes
            </p>
            <p className="text-xs text-muted-foreground">
              {trialStatus.daysRemaining > 1 ? 
                `${trialStatus.daysRemaining} days remaining` : 
                "Last day of your trial"}
            </p>
          </div>
        </div>
        
        <Button variant="default" size="sm" asChild>
          <Link to="/subscription">Upgrade Now</Link>
        </Button>
      </div>
    );
  }
  
  // Standard UI for non-trial, non-premium users
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
