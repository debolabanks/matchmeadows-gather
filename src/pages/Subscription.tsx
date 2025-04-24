
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import ProfileBoost from "@/components/ProfileBoost";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { checkSubscription } from "@/services/stripeService";

const Subscription = () => {
  const { user, updateProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("subscription");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    const plan = searchParams.get("plan");

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
    }
    
    // Check current subscription status
    const fetchSubscriptionStatus = async () => {
      try {
        setIsLoading(true);
        const { isSubscribed, plan } = await checkSubscription();
        setIsSubscribed(isSubscribed);
        setSubscriptionPlan(plan);
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

  // Check if boost params are present and show toast
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="boost">Profile Boost</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subscription" className="animate-in fade-in">
            {isSubscribed ? (
              <Card className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">You're already subscribed!</h2>
                <p className="mb-6">
                  You have full access to all premium features including Go Live streaming, 
                  ad-free browsing, and priority matching with the {subscriptionPlan} plan.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => window.open('https://billing.stripe.com/p/login/test', '_blank')}
                >
                  Manage Subscription
                </Button>
              </Card>
            ) : (
              <SubscriptionPlans />
            )}
          </TabsContent>
          
          <TabsContent value="boost" className="animate-in fade-in">
            <ProfileBoost />
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">All Premium Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4">
              <div className="mb-2 h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="m22 8-6 4 6 4V8Z"></path>
                  <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
                </svg>
              </div>
              <h4 className="font-medium mb-1">Go Live Streaming</h4>
              <p className="text-sm text-muted-foreground">
                Start your own live streams and connect with your followers in real-time
              </p>
            </div>
            
            <div className="p-4">
              <div className="mb-2 h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                  <line x1="2" x2="22" y1="10" y2="10"></line>
                </svg>
              </div>
              <h4 className="font-medium mb-1">Ad-Free Experience</h4>
              <p className="text-sm text-muted-foreground">
                Enjoy browsing without any advertisements or distractions
              </p>
            </div>
            
            <div className="p-4">
              <div className="mb-2 h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"></path>
                  <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                  <circle cx="12" cy="10" r="2"></circle>
                  <line x1="8" x2="8" y1="2" y2="4"></line>
                  <line x1="16" x2="16" y1="2" y2="4"></line>
                </svg>
              </div>
              <h4 className="font-medium mb-1">Priority Matching</h4>
              <p className="text-sm text-muted-foreground">
                Get priority in the matching algorithm and more visibility
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
