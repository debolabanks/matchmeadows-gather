
import { User } from "@/contexts/authTypes";
import { Stream } from "@/types/stream";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown } from "lucide-react";
import { Link } from "react-router-dom";

interface SubscriptionPromoProps {
  stream: Stream;
  currentUser?: User | null;
  onSubscribe: () => void;
}

const SubscriptionPromo = ({ stream, currentUser, onSubscribe }: SubscriptionPromoProps) => {
  const isOwnStream = currentUser?.id === stream.creatorId;
  
  if (isOwnStream) return null;
  
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Crown className="h-5 w-5 mr-2 text-primary" />
          Support {stream.creatorName}
        </CardTitle>
        <CardDescription>
          Become a subscriber and get exclusive benefits
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <ul className="space-y-1">
          <li className="flex items-center text-sm">
            <Check className="h-4 w-4 mr-2 text-primary" />
            <span>Subscriber-only live streams</span>
          </li>
          <li className="flex items-center text-sm">
            <Check className="h-4 w-4 mr-2 text-primary" />
            <span>Exclusive chat privileges</span>
          </li>
          <li className="flex items-center text-sm">
            <Check className="h-4 w-4 mr-2 text-primary" />
            <span>Support your favorite creator</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        {currentUser ? (
          <Button onClick={onSubscribe} className="w-full" size="sm">
            Subscribe for $5.99/month
          </Button>
        ) : (
          <Button asChild size="sm" className="w-full">
            <Link to="/signin">Sign in to Subscribe</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionPromo;
