
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Eye, Clock, Lock } from "lucide-react";

export type PrivacySettingsType = {
  showActivity: boolean;
  showDistance: boolean;
  showOnlineStatus: boolean;
  profileVisibility: "public" | "matches-only" | "private";
};

interface PrivacySettingsProps {
  settings: PrivacySettingsType;
  onChange: (settings: Partial<PrivacySettingsType>) => void;
}

export const PrivacySettings = ({ settings, onChange }: PrivacySettingsProps) => {
  const handleSwitchChange = (key: keyof PrivacySettingsType) => (checked: boolean) => {
    onChange({ [key]: checked });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>
          Control who can see your profile and activity
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-activity">Show Activity Status</Label>
              <p className="text-sm text-muted-foreground">
                Show others when you were last active
              </p>
            </div>
            <Switch 
              id="show-activity" 
              checked={settings.showActivity}
              onCheckedChange={handleSwitchChange('showActivity')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-distance">Show Distance</Label>
              <p className="text-sm text-muted-foreground">
                Show your distance from other users
              </p>
            </div>
            <Switch 
              id="show-distance" 
              checked={settings.showDistance}
              onCheckedChange={handleSwitchChange('showDistance')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-online">Show Online Status</Label>
              <p className="text-sm text-muted-foreground">
                Show when you're currently online
              </p>
            </div>
            <Switch 
              id="show-online" 
              checked={settings.showOnlineStatus}
              onCheckedChange={handleSwitchChange('showOnlineStatus')}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="profile-visibility">Profile Visibility</Label>
          <Select 
            value={settings.profileVisibility} 
            onValueChange={(value: "public" | "matches-only" | "private") => onChange({ profileVisibility: value })}
          >
            <SelectTrigger id="profile-visibility">
              <SelectValue placeholder="Who can see your profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-green-500" />
                  <span>Public - Everyone can see</span>
                </div>
              </SelectItem>
              <SelectItem value="matches-only">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Matches Only</span>
                </div>
              </SelectItem>
              <SelectItem value="private">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-red-500" />
                  <span>Private - Invisible to others</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
