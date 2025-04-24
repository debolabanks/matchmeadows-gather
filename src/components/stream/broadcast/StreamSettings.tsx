
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface StreamSettingsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: string;
  setCategory: (category: string) => void;
  tags: string;
  setTags: (tags: string) => void;
  isSubscriberOnly: boolean;
  setIsSubscriberOnly: (isSubscriberOnly: boolean) => void;
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
    <div className="space-y-6 bg-card shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-semibold">Stream Settings</h2>
      
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Stream Title</Label>
          <Input
            id="title"
            placeholder="Enter your stream title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLive}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your stream"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLive}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={category}
            onValueChange={setCategory}
            disabled={isLive}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="irl">IRL</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="esports">Esports</SelectItem>
              <SelectItem value="travel">Travel & Outdoors</SelectItem>
              <SelectItem value="chatting">Just Chatting</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            placeholder="gaming, stream, fun"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={isLive}
          />
          <p className="text-xs text-muted-foreground">
            Add relevant tags to help viewers find your stream
          </p>
        </div>
        
        <div className="flex items-center justify-between space-x-2 py-2">
          <div>
            <Label htmlFor="subscriber-only" className="font-medium">
              Subscriber Only
            </Label>
            <p className="text-xs text-muted-foreground">
              Only subscribers can view this stream
            </p>
          </div>
          <Switch
            id="subscriber-only"
            checked={isSubscriberOnly}
            onCheckedChange={setIsSubscriberOnly}
            disabled={isLive}
          />
        </div>
      </div>
    </div>
  );
};

export default StreamSettings;
