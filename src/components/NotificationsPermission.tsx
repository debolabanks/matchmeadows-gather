
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Check, X, Loader2 } from "lucide-react";

interface NotificationsPermissionProps {
  onComplete?: (hasPermission: boolean) => void;
}

const NotificationsPermission = ({ onComplete }: NotificationsPermissionProps) => {
  const [permissionStatus, setPermissionStatus] = useState<"default" | "granted" | "denied" | "unsupported">("default");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = () => {
    if (!("Notification" in window)) {
      setPermissionStatus("unsupported");
      return;
    }

    setPermissionStatus(Notification.permission as "default" | "granted" | "denied");
  };

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        variant: "destructive",
        title: "Notifications Not Supported",
        description: "Your browser doesn't support notifications"
      });
      if (onComplete) onComplete(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission as "default" | "granted" | "denied");
      
      if (permission === "granted") {
        // Send a test notification
        new Notification("MatchMeadows Notifications Enabled", {
          body: "You'll now receive notifications for new matches and messages",
          icon: "/favicon.ico"
        });
        
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive updates for new matches and messages"
        });
        
        if (onComplete) onComplete(true);
      } else {
        toast({
          variant: "destructive",
          title: "Permission Denied",
          description: "You won't receive notifications for updates"
        });
        
        if (onComplete) onComplete(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to request notification permission"
      });
      
      if (onComplete) onComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusDisplay = () => {
    switch (permissionStatus) {
      case "granted":
        return (
          <div className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Check className="h-5 w-5 text-green-500" />
            <p className="text-sm">Notifications enabled</p>
          </div>
        );
      case "denied":
        return (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-2">
            <div className="flex items-center space-x-2">
              <X className="h-5 w-5 text-red-500" />
              <p className="text-sm">Notifications blocked</p>
            </div>
            <p className="text-xs text-muted-foreground">
              You've blocked notifications. Please update your browser settings to enable them.
            </p>
          </div>
        );
      case "unsupported":
        return (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm">Your browser doesn't support notifications</p>
          </div>
        );
      default:
        return (
          <Button
            onClick={requestPermission}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Bell className="h-4 w-4 mr-2" />
            )}
            Enable Notifications
          </Button>
        );
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Notifications</h3>
      <p className="text-sm text-muted-foreground">
        Get notified about new matches, messages, and important updates
      </p>
      
      {getStatusDisplay()}
    </div>
  );
};

export default NotificationsPermission;
