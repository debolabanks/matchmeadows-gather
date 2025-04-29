
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const useSwipeHandling = (hasUnlimitedSwipes: boolean) => {
  const { useSwipe, getSwipesRemaining } = useAuth();
  const [swipesRemaining, setSwipesRemaining] = useState(20);
  const { toast } = useToast();

  const handleSwipe = async (isLike: boolean, id: string, name?: string) => {
    if (!hasUnlimitedSwipes) {
      const result = await useSwipe();
      
      if (!result.success) {
        toast({
          title: "Swipe limit reached",
          description: "You've used all your daily swipes. Upgrade to Premium for unlimited swipes!",
          variant: "destructive",
        });
        return false;
      }
      
      setSwipesRemaining(getSwipesRemaining());
    }

    if (isLike) {
      const isMatch = Math.random() < 0.2;
      if (isMatch) {
        toast({
          title: "It's a match! 💕",
          description: `You and ${name || 'your match'} liked each other.`,
          variant: "default",
        });
      }
    }
    
    return true;
  };

  return {
    swipesRemaining,
    setSwipesRemaining,
    handleSwipe
  };
};
