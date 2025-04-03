
import React from "react";
import { CallSession } from "@/types/message";

interface CallAvatarProps {
  contactName: string;
  contactImage: string;
  callStatus: CallSession["status"];
  duration: number;
  formatDuration: (seconds: number) => string;
}

const CallAvatar = ({
  contactName,
  contactImage,
  callStatus,
  duration,
  formatDuration
}: CallAvatarProps) => {
  return (
    <div className="flex flex-col items-center justify-center absolute inset-0">
      <div className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden mb-4 border-4 border-primary">
        <img src={contactImage} alt={contactName} className="w-full h-full object-cover" />
      </div>
      <h2 className="text-white text-xl font-semibold">{contactName}</h2>
      <p className="text-gray-300 mt-2">
        {callStatus === "connected" 
          ? formatDuration(duration)
          : callStatus === "connecting" 
            ? "Connecting..."
            : callStatus}
      </p>
    </div>
  );
};

export default CallAvatar;
