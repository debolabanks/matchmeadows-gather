
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { User } from "@/types/user";
import SwipeStatus from "./SwipeStatus";

interface SubscriptionStatusProps {
  user: User | null;
  isSubscribed: boolean;
  swipesRemaining: number;
  inFreeTrial?: boolean;
  freeTrialEndsAt?: string | null;
}

const SubscriptionStatus = ({ 
  user, 
  isSubscribed, 
  swipesRemaining, 
  inFreeTrial = false,
  freeTrialEndsAt = null 
}: SubscriptionStatusProps) => {
  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
    if (user && user.swipes?.resetAt && !isSubscribed && !inFreeTrial) {
      const resetTime = new Date(user.swipes.resetAt);
      
      const updateTimer = () => {
        const now = new Date();
        if (now >= resetTime) {
          setRemainingTime("");
        } else {
          setRemainingTime(formatDistanceToNow(resetTime, { addSuffix: true }));
        }
      };
      
      updateTimer();
      const interval = setInterval(updateTimer, 60000);
      
      return () => clearInterval(interval);
    }
  }, [user, isSubscribed, inFreeTrial]);

  return (
    <SwipeStatus 
      swipesRemaining={swipesRemaining}
      remainingTime={remainingTime}
      isPremium={isSubscribed}
      inFreeTrial={inFreeTrial}
      freeTrialEndsAt={freeTrialEndsAt}
    />
  );
};

export default SubscriptionStatus;
