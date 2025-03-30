import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CallSession } from "@/types/message";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Phone,
  Volume2,
  Volume,
  Maximize2,
  Minimize2
} from "lucide-react";

interface VideoCallProps {
  contactId: string;
  contactName: string;
  contactImage: string;
  callType: "video" | "voice";
  onEnd: () => void;
  isIncoming?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}

const VideoCall = ({
  contactId,
  contactName,
  contactImage,
  callType,
  onEnd,
  isIncoming = false,
  onAccept,
  onReject
}: VideoCallProps) => {
  const [callStatus, setCallStatus] = useState<CallSession["status"]>(
    isIncoming ? "connecting" : "connecting"
  );
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === "voice");
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Start media stream when component mounts
  useEffect(() => {
    if (isIncoming && callStatus === "connecting") {
      // Don't start media for incoming calls until accepted
      return;
    }
    
    const startMedia = async () => {
      try {
        const constraints: MediaStreamConstraints = {
          audio: true,
          video: callType === "video"
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // In a real app, you would establish WebRTC connection here
        // For this demo, we'll simulate a connection after a delay
        setTimeout(() => {
          setCallStatus("connected");
          simulateRemoteStream();
          startTimer();
        }, 2000);
        
      } catch (error) {
        console.error("Error accessing media devices:", error);
        toast({
          title: "Media Access Error",
          description: "Could not access camera or microphone",
          variant: "destructive"
        });
        endCall();
      }
    };
    
    startMedia();
    
    return () => {
      stopStreams();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callType, isIncoming, callStatus]);

  // Simulate remote stream (in a real app this would be from WebRTC)
  const simulateRemoteStream = () => {
    // For demo purposes, we'll create a mock remote stream
    const mockVideo = document.createElement('video');
    mockVideo.autoplay = true;
    mockVideo.loop = true;
    mockVideo.muted = true;
    
    // Use a placeholder or keep it black for voice calls
    if (callType === "voice") {
      // For voice calls, just show the profile image
      setRemoteStream(null);
    } else {
      // In a real app, this would be the remote peer's video stream
      // For demo, we'll use the local stream as a placeholder
      if (localStream) {
        setRemoteStream(localStream);
        
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = localStream;
        }
      }
    }
  };

  // Stop all media streams
  const stopStreams = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    setRemoteStream(null);
  };

  // Start call duration timer
  const startTimer = () => {
    timerRef.current = window.setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  // Handle call end
  const endCall = () => {
    setCallStatus("ended");
    stopStreams();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onEnd();
  };

  // Handle accepting an incoming call
  const acceptCall = () => {
    if (onAccept) {
      onAccept();
    }
    setCallStatus("connecting");
  };

  // Handle rejecting an incoming call
  const rejectCall = () => {
    if (onReject) {
      onReject();
    }
    setCallStatus("rejected");
    setTimeout(onEnd, 1000);
  };

  // Toggle mute
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  // Toggle speaker
  const toggleSpeaker = () => {
    // In a real app, you would switch audio output devices
    // This is just for UI demonstration
    setIsSpeakerOn(!isSpeakerOn);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!callContainerRef.current) return;
    
    if (!isFullscreen) {
      if (callContainerRef.current.requestFullscreen) {
        callContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };

  // Format duration as mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={callContainerRef}
      className={`fixed inset-0 z-50 bg-black flex flex-col ${
        isFullscreen ? 'fullscreen' : ''
      }`}
    >
      {/* Remote video (main view) */}
      <div className="relative flex-1 flex items-center justify-center bg-gray-900">
        {callType === "video" && remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden mb-4 border-4 border-primary">
              <img src={contactImage} alt={contactName} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-white text-xl font-semibold">{contactName}</h2>
            <p className="text-gray-300 mt-2">
              {callStatus === "connected" 
                ? formatDuration(duration)
                : callStatus === "connecting" 
                  ? "Connecting..."
                  : callStatus}
            </p>
          </div>
        )}
        
        {/* Call status indicator */}
        <div className="absolute top-8 left-0 right-0 text-center">
          {callStatus === "connecting" && !isIncoming && (
            <p className="text-white bg-black/30 py-1 px-3 rounded-full inline-block">
              Calling {contactName}...
            </p>
          )}
        </div>
        
        {/* Local video (picture-in-picture) */}
        {callType === "video" && localStream && !isVideoOff && (
          <div className="absolute top-4 right-4 w-28 h-40 md:w-40 md:h-56 rounded-lg overflow-hidden border-2 border-white">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      
      {/* Call controls */}
      <div className="bg-black p-4 flex justify-center">
        {isIncoming && callStatus === "connecting" ? (
          // Incoming call controls
          <div className="flex gap-4">
            <Button 
              onClick={rejectCall}
              size="icon" 
              variant="destructive" 
              className="h-14 w-14 rounded-full"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
            <Button 
              onClick={acceptCall}
              size="icon" 
              variant="default" 
              className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600"
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>
        ) : (
          // Active call controls
          <div className="flex gap-3 flex-wrap justify-center">
            <Button
              onClick={toggleMute}
              size="icon"
              variant={isMuted ? "secondary" : "outline"}
              className="rounded-full"
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            
            {callType === "video" && (
              <Button
                onClick={toggleVideo}
                size="icon"
                variant={isVideoOff ? "secondary" : "outline"}
                className="rounded-full"
              >
                {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
              </Button>
            )}
            
            <Button
              onClick={toggleSpeaker}
              size="icon"
              variant={isSpeakerOn ? "outline" : "secondary"}
              className="rounded-full"
            >
              {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <Volume className="h-5 w-5" />}
            </Button>
            
            <Button
              onClick={toggleFullscreen}
              size="icon"
              variant="outline"
              className="rounded-full"
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
            
            <Button
              onClick={endCall}
              size="icon"
              variant="destructive"
              className="rounded-full h-14 w-14"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
