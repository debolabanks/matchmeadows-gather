
import React from "react";
import { CallSession } from "@/types/message";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, User, VideoOff } from "lucide-react";
import CallControls from "./CallControls";

interface DesktopCallUIProps {
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

const DesktopCallUI: React.FC<DesktopCallUIProps> = ({
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
      <Dialog open={isIncomingCall} onOpenChange={open => !open && handleRejectCall()}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-semibold mb-4">
              Incoming {incomingCall?.type} call
            </h2>
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={contactImage} />
              <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-medium mb-6">{contactName}</h3>
            
            <div className="flex gap-4">
              <Button 
                variant="destructive" 
                className="gap-2" 
                onClick={handleRejectCall}
              >
                <PhoneOff className="h-4 w-4" />
                Decline
              </Button>
              <Button 
                variant="default" 
                className="gap-2 bg-green-600 hover:bg-green-700" 
                onClick={handleAcceptCall}
              >
                <Phone className="h-4 w-4" />
                Accept
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isOngoingCall || isConnectingCall} onOpenChange={open => !open && handleEndCall()}>
        <DialogContent className="sm:max-w-md">
          <CardHeader className="text-center">
            <CardTitle>
              {isConnectingCall ? "Connecting..." : formatDuration(callDuration)}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center space-y-4">
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
              <Avatar className="h-32 w-32">
                <AvatarImage src={contactImage} />
                <AvatarFallback><User className="h-16 w-16" /></AvatarFallback>
              </Avatar>
            )}
            
            <h2 className="text-xl font-semibold">{contactName}</h2>
            <p className="text-sm text-muted-foreground">
              {isConnectingCall ? "Connecting..." : "Connected"}
            </p>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <CallControls
              callType={callType}
              localMuted={localMuted}
              cameraOff={cameraOff}
              onToggleMute={toggleMute}
              onToggleCamera={toggleCamera}
              onEndCall={handleEndCall}
            />
          </CardFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DesktopCallUI;
