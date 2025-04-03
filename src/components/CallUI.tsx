import React, { useEffect, useState } from "react";
import { useCall } from "@/contexts/CallContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, User } from "lucide-react";
import { stopIncomingCallSound } from "@/services/soundService";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface CallUIProps {
  contactName?: string;
  contactImage?: string;
}

const CallUI: React.FC<CallUIProps> = ({ contactName = "User", contactImage }) => {
  const { currentCall, incomingCall, acceptCall, rejectCall, endCall } = useCall();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [localMuted, setLocalMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimerId, setCallTimerId] = useState<number | null>(null);
  
  const isIncomingCall = Boolean(incomingCall);
  const isOngoingCall = Boolean(currentCall && currentCall.status === "connected");
  const isConnectingCall = Boolean(currentCall && currentCall.status === "connecting");
  const callType = currentCall?.type || incomingCall?.type || "voice";
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleAcceptCall = () => {
    stopIncomingCallSound();
    acceptCall();
  };
  
  const handleRejectCall = () => {
    stopIncomingCallSound();
    rejectCall();
  };
  
  const handleEndCall = () => {
    if (callTimerId) {
      clearInterval(callTimerId);
      setCallTimerId(null);
    }
    endCall();
  };
  
  const toggleMute = () => {
    setLocalMuted(!localMuted);
    toast({
      title: !localMuted ? "Microphone muted" : "Microphone unmuted",
      variant: "default",
    });
  };
  
  const toggleCamera = () => {
    setCameraOff(!cameraOff);
    toast({
      title: !cameraOff ? "Camera turned off" : "Camera turned on",
      variant: "default",
    });
  };
  
  useEffect(() => {
    if (isOngoingCall && !callTimerId) {
      const timerId = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      setCallTimerId(Number(timerId));
      
      return () => {
        clearInterval(timerId);
        setCallTimerId(null);
      };
    }
    
    if (!isOngoingCall && callTimerId) {
      clearInterval(callTimerId);
      setCallTimerId(null);
      setCallDuration(0);
    }
  }, [isOngoingCall, callTimerId]);
  
  useEffect(() => {
    return () => {
      stopIncomingCallSound();
    };
  }, []);
  
  useEffect(() => {
    if (isIncomingCall) {
      return () => {
        stopIncomingCallSound();
      };
    }
  }, [isIncomingCall]);

  const renderCallControls = () => (
    <div className="flex items-center justify-center gap-4">
      {callType === "video" && (
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-12 w-12"
          onClick={toggleCamera}
        >
          {cameraOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full h-12 w-12"
        onClick={toggleMute}
      >
        {localMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </Button>
      
      <Button 
        variant="destructive" 
        size="icon" 
        className="rounded-full h-14 w-14"
        onClick={handleEndCall}
      >
        <PhoneOff className="h-6 w-6" />
      </Button>
    </div>
  );
  
  if (isMobile) {
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
              
              {renderCallControls()}
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }
  
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
            {renderCallControls()}
          </CardFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CallUI;
