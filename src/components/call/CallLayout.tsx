
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
        {/* Remote video container - always render the video element but control visibility with CSS */}
        <div className="w-full h-full absolute inset-0">
          {callType === "video" && (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${!state.remoteParticipant ? 'opacity-0' : 'opacity-100'}`}
            />
          )}
        </div>
        
        <div className="absolute top-8 left-0 right-0 text-center z-10">
          {state.callStatus === "connecting" && !state.remoteParticipant && (
            <p className="text-white bg-black/30 py-1 px-3 rounded-full inline-block">
              Calling {contactName}...
            </p>
          )}
        </div>
        
        {/* Local video preview for video calls */}
        {callType === "video" && (
          <div className="absolute top-4 right-4 w-28 h-40 md:w-40 md:h-56 rounded-lg overflow-hidden border-2 border-white z-10 bg-gray-800">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${state.isVideoOff ? 'opacity-0' : 'opacity-100'}`}
            />
            {state.isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <span>Camera off</span>
              </div>
            )}
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default CallLayout;
