
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Room } from "twilio-video";
import { startBroadcast } from "@/services/twilioService";
import { 
  Video,
  Mic, 
  MicOff,
  VideoOff,
  Users,
  MessageSquare,
  Rabbit
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface CreatorBroadcastProps {
  creatorId: string;
  creatorName: string;
}

const CreatorBroadcast = ({ creatorId, creatorName }: CreatorBroadcastProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [isSubscriberOnly, setIsSubscriberOnly] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [broadcastDuration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<number | null>(null);
  const twilioRoomRef = useRef<Room | null>(null);
  const navigate = useNavigate();
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (twilioRoomRef.current) {
        twilioRoomRef.current.disconnect();
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Set up local video preview
  useEffect(() => {
    const setupPreview = async () => {
      try {
        // Only set up preview when not live
        if (!isLive && isVideoEnabled) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: false 
          });
          
          if (videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = stream;
          }
          
          return () => {
            stream.getTracks().forEach(track => track.stop());
          };
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast({
          title: "Camera access error",
          description: "Could not access your camera. Please check permissions.",
          variant: "destructive",
        });
      }
    };
    
    const cleanup = setupPreview();
    
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [isLive, isVideoEnabled]);
  
  const startBroadcastHandler = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your broadcast",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create a room name based on creator id and timestamp
      const roomName = `${creatorId}-${Date.now()}`;
      
      // Connect to Twilio room
      const room = await startBroadcast(roomName);
      twilioRoomRef.current = room;
      
      // Successfully connected to the room
      setIsLive(true);
      setViewerCount(0);
      setDuration(0);
      
      // Start duration timer
      intervalRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Broadcast started!",
        description: "You are now live. Share your stream with others.",
      });
      
      // Generate a stream ID (in a real app, this would come from the backend)
      const streamId = `${creatorId}-${Date.now()}`;
      
      // Create a new Stream object (in a real app, this would be saved to the database)
      const newStream = {
        id: streamId,
        creatorId,
        creatorName,
        title,
        description,
        category,
        tags: tags.split(",").map(tag => tag.trim()),
        isSubscriberOnly,
        status: "live",
        viewerCount: 0,
        startTime: new Date().toISOString(),
      };
      
      console.log("New stream created:", newStream);
      
      // Simulate random viewers joining
      const viewerInterval = setInterval(() => {
        setViewerCount(prev => {
          const randomChange = Math.floor(Math.random() * 3);
          return prev + randomChange;
        });
      }, 10000);
      
      // Save the interval for cleanup
      const oldInterval = intervalRef.current;
      intervalRef.current = viewerInterval as unknown as number;
      
      return () => {
        clearInterval(oldInterval);
        clearInterval(viewerInterval);
      };
    } catch (error) {
      console.error("Error starting broadcast:", error);
      toast({
        title: "Broadcast error",
        description: "Could not start the broadcast. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const stopBroadcastHandler = () => {
    if (twilioRoomRef.current) {
      twilioRoomRef.current.disconnect();
      twilioRoomRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsLive(false);
    setDuration(0);
    setViewerCount(0);
    
    toast({
      title: "Broadcast ended",
      description: "Your broadcast has ended successfully.",
    });
  };
  
  const toggleMic = () => {
    setIsMicEnabled(!isMicEnabled);
    
    if (twilioRoomRef.current) {
      const audioTracks = Array.from(twilioRoomRef.current.localParticipant.audioTracks.values());
      audioTracks.forEach(publication => {
        if (publication.track) {
          isMicEnabled ? publication.track.disable() : publication.track.enable();
        }
      });
    }
  };
  
  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    
    if (twilioRoomRef.current) {
      const videoTracks = Array.from(twilioRoomRef.current.localParticipant.videoTracks.values());
      videoTracks.forEach(publication => {
        if (publication.track) {
          isVideoEnabled ? publication.track.disable() : publication.track.enable();
        }
      });
    }
  };
  
  // Format duration as mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column - Stream settings */}
        <div className="md:col-span-2 space-y-4">
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
        </div>
        
        {/* Right column - Video preview */}
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Camera Preview</CardTitle>
              <CardDescription>
                See how you look before going live
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div className="relative bg-black rounded-md aspect-video mb-4 flex items-center justify-center overflow-hidden">
                {isVideoEnabled ? (
                  <video
                    ref={videoPreviewRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white flex flex-col items-center justify-center">
                    <VideoOff className="h-8 w-8 mb-2" />
                    <p>Camera off</p>
                  </div>
                )}
                
                {isLive && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold animate-pulse">
                    LIVE
                  </div>
                )}
                
                {isLive && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {viewerCount}
                  </div>
                )}
                
                {isLive && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
                    {formatDuration(broadcastDuration)}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 justify-center mb-4">
                <Button
                  variant={isMicEnabled ? "outline" : "secondary"}
                  size="icon"
                  onClick={toggleMic}
                  disabled={isLoading}
                >
                  {isMicEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant={isVideoEnabled ? "outline" : "secondary"}
                  size="icon"
                  onClick={toggleVideo}
                  disabled={isLoading}
                >
                  {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
              </div>
              
              {isLive ? (
                <div className="space-y-4">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={stopBroadcastHandler}
                  >
                    End Broadcast
                  </Button>
                  
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{formatDuration(broadcastDuration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Viewers:</span>
                      <span>{viewerCount}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <Button 
                  className="w-full"
                  onClick={startBroadcastHandler}
                  disabled={!title.trim() || isLoading}
                >
                  {isLoading ? "Connecting..." : "Go Live"}
                </Button>
              )}
            </CardContent>
            
            {isLive && (
              <CardFooter className="flex-col gap-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/streams/${creatorId}-${Date.now()}`} target="_blank">
                    <Rabbit className="mr-2 h-4 w-4" />
                    Open Stream Page
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View Chat
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatorBroadcast;
