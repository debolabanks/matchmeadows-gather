
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CallSession } from "@/types/message";
import { attachTrackToElement } from "@/services/twilioService";
import { useCallContext } from "@/contexts/CallContext";
import { Room, RemoteParticipant, RemoteTrack, RemoteTrackPublication } from "twilio-video";
import { 
  Video as VideoIcon, 
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
  const [remoteParticipant, setRemoteParticipant] = useState<RemoteParticipant | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();
  const { twilioRoom, localTracks } = useCallContext();

  // Initialize call when component mounts
  useEffect(() => {
    if (isIncoming && callStatus === "connecting") {
      // Don't start for incoming calls until accepted
      return;
    }
    
    setCallStatus("connecting");
    
    // Start call timer when connected
    if (callStatus === "connected") {
      startTimer();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callStatus, isIncoming]);

  // Handle Twilio room and tracks
  useEffect(() => {
    if (!twilioRoom) return;
    
    // Mark call as connected when room is ready
    setCallStatus("connected");
    
    // Set up local video
    const localVideoTrack = localTracks.find(track => track.kind === 'video');
    if (localVideoTrack && localVideoRef.current) {
      const videoElement = localVideoRef.current;
      attachTrackToElement(localVideoTrack as any, videoElement);
    }
    
    // Handle remote participants
    const handleTrackSubscribed = (track: RemoteTrack) => {
      if (track.kind === 'video' && remoteVideoRef.current) {
        attachTrackToElement(track as any, remoteVideoRef.current);
      }
    };
    
    const handleParticipantConnected = (participant: RemoteParticipant) => {
      setRemoteParticipant(participant);
      
      participant.tracks.forEach(publication => {
        if (publication.isSubscribed) {
          handleTrackSubscribed(publication.track);
        }
      });
      
      participant.on('trackSubscribed', handleTrackSubscribed);
    };
    
    twilioRoom.participants.forEach(handleParticipantConnected);
    twilioRoom.on('participantConnected', handleParticipantConnected);
    
    // Start timer when connected to room
    startTimer();
    
    return () => {
      // Cleanup event listeners
      twilioRoom.off('participantConnected', handleParticipantConnected);
      
      if (remoteParticipant) {
        remoteParticipant.removeAllListeners();
      }
    };
  }, [twilioRoom, localTracks]);

  // Start call duration timer
  const startTimer = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = window.setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  // Handle call end
  const endCall = () => {
    setCallStatus("ended");
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
    const audioTrack = localTracks.find(track => track.kind === 'audio');
    if (audioTrack) {
      audioTrack.enable(!isMuted);
    }
    setIsMuted(!isMuted);
  };

  // Toggle video
  const toggleVideo = () => {
    const videoTrack = localTracks.find(track => track.kind === 'video');
    if (videoTrack) {
      videoTrack.enable(!isVideoOff);
    }
    setIsVideoOff(!isVideoOff);
  };

  // Toggle speaker
  const toggleSpeaker = () => {
    // In a real app, you would switch audio output devices
    // This is just for UI demonstration
    setIsSpeakerOn(!isSpeakerOn);
    
    toast({
      title: isSpeakerOn ? "Speaker off" : "Speaker on",
      duration: 1500,
    });
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
        {callType === "video" && (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        
        {(callType === "voice" || callStatus !== "connected" || !remoteParticipant) && (
          <div className="flex flex-col items-center justify-center absolute inset-0">
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
        {callType === "video" && !isVideoOff && (
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
                {isVideoOff ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
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
