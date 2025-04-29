
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, ShieldAlert, Clock } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import FaceVerification from "@/components/FaceVerification";
import { Button } from "@/components/ui/button";

interface VerificationStatusProps {
  status: "unverified" | "pending" | "verified";
  showVerifyButton?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const VerificationStatus = ({ 
  status, 
  showVerifyButton = false,
  size = "md",
  className = "" 
}: VerificationStatusProps) => {
  const getStatusDetails = () => {
    switch (status) {
      case "verified":
        return {
          icon: <CheckCircle2 className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />,
          text: "Verified",
          color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
          tooltip: "This profile has been verified and is authentic"
        };
      case "pending":
        return {
          icon: <Clock className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />,
          text: "Pending",
          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
          tooltip: "Verification is in progress"
        };
      case "unverified":
      default:
        return {
          icon: <ShieldAlert className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />,
          text: "Unverified",
          color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
          tooltip: "This profile has not been verified yet"
        };
    }
  };

  const details = getStatusDetails();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 ${details.color} ${
              size === "sm" ? "text-xs py-0 px-2" : "px-2 py-1"
            }`}
          >
            {details.icon}
            <span>{details.text}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{details.tooltip}</p>
        </TooltipContent>
      </Tooltip>

      {showVerifyButton && status !== "verified" && (
        <Drawer>
          <DrawerTrigger asChild>
            <Button size="sm" variant="default">
              Verify Now
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-w-md mx-auto p-4">
            <div className="mx-auto w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Face Verification</h3>
              <FaceVerification />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default VerificationStatus;
