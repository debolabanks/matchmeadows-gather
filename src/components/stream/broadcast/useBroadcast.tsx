import { useState, useRef, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Room } from "twilio-video";
import { startBroadcast } from "@/services/twilio";

export const useBroadcast = (creatorId: string, creatorName: string) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [isSubscriberOnly, setIsSubscriberOnly] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [broadcastDuration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const intervalRef = useRef<number | null>(null);
  const twilioRoomRef = useRef<Room | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (twilioRoomRef.current) {
        twilioRoomRef.current.disconnect();
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  const startBroadcastHandler = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your broadcast",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create a room name based on creator id and timestamp
      const roomName = `${creatorId}-${Date.now()}`;
      
      // Connect to Twilio room
      const room = await startBroadcast(roomName);
      twilioRoomRef.current = room;
      
      // Successfully connected to the room
      setIsLive(true);
      setViewerCount(0);
      setDuration(0);
      
      // Start duration timer
      intervalRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Broadcast started!",
        description: "You are now live. Share your stream with others.",
      });
      
      // Generate a stream ID (in a real app, this would come from the backend)
      const streamId = `${creatorId}-${Date.now()}`;
      
      // Create a new Stream object (in a real app, this would be saved to the database)
      const newStream = {
        id: streamId,
        creatorId,
        creatorName,
        title,
        description,
        category,
        tags: tags.split(",").map(tag => tag.trim()),
        isSubscriberOnly,
        status: "live",
        viewerCount: 0,
        startTime: new Date().toISOString(),
      };
      
      console.log("New stream created:", newStream);
      
      // Simulate random viewers joining
      const viewerInterval = setInterval(() => {
        setViewerCount(prev => {
          const randomChange = Math.floor(Math.random() * 3);
          return prev + randomChange;
        });
      }, 10000);
      
      // Save the interval for cleanup
      const oldInterval = intervalRef.current;
      intervalRef.current = viewerInterval as unknown as number;
      
      return () => {
        clearInterval(oldInterval);
        clearInterval(viewerInterval);
      };
    } catch (error) {
      console.error("Error starting broadcast:", error);
      toast({
        title: "Broadcast error",
        description: "Could not start the broadcast. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const stopBroadcastHandler = () => {
    if (twilioRoomRef.current) {
      twilioRoomRef.current.disconnect();
      twilioRoomRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsLive(false);
    setDuration(0);
    setViewerCount(0);
    
    toast({
      title: "Broadcast ended",
      description: "Your broadcast has ended successfully.",
    });
  };
  
  const toggleMic = () => {
    setIsMicEnabled(!isMicEnabled);
    
    if (twilioRoomRef.current) {
      const audioTracks = Array.from(twilioRoomRef.current.localParticipant.audioTracks.values());
      audioTracks.forEach(publication => {
        if (publication.track) {
          isMicEnabled ? publication.track.disable() : publication.track.enable();
        }
      });
    }
  };
  
  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    
    if (twilioRoomRef.current) {
      const videoTracks = Array.from(twilioRoomRef.current.localParticipant.videoTracks.values());
      videoTracks.forEach(publication => {
        if (publication.track) {
          isVideoEnabled ? publication.track.disable() : publication.track.enable();
        }
      });
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
    isMicEnabled,
    isVideoEnabled,
    viewerCount,
    broadcastDuration,
    isLoading,
    startBroadcastHandler,
    stopBroadcastHandler,
    toggleMic,
    toggleVideo
  };
};
