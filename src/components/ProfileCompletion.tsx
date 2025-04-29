
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProfileCompletionProps {
  percentage: number;
  className?: string;
}

export const ProfileCompletion = ({ percentage, className }: ProfileCompletionProps) => {
  const getStatusColor = () => {
    if (percentage < 40) return "text-red-500";
    if (percentage < 70) return "text-amber-500";
    return "text-green-500";
  };

  const getStatusText = () => {
    if (percentage < 40) return "Profile needs more info";
    if (percentage < 70) return "Profile looking good";
    if (percentage < 100) return "Almost complete!";
    return "Profile complete!";
  };

  return (
    <div className={cn("p-4 bg-muted/40 rounded-lg", className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Profile Completion</h3>
        <div className="flex items-center gap-1">
          <span className={cn("font-semibold", getStatusColor())}>
            {percentage}%
          </span>
          {percentage === 100 && (
            <Check className="h-4 w-4 text-green-500" />
          )}
        </div>
      </div>
      
      <Progress 
        value={percentage} 
        className="h-2" 
      />
      
      <p className={cn("text-sm mt-2", getStatusColor())}>
        {getStatusText()}
      </p>
    </div>
  );
};
