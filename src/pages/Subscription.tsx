
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { useAuth } from "@/hooks/useAuth";

const Subscription = () => {
  const { user } = useAuth();
  
  // Check if user has a subscription (in a real app, this would come from a subscription service)
  const isSubscribed = user?.profile?.subscriptionStatus === "active";
  
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
        
        {isSubscribed ? (
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">You're already subscribed!</h2>
            <p className="mb-6">
              You have full access to all premium features including Go Live streaming, 
              ad-free browsing, and priority matching.
            </p>
            <Button variant="outline">Manage Subscription</Button>
          </Card>
        ) : (
          <SubscriptionPlans />
        )}
        
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
