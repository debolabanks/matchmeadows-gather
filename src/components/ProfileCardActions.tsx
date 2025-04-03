
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReportDialog from "@/components/ReportDialog";

interface ProfileCardActionsProps {
  profileId: string;
  profileName: string;
}

const ProfileCardActions = ({ profileId, profileName }: ProfileCardActionsProps) => {
  return (
    <div className="absolute top-2 right-2 z-10">
      <ReportDialog 
        reportType="profile" 
        targetId={profileId}
        targetName={profileName}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="bg-background/80 backdrop-blur-sm h-8 w-8 rounded-full"
        >
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Report {profileName}</span>
        </Button>
      </ReportDialog>
    </div>
  );
};

export default ProfileCardActions;
