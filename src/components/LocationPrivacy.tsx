
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin, Users, Lock } from "lucide-react";

type LocationPrivacyOption = "public" | "friends" | "private";

interface LocationPrivacyProps {
  value: LocationPrivacyOption;
  onChange: (value: LocationPrivacyOption) => void;
}

export const LocationPrivacy = ({ value, onChange }: LocationPrivacyProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="location-privacy">Location Privacy</Label>
      <Select value={value} onValueChange={onChange as any}>
        <SelectTrigger id="location-privacy" className="w-full">
          <SelectValue placeholder="Choose who can see your location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="public" className="flex items-center">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-green-500" />
              <span>Public - Everyone can see</span>
            </div>
          </SelectItem>
          <SelectItem value="friends">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              <span>Friends only</span>
            </div>
          </SelectItem>
          <SelectItem value="private">
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-2 text-red-500" />
              <span>Private - Only you</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
