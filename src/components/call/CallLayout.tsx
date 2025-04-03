
import React from "react";
import { VideoCallState } from "@/hooks/useVideoCall";

interface CallLayoutProps {
  children: React.ReactNode;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  state: VideoCallState;
  callType: "video" | "voice";
  contactName: string;
  isFullscreen: boolean;
}

const CallLayout = ({
  children,
  remoteVideoRef,
  localVideoRef,
  containerRef,
  state,
  callType,
  contactName,
  isFullscreen
}: CallLayoutProps) => {
  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-black flex flex-col ${
        isFullscreen ? 'fullscreen' : ''
      }`}
    >
      <div className="relative flex-1 flex items-center justify-center bg-gray-900">
        {callType === "video" && (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        
        <div className="absolute top-8 left-0 right-0 text-center">
          {state.callStatus === "connecting" && !state.remoteParticipant && (
            <p className="text-white bg-black/30 py-1 px-3 rounded-full inline-block">
              Calling {contactName}...
            </p>
          )}
        </div>
        
        {callType === "video" && !state.isVideoOff && (
          <div className="absolute top-4 right-4 w-28 h-40 md:w-40 md:h-56 rounded-lg overflow-hidden border-2 border-white">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {children}
      </div>
      
      <div className="bg-black p-4 flex justify-center">
        {/* Controls go here - provided via children */}
      </div>
    </div>
  );
};

export default CallLayout;
