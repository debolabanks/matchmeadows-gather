import React, { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowRight, ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createSubscriptionCheckout, PAYSTACK_PLANS, PaystackSubscriptionPlan } from "@/services/paystackService";

interface PlanProps {
  title: string;
  planCode: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  onSubscribe: () => void;
  popular?: boolean;
  isLoading?: boolean;
}

const Plan = ({ 
  title, 
  planCode, 
  price, 
  period, 
  description, 
  features, 
  onSubscribe, 
  popular, 
  isLoading 
}: PlanProps) => (
  <Card className={`w-full max-w-sm mx-auto ${popular ? 'border-primary shadow-lg' : ''}`}>
    <CardHeader>
      {popular && (
        <div className="py-1 px-3 bg-primary text-primary-foreground text-xs font-medium rounded-full w-fit mb-2">
          Most Popular
        </div>
      )}
      <CardTitle className="text-xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="mb-4">
        <span className="text-3xl font-bold">₦{(price / 100).toFixed(2)}</span>
        <span className="text-muted-foreground">/{period}</span>
      </div>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center">
            <Check className="h-4 w-4 mr-2 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button 
        onClick={onSubscribe} 
        className="w-full" 
        variant={popular ? "default" : "outline"}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Subscribe
          </>
        )}
      </Button>
    </CardFooter>
  </Card>
);

const SubscriptionPlans = () => {
  const planContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const totalPlans = PAYSTACK_PLANS.length;
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (plan: PaystackSubscriptionPlan) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe",
        variant: "destructive",
      });
      navigate("/sign-in", { state: { from: "/subscription" } });
      return;
    }
    
    try {
      setLoadingPlan(plan.id);
      const { authorizationUrl } = await createSubscriptionCheckout(plan.id);
      
      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (planContainerRef.current) {
      const container = planContainerRef.current;
      const scrollAmount = container.clientWidth;
      
      if (direction === "left" && currentIndex > 0) {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        setCurrentIndex(currentIndex - 1);
      } else if (direction === "right" && currentIndex < totalPlans - 1) {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    
    if (diff > threshold) {
      scroll("right");
    } else if (diff < -threshold) {
      scroll("left");
    }
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-center mb-8">Choose Your Subscription Plan</h2>
      
      <div className="relative max-w-4xl mx-auto px-4">
        <div className="hidden md:flex absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-background shadow-md"
            onClick={() => scroll("left")}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <div 
          ref={planContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide hide-scrollbar pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {PAYSTACK_PLANS.map((plan, index) => (
            <div key={plan.id} className="flex-shrink-0 w-full snap-center px-4 md:w-1/3">
              <Plan
                title={plan.name}
                planCode={plan.planCode}
                price={plan.amount}
                period={plan.interval}
                description={
                  plan.interval === "monthly" 
                    ? "Flexible monthly billing" 
                    : plan.interval === "biannual" 
                    ? "Save 7% compared to monthly" 
                    : "Save 16% compared to monthly"
                }
                features={plan.features}
                onSubscribe={() => handleSubscribe(plan)}
                popular={index === 1}
                isLoading={loadingPlan === plan.id}
              />
            </div>
          ))}
        </div>
        
        <div className="hidden md:flex absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-background shadow-md"
            onClick={() => scroll("right")}
            disabled={currentIndex === totalPlans - 1}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: totalPlans }).map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${currentIndex === index ? 'bg-primary' : 'bg-muted'}`}
            onClick={() => {
              setCurrentIndex(index);
              if (planContainerRef.current) {
                const container = planContainerRef.current;
                const scrollAmount = container.clientWidth * index;
                container.scrollTo({ left: scrollAmount, behavior: "smooth" });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
