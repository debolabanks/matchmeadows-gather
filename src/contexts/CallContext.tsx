
import { createContext, useContext, ReactNode, useState } from "react";
import { useCall } from "@/hooks/useCall";
import VideoCall from "@/components/VideoCall";
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
      
      {/* Incoming call UI - removed to eliminate demo calls */}
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
