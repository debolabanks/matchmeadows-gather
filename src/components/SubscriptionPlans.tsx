
import React, { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowRight, ArrowLeft, CreditCard } from "lucide-react";

interface PlanProps {
  title: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  onSubscribe: () => void;
  popular?: boolean;
}

const Plan = ({ title, price, period, description, features, onSubscribe, popular }: PlanProps) => (
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
        <span className="text-3xl font-bold">${price}</span>
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
      <Button onClick={onSubscribe} className="w-full" variant={popular ? "default" : "outline"}>
        <CreditCard className="mr-2 h-4 w-4" />
        Subscribe
      </Button>
    </CardFooter>
  </Card>
);

const SubscriptionPlans = () => {
  const planContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const totalPlans = 3;
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubscribe = (plan: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Subscription",
      description: `Thank you for choosing the ${plan} plan. This is a demo - real payment would be processed here.`,
    });
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

  // Handle touch events for swipe
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
    const threshold = 50; // Minimum difference to trigger swipe
    
    if (diff > threshold) {
      // Swipe left to right
      scroll("right");
    } else if (diff < -threshold) {
      // Swipe right to left
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
          <div className="flex-shrink-0 w-full snap-center px-4 md:w-1/3">
            <Plan
              title="Monthly"
              price={9.99}
              period="month"
              description="Flexible monthly billing"
              features={[
                "Go Live Streaming",
                "Ad-free browsing",
                "Priority matching",
                "Exclusive features"
              ]}
              onSubscribe={() => handleSubscribe("Monthly")}
            />
          </div>
          
          <div className="flex-shrink-0 w-full snap-center px-4 md:w-1/3">
            <Plan
              title="Bi-Annual"
              price={55.99}
              period="6 months"
              description="Save 7% compared to monthly"
              features={[
                "Go Live Streaming",
                "Ad-free browsing",
                "Priority matching",
                "Exclusive features",
                "Profile highlighting"
              ]}
              onSubscribe={() => handleSubscribe("Bi-Annual")}
              popular={true}
            />
          </div>
          
          <div className="flex-shrink-0 w-full snap-center px-4 md:w-1/3">
            <Plan
              title="Annual"
              price={100}
              period="year"
              description="Save 16% compared to monthly"
              features={[
                "Go Live Streaming",
                "Ad-free browsing",
                "Priority matching",
                "Exclusive features",
                "Profile highlighting",
                "Advanced analytics"
              ]}
              onSubscribe={() => handleSubscribe("Annual")}
            />
          </div>
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
