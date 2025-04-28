
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SubscriptionPlans from "@/components/SubscriptionPlans";

interface SubscriptionContentProps {
  isSubscribed: boolean;
  subscriptionPlan: string | null;
  isInFreeTrial: boolean;
  freeTrialEndDate: Date | null;
  startFreeTrial: () => void;
}

export const SubscriptionContent = ({
  isSubscribed,
  subscriptionPlan,
  isInFreeTrial,
  freeTrialEndDate,
  startFreeTrial
}: SubscriptionContentProps) => {
  if (isSubscribed) {
    return (
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
    );
  }

  if (!isInFreeTrial) {
    return (
      <div className="space-y-8">
        <Card className="p-8 text-center bg-primary/5 border-primary/20">
          <h2 className="text-2xl font-bold mb-4">Try Premium Free for 7 Days</h2>
          <p className="mb-6">
            Get unlimited swipes, Go Live streaming, and all premium features free for 7 days.
            No payment method required!
          </p>
          <Button onClick={startFreeTrial}>
            Start Free Trial
          </Button>
        </Card>
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">Or choose a plan below</h3>
          <SubscriptionPlans />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Card className="p-8 text-center mb-6">
        <h2 className="text-2xl font-bold mb-4">Your Free Trial is Active!</h2>
        <p className="mb-4">
          You're currently enjoying all premium features. Your trial will end on {freeTrialEndDate?.toLocaleDateString()}.
        </p>
        <p className="mb-6">
          Subscribe now to continue enjoying premium features after your trial ends.
        </p>
      </Card>
      <SubscriptionPlans />
    </div>
  );
};
