
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { startBroadcast, attachTrackToElement } from "@/services/twilioService";
import { Room, LocalTrack } from "twilio-video";
import { 
  Video as VideoIcon, 
  Mic, 
  MicOff, 
  VideoOff, 
  Settings, 
  Users, 
  MessageSquare,
  Share,
  MoreVertical,
  Maximize2
} from "lucide-react";

interface CreatorBroadcastProps {
  creatorId: string;
  creatorName: string;
}

const CreatorBroadcast = ({ creatorId, creatorName }: CreatorBroadcastProps) => {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isPreparingToStart, setIsPreparingToStart] = useState(false);
  const [streamTitle, setStreamTitle] = useState("");
  const [streamDescription, setStreamDescription] = useState("");
  const [viewerCount, setViewerCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [twilioRoom, setTwilioRoom] = useState<Room | null>(null);
  const [localTracks, setLocalTracks] = useState<LocalTrack[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (twilioRoom) {
        twilioRoom.disconnect();
      }
      
      localTracks.forEach(track => {
        if ('stop' in track && typeof track.stop === 'function') {
          track.stop();
        }
      });
    };
  }, [twilioRoom, localTracks]);

  // Handle broadcasting state changes
  useEffect(() => {
    if (isBroadcasting && twilioRoom) {
      // Start elapsed time counter
      timerRef.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      // Simulate viewers joining
      const viewerSimulator = setInterval(() => {
        setViewerCount(prev => {
          const change = Math.floor(Math.random() * 3);
          return prev + change;
        });
      }, 10000);
      
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        clearInterval(viewerSimulator);
      };
    }
  }, [isBroadcasting, twilioRoom]);

  // Format elapsed time as HH:MM:SS
  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hrs > 0 ? String(hrs).padStart(2, '0') : null,
      String(mins).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  // Start the broadcast
  const handleStartBroadcast = async () => {
    if (!streamTitle.trim()) {
      toast({
        title: "Stream title required",
        description: "Please enter a title for your stream",
        variant: "destructive"
      });
      return;
    }
    
    setIsPreparingToStart(true);
    
    try {
      // Create a unique room name based on creator ID and timestamp
      const roomName = `broadcast-${creatorId}-${Date.now()}`;
      
      // Connect to Twilio room as a presenter
      const room = await startBroadcast(roomName);
      setTwilioRoom(room);
      
      // Get local tracks from room
      const tracks = Array.from(room.localParticipant.tracks.values())
        .map(publication => publication.track)
        .filter(track => track !== null) as LocalTrack[];
      
      setLocalTracks(tracks);
      
      // Attach local video track to preview
      const videoTrack = tracks.find(track => track.kind === 'video');
      if (videoTrack && videoRef.current) {
        attachTrackToElement(videoTrack as any, videoRef.current);
      }
      
      setIsBroadcasting(true);
      setIsPreparingToStart(false);
      
      toast({
        title: "Broadcast started!",
        description: "You are now live to your audience",
      });
    } catch (error) {
      console.error("Failed to start broadcast:", error);
      setIsPreparingToStart(false);
      
      toast({
        title: "Broadcast failed",
        description: "There was an error starting your broadcast",
        variant: "destructive"
      });
    }
  };

  // End the broadcast
  const handleEndBroadcast = () => {
    if (twilioRoom) {
      twilioRoom.disconnect();
      setTwilioRoom(null);
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsBroadcasting(false);
    setElapsedTime(0);
    setViewerCount(0);
    
    toast({
      title: "Broadcast ended",
      description: "Your live stream has ended",
    });
  };

  // Toggle microphone
  const toggleMicrophone = () => {
    const audioTrack = localTracks.find(track => track.kind === 'audio');
    if (audioTrack && 'enable' in audioTrack && typeof audioTrack.enable === 'function') {
      if (isMuted) {
        audioTrack.enable();
      } else {
        audioTrack.disable();
      }
      setIsMuted(!isMuted);
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    const videoTrack = localTracks.find(track => track.kind === 'video');
    if (videoTrack && 'enable' in videoTrack && typeof videoTrack.enable === 'function') {
      if (isVideoOff) {
        videoTrack.enable();
      } else {
        videoTrack.disable();
      }
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {!isBroadcasting ? (
        // Pre-broadcast setup screen
        <Card>
          <CardHeader>
            <CardTitle>Start a New Broadcast</CardTitle>
            <CardDescription>Share your content live with your audience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="streamTitle" className="text-sm font-medium">Stream Title</label>
              <Input 
                id="streamTitle" 
                placeholder="Give your stream a title..." 
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="streamDescription" className="text-sm font-medium">Description (optional)</label>
              <Textarea 
                id="streamDescription" 
                placeholder="Tell viewers what your stream is about..." 
                value={streamDescription}
                onChange={(e) => setStreamDescription(e.target.value)}
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <VideoIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Before starting, make sure your camera and microphone are working properly.
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleStartBroadcast} 
              disabled={isPreparingToStart || !streamTitle.trim()}
              className="w-full"
            >
              {isPreparingToStart ? "Preparing..." : "Start Broadcasting"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        // Active broadcast UI
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main video and controls */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay information */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-red-500 animate-pulse">LIVE</Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {viewerCount}
                </Badge>
                <Badge variant="outline" className="bg-black/30 text-white">
                  {formatElapsedTime(elapsedTime)}
                </Badge>
              </div>
              
              {/* Bottom controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex gap-2">
                  <Button 
                    variant={isMuted ? "secondary" : "outline"} 
                    size="sm"
                    className="bg-black/50 border-none hover:bg-black/70"
                    onClick={toggleMicrophone}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant={isVideoOff ? "secondary" : "outline"} 
                    size="sm"
                    className="bg-black/50 border-none hover:bg-black/70"
                    onClick={toggleCamera}
                  >
                    {isVideoOff ? <VideoOff className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-black/50 border-none hover:bg-black/70"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleEndBroadcast}
                  >
                    End Broadcast
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{streamTitle}</h2>
                <p className="text-sm text-muted-foreground">By {creatorName}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-2" /> Share
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {streamDescription && (
              <div className="bg-muted p-4 rounded-lg">
                <p>{streamDescription}</p>
              </div>
            )}
          </div>
          
          {/* Chat and stats sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] overflow-y-auto border-y">
                <div className="space-y-2 p-2">
                  <div className="text-center text-sm text-muted-foreground pb-2">
                    Chat messages will appear here
                  </div>
                  {/* Demo messages */}
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">JD</div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm">John Doe</span>
                        <span className="text-xs text-muted-foreground">just now</span>
                      </div>
                      <p className="text-sm">Great content! Keep it up!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex gap-2 w-full">
                  <Input placeholder="Type a message..." />
                  <Button>Send</Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-4 h-4" /> Viewers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold">{viewerCount}</div>
                    <div className="text-sm text-muted-foreground">Current viewers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{Math.max(viewerCount, 10)}</div>
                    <div className="text-sm text-muted-foreground">Peak viewers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorBroadcast;
