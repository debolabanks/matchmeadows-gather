
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseWebRTCProps {
  gameId?: string;
}

export const useWebRTC = ({ gameId }: UseWebRTCProps = {}) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const remoteStreams = new Map<string, MediaStream>();
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  
  // Simplified start local stream function
  const startLocalStream = useCallback(async (videoOnly = false) => {
    try {
      setIsConnecting(true);
      const constraints = videoOnly 
        ? { audio: false, video: true }
        : { audio: true, video: true };
        
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      setIsConnected(true);
      setIsConnecting(false);
      return stream;
    } catch (error) {
      console.error('Error starting local stream:', error);
      toast({
        title: "Camera/Microphone Error",
        description: "Could not access your camera or microphone",
        variant: "destructive"
      });
      setIsConnecting(false);
      throw error;
    }
  }, [toast]);

  // Stop local stream
  const stopLocalStream = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      setIsConnected(false);
    }
  }, [localStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocalStream();
    };
  }, [stopLocalStream]);

  return {
    localStream,
    remoteStreams, // Empty map for compatibility
    isConnecting,
    isConnected,
    localVideoRef,
    startLocalStream,
    stopLocalStream,
    // Stub functions for compatibility
    callPeer: () => Promise.resolve(),
    hangup: () => {},
    sendGameData: () => {},
    registerVideoRef: () => {},
    startScreenSharing: () => Promise.reject(new Error('Screen sharing not supported')),
    stopScreenSharing: () => {},
  };
};

