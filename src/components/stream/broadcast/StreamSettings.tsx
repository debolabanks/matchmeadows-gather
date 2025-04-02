
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface StreamSettingsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  tags: string;
  setTags: (value: string) => void;
  isSubscriberOnly: boolean;
  setIsSubscriberOnly: (value: boolean) => void;
  isLive: boolean;
}

const StreamSettings = ({ 
  title, 
  setTitle, 
  description, 
  setDescription,
  category,
  setCategory,
  tags,
  setTags,
  isSubscriberOnly,
  setIsSubscriberOnly,
  isLive
}: StreamSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Broadcast Settings</CardTitle>
        <CardDescription>
          Configure your live stream settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Stream Title</Label>
          <Input
            id="title"
            placeholder="Enter an engaging title for your stream..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLive}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="What will you be sharing in this stream?"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLive}
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={category} 
              onValueChange={setCategory}
              disabled={isLive}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="cooking">Cooking</SelectItem>
                <SelectItem value="art">Art</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="tech">Technology</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              placeholder="gaming, strategy, tutorial"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={isLive}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="subscriber-only">Subscriber Only</Label>
            <p className="text-sm text-muted-foreground">
              Limit this stream to your subscribers
            </p>
          </div>
          <Switch
            id="subscriber-only"
            checked={isSubscriberOnly}
            onCheckedChange={setIsSubscriberOnly}
            disabled={isLive}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StreamSettings;
