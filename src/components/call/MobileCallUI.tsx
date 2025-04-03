
import React from "react";
import { CallSession } from "@/types/message";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, User, VideoOff } from "lucide-react";
import CallControls from "./CallControls";

interface MobileCallUIProps {
  incomingCall: CallSession | null;
  currentCall: CallSession | null;
  isConnectingCall: boolean;
  isOngoingCall: boolean;
  isIncomingCall: boolean;
  callType: "voice" | "video";
  callDuration: number;
  contactName: string;
  contactImage?: string;
  localMuted: boolean;
  cameraOff: boolean;
  formatDuration: (seconds: number) => string;
  handleAcceptCall: () => void;
  handleRejectCall: () => void;
  handleEndCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
}

const MobileCallUI: React.FC<MobileCallUIProps> = ({
  incomingCall,
  isConnectingCall,
  isOngoingCall,
  isIncomingCall,
  callType,
  callDuration,
  contactName,
  contactImage,
  localMuted,
  cameraOff,
  formatDuration,
  handleAcceptCall,
  handleRejectCall,
  handleEndCall,
  toggleMute,
  toggleCamera,
}) => {
  return (
    <>
      <Drawer open={isIncomingCall} onOpenChange={open => !open && handleRejectCall()}>
        <DrawerContent className="max-h-[50%]">
          <DrawerHeader>
            <DrawerTitle className="text-center text-xl">
              Incoming {incomingCall?.type} call
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={contactImage} />
              <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold">{contactName}</h2>
          </div>
          <DrawerFooter className="pt-2">
            <div className="flex justify-between gap-4">
              <Button 
                variant="destructive" 
                className="flex-1 gap-2" 
                onClick={handleRejectCall}
              >
                <PhoneOff className="h-4 w-4" />
                Decline
              </Button>
              <Button 
                variant="default" 
                className="flex-1 gap-2 bg-green-600 hover:bg-green-700" 
                onClick={handleAcceptCall}
              >
                <Phone className="h-4 w-4" />
                Accept
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      <Drawer open={isOngoingCall || isConnectingCall} onOpenChange={open => !open && handleEndCall()}>
        <DrawerContent className="max-h-[90%]">
          <DrawerHeader>
            <DrawerTitle className="text-center">
              {isConnectingCall ? "Connecting..." : formatDuration(callDuration)}
            </DrawerTitle>
          </DrawerHeader>
          
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            {callType === "video" ? (
              <div className="h-64 w-full bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                {cameraOff ? (
                  <VideoOff className="h-10 w-10 text-gray-400" />
                ) : (
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={contactImage} />
                        <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="absolute bottom-4 right-4 w-28 h-40 bg-gray-700 rounded-md overflow-hidden">
                      {/* This would be the local camera preview */}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Avatar className="h-32 w-32 mb-6">
                <AvatarImage src={contactImage} />
                <AvatarFallback><User className="h-16 w-16" /></AvatarFallback>
              </Avatar>
            )}
            
            <h2 className="text-xl font-semibold mb-1">{contactName}</h2>
            <p className="text-sm text-muted-foreground mb-6">
              {isConnectingCall ? "Connecting..." : "Connected"}
            </p>
            
            <CallControls
              callType={callType}
              localMuted={localMuted}
              cameraOff={cameraOff}
              onToggleMute={toggleMute}
              onToggleCamera={toggleCamera}
              onEndCall={handleEndCall}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileCallUI;
