
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { checkSubscription } from "@/services/stripeService";
import { useSearchParams } from "react-router-dom";

export const useSubscription = () => {
  const { user, updateProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [isInFreeTrial, setIsInFreeTrial] = useState(false);
  const [freeTrialEndDate, setFreeTrialEndDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    const plan = searchParams.get("plan");
    const trial = searchParams.get("trial");

    if (success === "true" && plan) {
      toast({
        title: "Subscription Successful",
        description: `You have successfully subscribed to the ${plan} plan.`,
      });
    } else if (canceled === "true") {
      toast({
        title: "Subscription Canceled",
        description: "Your subscription process was canceled.",
      });
    } else if (trial === "start" && user) {
      startFreeTrial();
    }

    const fetchSubscriptionStatus = async () => {
      try {
        setIsLoading(true);
        const { isSubscribed, plan } = await checkSubscription();
        setIsSubscribed(isSubscribed);
        setSubscriptionPlan(plan);

        if (user?.profile?.trialStartDate) {
          const trialStart = new Date(user.profile.trialStartDate);
          const trialEnd = new Date(trialStart.getTime() + 7 * 24 * 60 * 60 * 1000);
          const now = new Date();
          
          if (now < trialEnd) {
            setIsInFreeTrial(true);
            setFreeTrialEndDate(trialEnd);
          }
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchSubscriptionStatus();
    } else {
      setIsLoading(false);
    }
  }, [user, searchParams, toast, updateProfile]);

  const startFreeTrial = async () => {
    if (!user) return;
    
    const now = new Date().toISOString();
    
    try {
      await updateProfile({
        freeTrialStartDate: now
      });
      
      toast({
        title: "Free Trial Activated",
        description: "Your 7-day free trial has been activated. Enjoy all premium features!",
      });
      
      setIsInFreeTrial(true);
      const trialEnd = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
      setFreeTrialEndDate(trialEnd);
    } catch (error) {
      console.error("Error activating free trial:", error);
      toast({
        title: "Error",
        description: "Failed to activate your free trial. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    isSubscribed,
    subscriptionPlan,
    isInFreeTrial,
    freeTrialEndDate,
    isLoading,
    startFreeTrial
  };
};
