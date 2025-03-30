
import { createContext, useContext, ReactNode } from "react";
import { useCall } from "@/hooks/useCall";
import VideoCall from "@/components/VideoCall";
import { Button } from "@/components/ui/button";
import { Phone, Video, X } from "lucide-react";

interface CallContextType {
  startCall: (contactId: string, contactName: string, contactImage: string, type: "video" | "voice") => void;
  simulateIncomingCall: (fromId: string, fromName: string, fromImage: string, type: "video" | "voice") => void;
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
    simulateIncomingCall
  } = useCall();

  return (
    <CallContext.Provider value={{ startCall, simulateIncomingCall }}>
      {children}
      
      {/* Active call overlay */}
      {activeCall && (
        <VideoCall
          contactId={activeCall.participants.find(p => p !== "currentUser") || ""}
          contactName="Contact" // In a real app, you would get this from a contact lookup
          contactImage="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" // Placeholder
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
