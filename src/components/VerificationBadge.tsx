
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, Clock, ShieldAlert } from "lucide-react";

type VerificationStatus = "unverified" | "pending" | "verified";

interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
}

export const VerificationBadge = ({ status, className }: VerificationBadgeProps) => {
  const getBadgeContent = () => {
    switch (status) {
      case "verified":
        return {
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          text: "Verified",
          variant: "default",
          tooltip: "Your profile has been verified",
          color: "text-green-500"
        };
      case "pending":
        return {
          icon: <Clock className="h-3 w-3 mr-1" />,
          text: "Pending",
          variant: "outline",
          tooltip: "Verification is in progress",
          color: "text-yellow-500"
        };
      case "unverified":
      default:
        return {
          icon: <ShieldAlert className="h-3 w-3 mr-1" />,
          text: "Unverified",
          variant: "secondary",
          tooltip: "Your profile is not verified yet",
          color: "text-muted-foreground"
        };
    }
  };

  const content = getBadgeContent();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          variant={content.variant as any}
          className={`flex items-center text-xs ${content.color} ${className}`}
        >
          {content.icon}
          {content.text}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>{content.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};
