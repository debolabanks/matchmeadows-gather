
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { webRTCService } from '@/services/webrtc/webRTCService';
import { useToast } from '@/hooks/use-toast';
import { Match } from '@/types/match';

interface UseWebRTCProps {
  gameId?: string;
}

interface WebRTCState {
  isConnecting: boolean;
  isConnected: boolean;
  remoteStreams: Map<string, MediaStream>;
  localStream: MediaStream | null;
  screenStream: MediaStream | null;
  connectionStates: Map<string, RTCPeerConnectionState>;
  gameData: any[];
}

export const useWebRTC = ({ gameId }: UseWebRTCProps = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<WebRTCState>({
    isConnecting: false,
    isConnected: false,
    remoteStreams: new Map(),
    localStream: null,
    screenStream: null,
    connectionStates: new Map(),
    gameData: []
  });

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Initialize WebRTC service with user ID
  useEffect(() => {
    if (user?.id) {
      webRTCService.initialize(user.id);
      
      // Set up event listeners
      webRTCService.onStream((stream, peerId) => {
        setState(prev => ({
          ...prev,
          remoteStreams: new Map(prev.remoteStreams).set(peerId, stream)
        }));
      });
      
      webRTCService.onData((data, peerId) => {
        setState(prev => ({
          ...prev,
          gameData: [...prev.gameData, { peerId, data, timestamp: Date.now() }]
        }));
      });
      
      webRTCService.onConnectionStateChange((state, peerId) => {
        setState(prev => ({
          ...prev,
          connectionStates: new Map(prev.connectionStates).set(peerId, state),
          isConnected: state === 'connected' || prev.isConnected
        }));
        
        if (state === 'connected') {
          toast({
            title: "Connection established",
            description: "You are now connected to your friend"
          });
        } else if (state === 'disconnected' || state === 'failed' || state === 'closed') {
          toast({
            title: "Connection lost",
            description: "The connection to your friend has been lost",
            variant: "destructive"
          });
        }
      });
    }
    
    return () => {
      webRTCService.cleanup();
    };
  }, [user?.id, toast]);

  // Attach streams to video elements when they change
  useEffect(() => {
    // Attach local stream
    if (state.localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = state.localStream;
    }
    
    // Attach remote streams
    state.remoteStreams.forEach((stream, peerId) => {
      const videoElement = remoteVideoRefs.current.get(peerId);
      if (videoElement && videoElement.srcObject !== stream) {
        videoElement.srcObject = stream;
      }
    });
  }, [state.localStream, state.remoteStreams]);

  // Start local media stream
  const startLocalStream = useCallback(async (videoOnly = false) => {
    try {
      setState(prev => ({ ...prev, isConnecting: true }));
      
      const constraints = videoOnly 
        ? { audio: false, video: true }
        : { audio: true, video: true };
        
      const stream = await webRTCService.startLocalStream(constraints);
      
      setState(prev => ({ 
        ...prev, 
        localStream: stream,
        isConnecting: false
      }));
      
      return stream;
    } catch (error) {
      console.error('Error starting local stream:', error);
      toast({
        title: "Camera/Microphone Error",
        description: "Could not access your camera or microphone",
        variant: "destructive"
      });
      setState(prev => ({ ...prev, isConnecting: false }));
      throw error;
    }
  }, [toast]);

  // Start screen sharing
  const startScreenSharing = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isConnecting: true }));
      
      const stream = await webRTCService.startScreenSharing();
      
      setState(prev => ({ 
        ...prev, 
        screenStream: stream,
        isConnecting: false
      }));
      
      return stream;
    } catch (error) {
      console.error('Error starting screen sharing:', error);
      toast({
        title: "Screen Sharing Error",
        description: "Could not share your screen",
        variant: "destructive"
      });
      setState(prev => ({ ...prev, isConnecting: false }));
      throw error;
    }
  }, [toast]);

  // Stop local stream
  const stopLocalStream = useCallback(() => {
    webRTCService.stopLocalStream();
    setState(prev => ({ ...prev, localStream: null }));
  }, []);

  // Stop screen sharing
  const stopScreenSharing = useCallback(() => {
    webRTCService.stopScreenSharing();
    setState(prev => ({ ...prev, screenStream: null }));
  }, []);

  // Call a peer
  const callPeer = useCallback(async (peerId: string) => {
    try {
      setState(prev => ({ ...prev, isConnecting: true }));
      
      // Start local stream if not already started
      if (!state.localStream) {
        await startLocalStream();
      }
      
      await webRTCService.call(peerId, gameId);
      
      toast({
        title: "Calling peer",
        description: "Establishing connection..."
      });
    } catch (error) {
      console.error('Error calling peer:', error);
      toast({
        title: "Call Failed",
        description: "Could not establish connection to peer",
        variant: "destructive"
      });
      setState(prev => ({ ...prev, isConnecting: false }));
    }
  }, [state.localStream, startLocalStream, gameId, toast]);

  // Hangup call
  const hangup = useCallback((peerId?: string) => {
    webRTCService.hangup(peerId);
    
    if (!peerId) {
      // If hanging up all calls, also stop local streams
      stopLocalStream();
      stopScreenSharing();
      
      setState(prev => ({
        ...prev,
        isConnected: false,
        remoteStreams: new Map(),
        connectionStates: new Map()
      }));
    } else {
      // Just remove the specific peer's stream and state
      setState(prev => {
        const newRemoteStreams = new Map(prev.remoteStreams);
        newRemoteStreams.delete(peerId);
        
        const newConnectionStates = new Map(prev.connectionStates);
        newConnectionStates.delete(peerId);
        
        const stillConnected = Array.from(newConnectionStates.values())
          .some(state => state === 'connected');
        
        return {
          ...prev,
          remoteStreams: newRemoteStreams,
          connectionStates: newConnectionStates,
          isConnected: stillConnected
        };
      });
    }
  }, [stopLocalStream, stopScreenSharing]);

  // Send game data to a peer
  const sendGameData = useCallback((data: any, peerId?: string) => {
    if (peerId) {
      webRTCService.sendGameData(data, peerId);
    } else {
      webRTCService.broadcastGameData(data);
    }
  }, []);

  // Register a video element for a peer
  const registerVideoRef = useCallback((peerId: string, ref: HTMLVideoElement | null) => {
    if (ref) {
      remoteVideoRefs.current.set(peerId, ref);
      
      // If we already have a stream for this peer, attach it
      const stream = state.remoteStreams.get(peerId);
      if (stream) {
        ref.srcObject = stream;
      }
    } else {
      remoteVideoRefs.current.delete(peerId);
    }
  }, [state.remoteStreams]);

  return {
    // State
    localStream: state.localStream,
    screenStream: state.screenStream,
    remoteStreams: state.remoteStreams,
    isConnecting: state.isConnecting,
    isConnected: state.isConnected,
    connectionStates: state.connectionStates,
    gameData: state.gameData,
    
    // Refs
    localVideoRef,
    
    // Actions
    startLocalStream,
    stopLocalStream,
    startScreenSharing,
    stopScreenSharing,
    callPeer,
    hangup,
    sendGameData,
    registerVideoRef
  };
};
