
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import webRTCService from '@/services/webrtc/webRTCService';

// Placeholder for actual stream service that would be implemented with a real backend
const streamService = {
  startStream: async (data: any) => {
    console.log('Starting stream with data:', data);
    // This would actually call your backend API
    return { streamId: uuidv4() };
  },
  stopStream: async (streamId: string) => {
    console.log('Stopping stream:', streamId);
    // This would actually call your backend API
    return { success: true };
  },
};

export function useBroadcast(creatorId: string, creatorName: string) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('gaming');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubscriberOnly, setIsSubscriberOnly] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const startTimeRef = useRef<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [broadcastDuration, setBroadcastDuration] = useState('00:00:00');
  
  // Update duration timer when broadcasting
  useEffect(() => {
    if (isLive && !timerRef.current) {
      startTimeRef.current = new Date();
      
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const now = new Date();
          const diff = now.getTime() - startTimeRef.current.getTime();
          
          const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
          const minutes = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
          const seconds = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
          
          setBroadcastDuration(`${hours}:${minutes}:${seconds}`);
        }
      }, 1000);
    } else if (!isLive && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      startTimeRef.current = null;
      setBroadcastDuration('00:00:00');
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLive]);
  
  // Handle microphone toggle
  const toggleMic = () => {
    const localStream = webRTCService.getLocalStream();
    
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isMicEnabled;
      });
    }
    
    setIsMicEnabled(!isMicEnabled);
    
    toast({
      title: isMicEnabled ? 'Microphone disabled' : 'Microphone enabled',
      variant: isMicEnabled ? 'default' : 'default',
    });
  };
  
  // Handle video toggle
  const toggleVideo = () => {
    const localStream = webRTCService.getLocalStream();
    
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
    }
    
    setIsVideoEnabled(!isVideoEnabled);
    
    toast({
      title: isVideoEnabled ? 'Camera disabled' : 'Camera enabled',
      variant: isVideoEnabled ? 'default' : 'default',
    });
  };
  
  // Start broadcasting
  const startBroadcastHandler = async () => {
    if (!title) {
      toast({
        title: 'Stream title is required',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Initialize camera and microphone
      await webRTCService.startLocalStream({ 
        audio: true, 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
          facingMode: 'user'
        } 
      });
      
      // Create stream in the backend
      const { streamId: newStreamId } = await streamService.startStream({
        creatorId,
        title,
        description,
        category,
        tags,
        isSubscriberOnly,
        quality: 'standard'  // Fixed to use valid enum value
      });
      
      setStreamId(newStreamId);
      setIsLive(true);
      
      toast({
        title: 'Stream started!',
        description: 'You are now live.',
      });
      
      // Mock viewer count increase
      const viewerCountInterval = setInterval(() => {
        setViewerCount(prev => {
          const increase = Math.floor(Math.random() * 3);
          return prev + increase;
        });
      }, 15000);
      
      return () => clearInterval(viewerCountInterval);
    } catch (err) {
      console.error('Error starting broadcast:', err);
      setError('Failed to start broadcast');
      toast({
        title: 'Failed to start stream',
        description: 'Please check your camera and microphone permissions.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Stop broadcasting
  const stopBroadcastHandler = async () => {
    try {
      setIsLoading(true);
      
      // Stop the stream in the backend
      if (streamId) {
        await streamService.stopStream(streamId);
      }
      
      // Clean up WebRTC resources
      webRTCService.stopLocalStream();
      
      setIsLive(false);
      setStreamId(null);
      setViewerCount(0);
      
      toast({
        title: 'Stream ended',
        description: 'Your broadcast has ended.',
      });
    } catch (err) {
      console.error('Error stopping broadcast:', err);
      toast({
        title: 'Error ending stream',
        description: 'There was a problem ending your stream.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
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
    isLive,
    streamId,
    viewerCount,
    isMicEnabled,
    isVideoEnabled,
    isLoading,
    error,
    broadcastDuration,
    startBroadcastHandler,
    stopBroadcastHandler,
    toggleMic,
    toggleVideo
  };
}
