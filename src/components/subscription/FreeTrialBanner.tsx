
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface FreeTrialBannerProps {
  isInFreeTrial: boolean;
  freeTrialEndDate: Date | null;
  onStartTrial: () => void;
}

export const FreeTrialBanner = ({ isInFreeTrial, freeTrialEndDate, onStartTrial }: FreeTrialBannerProps) => {
  if (!isInFreeTrial || !freeTrialEndDate) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mb-10 text-center">
      <h2 className="text-xl font-semibold mb-2">🎁 Free Trial Active</h2>
      <p className="mb-3">
        You're currently enjoying a 7-day free trial with access to all premium features!
      </p>
      <p className="text-sm text-amber-700">
        Trial ends on {freeTrialEndDate.toLocaleDateString()} at {freeTrialEndDate.toLocaleTimeString()}
      </p>
    </div>
  );
};
