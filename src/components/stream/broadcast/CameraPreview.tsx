
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Video, VideoOff, Mic, MicOff, Rabbit, MessageSquare, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface CameraPreviewProps {
  isLive: boolean;
  isVideoEnabled: boolean;
  isMicEnabled: boolean;
  isLoading: boolean;
  viewerCount: number;
  broadcastDuration: string | number;
  title: string;
  toggleMic: () => void;
  toggleVideo: () => void;
  startBroadcastHandler: () => void;
  stopBroadcastHandler: () => void;
  creatorId: string;
}

const CameraPreview = ({
  isLive,
  isVideoEnabled,
  isMicEnabled,
  isLoading,
  viewerCount,
  broadcastDuration,
  title,
  toggleMic,
  toggleVideo,
  startBroadcastHandler,
  stopBroadcastHandler,
  creatorId
}: CameraPreviewProps) => {
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  
  // Format duration as mm:ss if it's a number
  const formatDuration = (duration: string | number) => {
    if (typeof duration === 'string') {
      return duration;
    }
    
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
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
      }
    };
    
    const cleanup = setupPreview();
    
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [isLive, isVideoEnabled]);
  
  return (
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
              {typeof broadcastDuration === 'string' ? broadcastDuration : formatDuration(broadcastDuration)}
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
                <span>{typeof broadcastDuration === 'string' ? broadcastDuration : formatDuration(broadcastDuration)}</span>
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
            <Link to={`/stream/${creatorId}`} target="_blank">
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
  );
};

export default CameraPreview;
