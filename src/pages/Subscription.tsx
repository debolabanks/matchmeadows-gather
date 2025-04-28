
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { FreeTrialBanner } from "@/components/subscription/FreeTrialBanner";
import { SubscriptionContent } from "@/components/subscription/SubscriptionContent";
import { FeaturesGrid } from "@/components/subscription/FeaturesGrid";
import ProfileBoost from "@/components/ProfileBoost";

const Subscription = () => {
  const [activeTab, setActiveTab] = useState("subscription");
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const {
    isSubscribed,
    subscriptionPlan,
    isInFreeTrial,
    freeTrialEndDate,
    isLoading,
    startFreeTrial
  } = useSubscription();

  useEffect(() => {
    const boostSuccess = searchParams.get("boost_success");
    const boostCanceled = searchParams.get("boost_canceled");
    const duration = searchParams.get("duration");
    
    if (boostSuccess === "true") {
      toast({
        title: "Profile Boost Activated",
        description: `Your profile boost for ${duration} has been activated.`,
      });
      setActiveTab("boost");
    } else if (boostCanceled === "true") {
      toast({
        title: "Boost Canceled",
        description: "Your profile boost process was canceled.",
      });
      setActiveTab("boost");
    }
  }, [searchParams, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 pt-24 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Upgrade Your Experience</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Unlock premium features including Go Live streaming, ad-free browsing, and priority matching.
            Choose the plan that works best for you.
          </p>
        </div>
        
        <FreeTrialBanner 
          isInFreeTrial={isInFreeTrial} 
          freeTrialEndDate={freeTrialEndDate}
          onStartTrial={startFreeTrial}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="subscription" className="whitespace-nowrap px-1">
              Subscription
            </TabsTrigger>
            <TabsTrigger value="boost" className="whitespace-nowrap px-1">
              Profile Boost
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="subscription" className="animate-in fade-in">
            <SubscriptionContent
              isSubscribed={isSubscribed}
              subscriptionPlan={subscriptionPlan}
              isInFreeTrial={isInFreeTrial}
              freeTrialEndDate={freeTrialEndDate}
              startFreeTrial={startFreeTrial}
            />
          </TabsContent>
          
          <TabsContent value="boost" className="animate-in fade-in">
            <ProfileBoost />
          </TabsContent>
        </Tabs>
        
        <FeaturesGrid />
      </div>
    </div>
  );
};

export default Subscription;
