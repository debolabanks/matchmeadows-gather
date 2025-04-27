
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { User } from "@/types/user";
import SwipeStatus from "./SwipeStatus";

interface SubscriptionStatusProps {
  user: User | null;
  isSubscribed: boolean;
  swipesRemaining: number;
}

const SubscriptionStatus = ({ user, isSubscribed, swipesRemaining }: SubscriptionStatusProps) => {
  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
    if (user && user.swipes?.resetAt && !isSubscribed) {
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
  }, [user, isSubscribed]);

  return (
    <SwipeStatus 
      swipesRemaining={swipesRemaining}
      remainingTime={remainingTime}
      isPremium={isSubscribed}
    />
  );
};

export default SubscriptionStatus;
