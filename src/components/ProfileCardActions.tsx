
import React from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReportDialog from "@/components/ReportDialog";

interface ProfileCardActionsProps {
  profileId: string;
  profileName: string;
  onBlock?: () => void;
}

const ProfileCardActions = ({ profileId, profileName, onBlock }: ProfileCardActionsProps) => {
  return (
    <div className="absolute top-2 right-2 z-10 flex gap-2">
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
          <Flag className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Report {profileName}</span>
        </Button>
      </ReportDialog>
    </div>
  );
};

export default ProfileCardActions;
