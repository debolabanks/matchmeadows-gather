
import React from "react";
import { Flag } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import ReportDialog from "@/components/ReportDialog";

interface ReportButtonProps extends Omit<ButtonProps, "onClick"> {
  reportType: "profile" | "message" | "stream";
  targetId: string;
  targetName?: string;
  iconOnly?: boolean;
}

const ReportButton = ({ 
  reportType, 
  targetId, 
  targetName,
  iconOnly = false,
  variant = "ghost",
  size = iconOnly ? "icon" : "sm",
  className,
  ...props 
}: ReportButtonProps) => {
  return (
    <ReportDialog 
      reportType={reportType} 
      targetId={targetId}
      targetName={targetName}
    >
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        {...props}
      >
        <Flag className={`h-4 w-4 ${!iconOnly ? 'mr-2' : ''}`} />
        {!iconOnly && "Report"}
        {iconOnly && <span className="sr-only">Report</span>}
      </Button>
    </ReportDialog>
  );
};

export default ReportButton;
