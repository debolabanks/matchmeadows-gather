
import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { startBroadcast } from '@/services/twilio/twilioBroadcast';
import { Room } from 'twilio-video';
import webRTCService from '@/services/webrtc/webRTCService';

export const useBroadcast = (creatorId: string, creatorName: string) => {
  // Stream metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubscriberOnly, setIsSubscriberOnly] = useState(false);
  
  // Stream state
  const [isLive, setIsLive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [broadcastId, setBroadcastId] = useState<string>('');
  
  // Media state
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  
  const roomRef = useRef<Room | null>(null);
  const { toast } = useToast();
  
  // Calculate broadcast duration
  const [broadcastDuration, setBroadcastDuration] = useState('00:00:00');
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLive && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - startTime.getTime();
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        setBroadcastDuration(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLive, startTime]);
  
  // Start the broadcast
  const startBroadcastHandler = async () => {
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for your broadcast',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Generate a unique broadcast ID
      const newBroadcastId = `live-${creatorId}-${uuidv4()}`;
      setBroadcastId(newBroadcastId);
      
      // Try to use WebRTC first
      try {
        // Start local stream with WebRTC
        await webRTCService.startLocalStream({ audio: true, video: true });
        
        // Create record in broadcasts table
        // TODO: Store broadcast info in database
        
        setIsLive(true);
        setStartTime(new Date());
        
        toast({
          title: 'You are live!',
          description: 'Your stream has started successfully',
        });
        
      } catch (webrtcError) {
        console.error("Failed to start broadcast with WebRTC:", webrtcError);
        
        // Fall back to Twilio
        const room = await startBroadcast(newBroadcastId, {
          audio: isMicEnabled,
          video: isVideoEnabled,
          quality: 'standard',
          screenShare: false,
        });
        
        roomRef.current = room;
        
        setIsLive(true);
        setStartTime(new Date());
        
        toast({
          title: 'You are live!',
          description: 'Your stream has started successfully',
        });
      }
    } catch (error) {
      console.error('Failed to start broadcast:', error);
      toast({
        title: 'Failed to go live',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Stop the broadcast
  const stopBroadcastHandler = async () => {
    try {
      setIsLoading(true);
      
      // Stop WebRTC streams
      webRTCService.stopLocalStream();
      
      // Disconnect Twilio room if it exists
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }
      
      // Update broadcast status in the database
      // TODO: Update broadcast end time in database
      
      setIsLive(false);
      setStartTime(null);
      setBroadcastId('');
      
      toast({
        title: 'Stream ended',
        description: 'Your broadcast has ended successfully',
      });
    } catch (error) {
      console.error('Error stopping broadcast:', error);
      toast({
        title: 'Error ending stream',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle microphone
  const toggleMic = useCallback(() => {
    // Get the local stream from WebRTC service
    const localStream = webRTCService.getLocalStream();
    
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      
      audioTracks.forEach(track => {
        track.enabled = !isMicEnabled;
      });
      
      setIsMicEnabled(!isMicEnabled);
    } else if (roomRef.current) {
      // Fall back to Twilio if WebRTC stream isn't available
      roomRef.current.localParticipant.audioTracks.forEach(publication => {
        if (isMicEnabled) {
          publication.track.disable();
        } else {
          publication.track.enable();
        }
      });
      
      setIsMicEnabled(!isMicEnabled);
    }
  }, [isMicEnabled]);
  
  // Toggle video
  const toggleVideo = useCallback(() => {
    // Get the local stream from WebRTC service
    const localStream = webRTCService.getLocalStream();
    
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      
      setIsVideoEnabled(!isVideoEnabled);
    } else if (roomRef.current) {
      // Fall back to Twilio if WebRTC stream isn't available
      roomRef.current.localParticipant.videoTracks.forEach(publication => {
        if (isVideoEnabled) {
          publication.track.disable();
        } else {
          publication.track.enable();
        }
      });
      
      setIsVideoEnabled(!isVideoEnabled);
    }
  }, [isVideoEnabled]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
      }
      webRTCService.stopLocalStream();
    };
  }, []);
  
  // Simulate viewer count for demo purposes
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setViewerCount(prev => {
          const change = Math.floor(Math.random() * 3) - 1;
          return Math.max(1, prev + change);
        });
      }, 10000);
      
      return () => clearInterval(interval);
    } else {
      setViewerCount(0);
    }
  }, [isLive]);
  
  // Update setTags to ensure it always receives an array of strings
  const updateTags = (tagInput: string) => {
    const newTags = tagInput 
      ? tagInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      : [];
    setTags(newTags);
  };

  return {
    // Stream metadata
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    tags,
    setTags: updateTags,
    isSubscriberOnly,
    setIsSubscriberOnly,
    
    // Stream state
    isLive,
    broadcastId,
    startTime,
    broadcastDuration,
    viewerCount,
    
    // Media state
    isLoading,
    isMicEnabled,
    isVideoEnabled,
    
    // Actions
    startBroadcastHandler,
    stopBroadcastHandler,
    toggleMic,
    toggleVideo
  };
};

export default useBroadcast;
