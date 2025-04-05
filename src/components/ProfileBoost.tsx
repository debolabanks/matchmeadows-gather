
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeCheck, Rocket, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { createBoostCheckout, BOOST_OPTIONS } from '@/services/stripeService';

const ProfileBoost = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingBoost, setLoadingBoost] = useState<string | null>(null);

  const handleBoost = async (boostId: string) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to boost your profile',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoadingBoost(boostId);
      const { url } = await createBoostCheckout(boostId);
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Boost error:', error);
      toast({
        title: 'Error',
        description: 'Failed to process boost payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingBoost(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Boost Your Profile</h2>
        <p className="text-muted-foreground">
          Get more visibility and increase your chances of finding matches
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BOOST_OPTIONS.map((boost) => (
          <Card key={boost.id} className="border border-primary/20 bg-primary/5 animate-in fade-in">
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <CardTitle>{boost.name}</CardTitle>
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>{boost.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <BadgeCheck className="h-4 w-4 text-primary mr-2" />
                  <span>Premium placement in discover</span>
                </li>
                <li className="flex items-center">
                  <BadgeCheck className="h-4 w-4 text-primary mr-2" />
                  <span>Top of match suggestions</span>
                </li>
                <li className="flex items-center">
                  <BadgeCheck className="h-4 w-4 text-primary mr-2" />
                  <span>Active for {boost.duration}</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleBoost(boost.id)} 
                className="w-full"
                disabled={loadingBoost === boost.id}
              >
                {loadingBoost === boost.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="mr-2">${(boost.amount / 100).toFixed(2)}</span>
                    <span>Boost Now</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfileBoost;
