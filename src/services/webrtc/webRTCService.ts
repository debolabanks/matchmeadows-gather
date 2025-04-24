
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

export interface PeerConnection {
  pc: RTCPeerConnection;
  id: string;
  streams: MediaStream[];
}

export interface RTCMessage {
  type: 'offer' | 'answer' | 'ice-candidate';
  sender: string;
  target: string;
  payload: any;
  gameId?: string;
}

class WebRTCService {
  private peerConnections: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private localScreenStream: MediaStream | null = null;
  private userId: string = '';
  private roomSubscription: any = null;
  private onStreamCallbacks: ((stream: MediaStream, peerId: string) => void)[] = [];
  private onDataCallbacks: ((data: any, peerId: string) => void)[] = [];
  private onConnectionStateChangeCallbacks: ((state: RTCPeerConnectionState, peerId: string) => void)[] = [];
  
  // ICE server configuration with free STUN servers
  private config: RTCConfiguration = {
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302'
        ]
      }
    ],
    iceCandidatePoolSize: 10
  };

  /**
   * Initialize WebRTC service with user ID
   */
  initialize(userId: string): void {
    this.userId = userId;
    this.setupSignalingChannel();
  }

  /**
   * Set up the signaling channel for WebRTC using Supabase Realtime
   */
  private setupSignalingChannel(): void {
    if (this.roomSubscription) {
      // Remove existing subscription if there is one
      supabase.removeChannel(this.roomSubscription);
    }

    // Subscribe to the signaling channel to exchange SDP and ICE candidates
    this.roomSubscription = supabase.channel('webrtc-signaling')
      .on('broadcast', { event: 'rtc-message' }, (payload) => {
        const message = payload.payload as RTCMessage;
        
        // Only process messages intended for this user
        if (message.target === this.userId) {
          this.handleSignalingMessage(message);
        }
      })
      .subscribe((status) => {
        console.log('WebRTC signaling channel status:', status);
      });
  }

  /**
   * Handle incoming signaling messages
   */
  private async handleSignalingMessage(message: RTCMessage): Promise<void> {
    try {
      const { type, sender, payload } = message;

      // Create peer connection if it doesn't exist
      if (!this.peerConnections.has(sender)) {
        await this.createPeerConnection(sender);
      }

      const peerConnection = this.peerConnections.get(sender);
      if (!peerConnection) return;

      switch (type) {
        case 'offer':
          // Set the remote description from the received offer
          await peerConnection.pc.setRemoteDescription(new RTCSessionDescription(payload));
          
          // Create an answer
          const answer = await peerConnection.pc.createAnswer();
          await peerConnection.pc.setLocalDescription(answer);
          
          // Send the answer back
          this.sendSignalingMessage({
            type: 'answer',
            sender: this.userId,
            target: sender,
            payload: answer,
            gameId: message.gameId
          });
          break;

        case 'answer':
          // Set the remote description from the received answer
          await peerConnection.pc.setRemoteDescription(new RTCSessionDescription(payload));
          break;

        case 'ice-candidate':
          // Add the ICE candidate if it exists
          if (payload) {
            try {
              await peerConnection.pc.addIceCandidate(new RTCIceCandidate(payload));
            } catch (e) {
              console.error('Error adding ICE candidate:', e);
            }
          }
          break;
      }
    } catch (error) {
      console.error('Error handling signaling message:', error);
    }
  }

  /**
   * Send a signaling message through the channel
   */
  private sendSignalingMessage(message: RTCMessage): void {
    if (this.roomSubscription) {
      this.roomSubscription.send({
        type: 'broadcast',
        event: 'rtc-message',
        payload: message
      });
    }
  }

  /**
   * Create a new peer connection with a given peer ID
   */
  private async createPeerConnection(peerId: string): Promise<void> {
    try {
      // Create a new RTCPeerConnection
      const pc = new RTCPeerConnection(this.config);
      
      // Create a new entry in our peer connections map
      const peerConnection: PeerConnection = {
        pc,
        id: peerId,
        streams: []
      };
      
      this.peerConnections.set(peerId, peerConnection);

      // Set up data channel for game data
      const dataChannel = pc.createDataChannel('game-data', {
        ordered: true
      });
      
      dataChannel.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onDataCallbacks.forEach(callback => callback(data, peerId));
        } catch (e) {
          console.error('Error parsing data channel message:', e);
        }
      };

      // Handle incoming data channels
      pc.ondatachannel = (event) => {
        const channel = event.channel;
        channel.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            this.onDataCallbacks.forEach(callback => callback(data, peerId));
          } catch (error) {
            console.error('Error parsing incoming data channel message:', error);
          }
        };
      };

      // Add all local tracks to the peer connection
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          pc.addTrack(track, this.localStream!);
        });
      }

      // Add screen sharing tracks if available
      if (this.localScreenStream) {
        this.localScreenStream.getTracks().forEach(track => {
          pc.addTrack(track, this.localScreenStream!);
        });
      }

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          this.sendSignalingMessage({
            type: 'ice-candidate',
            sender: this.userId,
            target: peerId,
            payload: event.candidate
          });
        }
      };

      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        this.onConnectionStateChangeCallbacks.forEach(callback => 
          callback(pc.connectionState, peerId)
        );
      };

      // Handle incoming tracks
      pc.ontrack = (event) => {
        const stream = event.streams[0];
        peerConnection.streams.push(stream);
        
        // Notify listeners about the new stream
        this.onStreamCallbacks.forEach(callback => callback(stream, peerId));
      };
    } catch (error) {
      console.error('Error creating peer connection:', error);
    }
  }

  /**
   * Start a call with a peer
   */
  async call(peerId: string, gameId?: string): Promise<void> {
    try {
      // Create peer connection if it doesn't exist
      if (!this.peerConnections.has(peerId)) {
        await this.createPeerConnection(peerId);
      }

      const peerConnection = this.peerConnections.get(peerId);
      if (!peerConnection) return;

      // Create an offer
      const offer = await peerConnection.pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });

      await peerConnection.pc.setLocalDescription(offer);

      // Send the offer to the peer
      this.sendSignalingMessage({
        type: 'offer',
        sender: this.userId,
        target: peerId,
        payload: offer,
        gameId
      });
    } catch (error) {
      console.error('Error initiating call:', error);
    }
  }

  /**
   * Send game data to a peer
   */
  sendGameData(data: any, peerId: string): void {
    try {
      const peerConnection = this.peerConnections.get(peerId);
      if (!peerConnection) return;

      // Find the data channel
      const dataChannels = peerConnection.pc.getSenders()
        .filter(sender => sender.track && sender.track.kind === 'data')
        .map(sender => sender.track);
        
      const senders = peerConnection.pc.getSenders();
      
      // Attempt to find data channel via another method
      let dataChannel = null;
      try {
        dataChannel = peerConnection.pc.createDataChannel('game-data');
      } catch (e) {
        // Channel may already exist, try to get it
        console.log('Data channel may already exist');
      }

      if (dataChannel && dataChannel.readyState === 'open') {
        dataChannel.send(JSON.stringify(data));
      } else {
        console.warn('Data channel not ready');
      }
    } catch (error) {
      console.error('Error sending game data:', error);
    }
  }

  /**
   * Broadcast game data to all connected peers
   */
  broadcastGameData(data: any): void {
    for (const peerId of this.peerConnections.keys()) {
      this.sendGameData(data, peerId);
    }
  }

  /**
   * Start local media stream (audio/video)
   */
  async startLocalStream(constraints: MediaStreamConstraints = { audio: true, video: true }): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Add tracks to all existing peer connections
      this.peerConnections.forEach((peerConnection) => {
        if (this.localStream) {
          this.localStream.getTracks().forEach(track => {
            peerConnection.pc.addTrack(track, this.localStream!);
          });
        }
      });
      
      return this.localStream;
    } catch (error) {
      console.error('Error starting local stream:', error);
      throw error;
    }
  }

  /**
   * Start screen sharing
   */
  async startScreenSharing(): Promise<MediaStream> {
    try {
      // @ts-ignore - TypeScript doesn't recognize getDisplayMedia
      this.localScreenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      
      // Add tracks to all existing peer connections
      this.peerConnections.forEach((peerConnection) => {
        if (this.localScreenStream) {
          this.localScreenStream.getTracks().forEach(track => {
            peerConnection.pc.addTrack(track, this.localScreenStream!);
          });
        }
      });
      
      return this.localScreenStream;
    } catch (error) {
      console.error('Error starting screen sharing:', error);
      throw error;
    }
  }

  /**
   * Stop local media stream
   */
  stopLocalStream(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }

  /**
   * Stop screen sharing
   */
  stopScreenSharing(): void {
    if (this.localScreenStream) {
      this.localScreenStream.getTracks().forEach(track => track.stop());
      this.localScreenStream = null;
    }
  }

  /**
   * Hangup call with a specific peer or all peers
   */
  hangup(peerId?: string): void {
    if (peerId && this.peerConnections.has(peerId)) {
      // Close connection with specific peer
      const peerConnection = this.peerConnections.get(peerId);
      if (peerConnection) {
        peerConnection.pc.close();
      }
      this.peerConnections.delete(peerId);
    } else {
      // Close all connections
      this.peerConnections.forEach((peerConnection) => {
        peerConnection.pc.close();
      });
      this.peerConnections.clear();
    }
  }

  /**
   * Register callback for new streams
   */
  onStream(callback: (stream: MediaStream, peerId: string) => void): void {
    this.onStreamCallbacks.push(callback);
  }

  /**
   * Register callback for data channel messages
   */
  onData(callback: (data: any, peerId: string) => void): void {
    this.onDataCallbacks.push(callback);
  }

  /**
   * Register callback for connection state changes
   */
  onConnectionStateChange(callback: (state: RTCPeerConnectionState, peerId: string) => void): void {
    this.onConnectionStateChangeCallbacks.push(callback);
  }
  
  /**
   * Get local stream (for external use by other components)
   */
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  /**
   * Clean up all resources
   */
  cleanup(): void {
    // Stop all media tracks
    this.stopLocalStream();
    this.stopScreenSharing();
    
    // Close all peer connections
    this.hangup();
    
    // Unsubscribe from signaling channel
    if (this.roomSubscription) {
      supabase.removeChannel(this.roomSubscription);
      this.roomSubscription = null;
    }
  }
}

// Create and export a singleton instance
export const webRTCService = new WebRTCService();

export default webRTCService;
