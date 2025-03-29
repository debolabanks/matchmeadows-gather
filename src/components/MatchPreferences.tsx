
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Map, Users, Heart } from "lucide-react";
import { MatchCriteria } from "@/utils/matchingAlgorithm";

interface MatchPreferencesProps {
  preferences: MatchCriteria;
  onChange: (preferences: Partial<MatchCriteria>) => void;
}

const MatchPreferences = ({ preferences, onChange }: MatchPreferencesProps) => {
  const handleAgeChange = (values: number[]) => {
    onChange({ minAge: values[0], maxAge: values[1] });
  };

  const handleDistanceChange = (values: number[]) => {
    onChange({ maxDistance: values[0] });
  };

  const handleGenderChange = (value: string) => {
    onChange({ gender: value as "male" | "female" | "non-binary" | "any" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-love-500" />
          Match Preferences
        </CardTitle>
        <CardDescription>
          Set your preferences to find better matches
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Age Range</Label>
              <span className="text-sm text-muted-foreground">
                {preferences.minAge} - {preferences.maxAge}
              </span>
            </div>
            <Slider
              defaultValue={[preferences.minAge || 18, preferences.maxAge || 50]}
              max={100}
              min={18}
              step={1}
              onValueChange={handleAgeChange}
              className="my-4"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Maximum Distance</Label>
              <span className="text-sm text-muted-foreground">
                {preferences.maxDistance} miles
              </span>
            </div>
            <Slider
              defaultValue={[preferences.maxDistance || 25]}
              max={100}
              min={1}
              step={1}
              onValueChange={handleDistanceChange}
              className="my-4"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Interested In</Label>
            <RadioGroup 
              defaultValue={preferences.gender || "any"}
              onValueChange={handleGenderChange}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Men</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Women</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-binary" id="non-binary" />
                <Label htmlFor="non-binary">Non-binary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="any" />
                <Label htmlFor="any">Everyone</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchPreferences;
