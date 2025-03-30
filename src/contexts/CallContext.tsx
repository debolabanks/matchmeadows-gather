
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useCall } from "@/hooks/useCall";
import VideoCall from "@/components/VideoCall";
import { Button } from "@/components/ui/button";
import { Phone, Video, X } from "lucide-react";
import { Room, LocalTrack } from "twilio-video";

interface CallContextType {
  startCall: (contactId: string, contactName: string, contactImage: string, type: "video" | "voice") => void;
  simulateIncomingCall: (fromId: string, fromName: string, fromImage: string, type: "video" | "voice") => void;
  twilioRoom: Room | null;
  localTracks: LocalTrack[];
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider = ({ children }: { children: ReactNode }) => {
  const {
    activeCall,
    incomingCall,
    startCall,
    endCall,
    acceptIncomingCall,
    rejectIncomingCall,
    simulateIncomingCall,
    twilioRoom,
    localTracks
  } = useCall();

  // Simulate an incoming call after the app loads (demo purpose)
  useEffect(() => {
    const timer = setTimeout(() => {
      simulateIncomingCall(
        "1", 
        "Sophie Chen", 
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80", 
        Math.random() > 0.5 ? "video" : "voice"
      );
    }, 15000); // 15 seconds after loading
    
    return () => clearTimeout(timer);
  }, [simulateIncomingCall]);

  return (
    <CallContext.Provider value={{ startCall, simulateIncomingCall, twilioRoom, localTracks }}>
      {children}
      
      {/* Active call overlay */}
      {activeCall && (
        <VideoCall
          contactId={activeCall.participants.find(p => p !== "currentUser") || ""}
          contactName={(activeCall.type === "video" ? "Video" : "Voice") + " call with " + (
            activeCall.participants.includes("1") ? "Sophie Chen" :
            activeCall.participants.includes("2") ? "James Wilson" :
            activeCall.participants.includes("3") ? "Olivia Martinez" : "Contact"
          )}
          contactImage={
            activeCall.participants.includes("1") ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80" :
            activeCall.participants.includes("2") ? "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80" :
            activeCall.participants.includes("3") ? "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80" :
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
          }
          callType={activeCall.type}
          onEnd={endCall}
        />
      )}
      
      {/* Incoming call UI */}
      {incomingCall && !activeCall && (
        <div className="fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-sm p-4 border-b shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={incomingCall.from.imageUrl} 
                alt={incomingCall.from.name}
                className="h-12 w-12 rounded-full object-cover border-2 border-primary animate-pulse" 
              />
              {incomingCall.type === "video" ? (
                <Video className="absolute -bottom-1 -right-1 h-5 w-5 bg-primary text-primary-foreground rounded-full p-1" />
              ) : (
                <Phone className="absolute -bottom-1 -right-1 h-5 w-5 bg-primary text-primary-foreground rounded-full p-1" />
              )}
            </div>
            
            <div>
              <p className="font-medium">{incomingCall.from.name}</p>
              <p className="text-sm text-muted-foreground">
                Incoming {incomingCall.type} call...
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10"
              onClick={rejectIncomingCall}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <Button
              variant="default"
              size="icon"
              className="rounded-full h-10 w-10 bg-green-500 hover:bg-green-600"
              onClick={acceptIncomingCall}
            >
              {incomingCall.type === "video" ? (
                <Video className="h-4 w-4" />
              ) : (
                <Phone className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </CallContext.Provider>
  );
};

export const useCallContext = () => {
  const context = useContext(CallContext);
  
  if (context === undefined) {
    throw new Error("useCallContext must be used within a CallProvider");
  }
  
  return context;
};
