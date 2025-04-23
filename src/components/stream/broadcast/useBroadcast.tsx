
import { useState, useRef, useEffect } from "react";
import { startBroadcast } from "@/services/twilio";
import { Room } from "twilio-video";
import webRTCService from "@/services/webrtc/webRTCService";
import { useToast } from "@/components/ui/use-toast";

export const useBroadcast = (creatorId: string, creatorName: string) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubscriberOnly, setIsSubscriberOnly] = useState<boolean>(false);
  
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isMicEnabled, setIsMicEnabled] = useState<boolean>(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewerCount, setViewerCount] = useState<number>(0);
  const [broadcastDuration, setBroadcastDuration] = useState<number>(0);
  
  const twilioRoomRef = useRef<Room | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const webRTCStartedRef = useRef<boolean>(false);
  
  const { toast } = useToast();
  
  // Update broadcast duration while live
  useEffect(() => {
    if (isLive && !timerRef.current) {
      timerRef.current = window.setInterval(() => {
        setBroadcastDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isLive]);
  
  // Start the broadcast
  const startBroadcastHandler = async () => {
    if (title.trim() === "") {
      toast({
        title: "Title required",
        description: "Please enter a title for your broadcast",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create a unique room ID
      const roomId = `broadcast-${creatorId}-${Date.now()}`;
      
      // Try to use WebRTC first for better performance
      try {
        // Initialize WebRTC with user ID
        webRTCService.initialize(creatorId);
        
        // Start local media stream with current mic/video states
        await webRTCService.startLocalStream({ 
          audio: isMicEnabled, 
          video: isVideoEnabled 
        });
        
        // Expose stream to ref for external component usage
        localStreamRef.current = webRTCService.localStream;
        webRTCStartedRef.current = true;
        
        // Continue with Twilio as a fallback mechanism for broadcast viewers
        const room = await startBroadcast(roomId, {
          audio: isMicEnabled,
          video: isVideoEnabled,
          quality: 'high',
          screenShare: false
        });
        
        twilioRoomRef.current = room;
        
        // Simulate viewer count change
        simulateViewerCount();
        
        // Signal that we're successfully broadcasting
        setIsLive(true);
        
        toast({
          title: "Broadcast started",
          description: "You are now live!"
        });
      } catch (webrtcError) {
        console.error("WebRTC failed, using only Twilio:", webrtcError);
        
        // Fall back to Twilio-only approach
        const room = await startBroadcast(roomId, {
          audio: isMicEnabled,
          video: isVideoEnabled,
          quality: 'high',
          screenShare: false
        });
        
        twilioRoomRef.current = room;
        
        // Also store the local stream from Twilio for UI purposes
        if (room.localParticipant.tracks) {
          const videoTracks = Array.from(room.localParticipant.videoTracks.values());
          const audioTracks = Array.from(room.localParticipant.audioTracks.values());
          
          const tracks = [
            ...videoTracks.map(pub => pub.track),
            ...audioTracks.map(pub => pub.track)
          ];
          
          if (tracks.length > 0) {
            const mediaStream = new MediaStream();
            tracks.forEach(track => {
              // @ts-ignore - MediaStreamTrack exists but TypeScript doesn't recognize it
              if (track && track.mediaStreamTrack) {
                // @ts-ignore
                mediaStream.addTrack(track.mediaStreamTrack);
              }
            });
            localStreamRef.current = mediaStream;
          }
        }
        
        // Simulate viewer count change
        simulateViewerCount();
        
        // Signal that we're successfully broadcasting
        setIsLive(true);
        
        toast({
          title: "Broadcast started",
          description: "You are now live!"
        });
      }
    } catch (error) {
      console.error('Failed to start broadcast:', error);
      toast({
        title: "Failed to start",
        description: "Could not start the broadcast. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Stop the broadcast
  const stopBroadcastHandler = async () => {
    try {
      setIsLoading(true);
      
      // Clean up WebRTC if it was started
      if (webRTCStartedRef.current) {
        webRTCService.stopLocalStream();
        webRTCService.hangup();
        webRTCStartedRef.current = false;
      }
      
      // Clean up Twilio room if it exists
      if (twilioRoomRef.current) {
        twilioRoomRef.current.disconnect();
        twilioRoomRef.current = null;
      }
      
      // Clean up media streams
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
      
      // Reset state
      setIsLive(false);
      setViewerCount(0);
      
      // Clear the duration timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast({
        title: "Broadcast ended",
        description: "Your broadcast has ended successfully"
      });
      
    } catch (error) {
      console.error('Failed to stop broadcast:', error);
      toast({
        title: "Error",
        description: "There was a problem ending your broadcast",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle microphone
  const toggleMic = () => {
    setIsMicEnabled(prev => !prev);
    
    // If WebRTC is active, toggle mic tracks
    if (webRTCStartedRef.current) {
      if (localStreamRef.current) {
        const audioTracks = localStreamRef.current.getAudioTracks();
        audioTracks.forEach(track => {
          track.enabled = !isMicEnabled;
        });
      }
    }
    
    // If Twilio room exists, toggle those tracks too
    if (twilioRoomRef.current && twilioRoomRef.current.localParticipant) {
      twilioRoomRef.current.localParticipant.audioTracks.forEach(publication => {
        if (publication.track) {
          publication.track.enable(!isMicEnabled);
        }
      });
    }
  };
  
  // Toggle video
  const toggleVideo = () => {
    setIsVideoEnabled(prev => !prev);
    
    // If WebRTC is active, toggle video tracks
    if (webRTCStartedRef.current) {
      if (localStreamRef.current) {
        const videoTracks = localStreamRef.current.getVideoTracks();
        videoTracks.forEach(track => {
          track.enabled = !isVideoEnabled;
        });
      }
    }
    
    // If Twilio room exists, toggle those tracks too
    if (twilioRoomRef.current && twilioRoomRef.current.localParticipant) {
      twilioRoomRef.current.localParticipant.videoTracks.forEach(publication => {
        if (publication.track) {
          publication.track.enable(!isVideoEnabled);
        }
      });
    }
  };
  
  // Simulate changing viewer count
  const simulateViewerCount = () => {
    let count = Math.floor(Math.random() * 5) + 1;
    setViewerCount(count);
    
    const interval = setInterval(() => {
      // Random change between -2 and +3 viewers
      const change = Math.floor(Math.random() * 6) - 2;
      count = Math.max(1, count + change); // Ensure at least 1 viewer
      setViewerCount(count);
    }, 15000); // Update every 15 seconds
    
    // Clean up interval when component unmounts or stream ends
    return () => clearInterval(interval);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isLive) {
        stopBroadcastHandler();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  return {
    // Stream metadata
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
    
    // Stream state
    isLive,
    isMicEnabled,
    isVideoEnabled,
    isLoading,
    viewerCount,
    broadcastDuration,
    localStream: localStreamRef.current,
    
    // Stream actions
    startBroadcastHandler,
    stopBroadcastHandler,
    toggleMic,
    toggleVideo
  };
};

export default useBroadcast;
