
import React from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReportDialog from "@/components/ReportDialog";

interface MessageReportButtonProps {
  messageId: string;
  senderName: string;
}

const MessageReportButton = ({ messageId, senderName }: MessageReportButtonProps) => {
  return (
    <ReportDialog 
      reportType="message" 
      targetId={messageId}
      targetName={senderName}
    >
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Flag className="h-3 w-3 text-muted-foreground" />
        <span className="sr-only">Report message</span>
      </Button>
    </ReportDialog>
  );
};

export default MessageReportButton;
