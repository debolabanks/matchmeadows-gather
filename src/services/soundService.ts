
import { useEffect, useRef } from "react";

const NEW_MESSAGE_SOUND = "/assets/new-message.mp3";
const INCOMING_CALL_SOUND = "/assets/incoming-call.mp3";

// Track active sound elements
const activeSounds: HTMLAudioElement[] = [];

// Preload sounds when the app first loads
export const preloadSounds = () => {
  try {
    // Create and preload audio elements but don't play them
    const newMessageAudio = new Audio(NEW_MESSAGE_SOUND);
    const incomingCallAudio = new Audio(INCOMING_CALL_SOUND);
    
    // Just load them but don't play them
    newMessageAudio.load();
    incomingCallAudio.load();
  } catch (error) {
    console.warn("Could not preload sounds:", error);
    // Don't throw errors, just continue with the app
  }
};

export const playNewMessageSound = () => {
  try {
    const audio = new Audio(NEW_MESSAGE_SOUND);
    audio.play().catch(error => {
      console.warn("Error playing new message sound:", error);
      // Don't throw errors, just continue with the app
    });
    activeSounds.push(audio);
  } catch (error) {
    console.warn("Error creating audio element for new message sound:", error);
    // Don't throw errors, just continue with the app
  }
};

export const playIncomingCallSound = (loop = true) => {
  try {
    const audio = new Audio(INCOMING_CALL_SOUND);
    if (loop) {
      audio.loop = true;
    }
    audio.play().catch(error => {
      console.warn("Error playing incoming call sound:", error);
      // Don't throw errors, just continue with the app
    });
    activeSounds.push(audio);
    return audio;
  } catch (error) {
    console.warn("Error creating audio element for incoming call sound:", error);
    // Don't throw errors, just continue with the app
    return null;
  }
};

/**
 * Stop all currently playing sounds
 */
export const stopAllSounds = (): void => {
  try {
    // Stop all active sounds
    for (const audio of activeSounds) {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
    // Clear the active sounds array
    activeSounds.length = 0;
  } catch (error) {
    console.warn("Error stopping sounds:", error);
    // Don't throw errors, just continue with the app
  }
};

export const useAudioPlayer = (src: string, autoPlay = false, loop = false) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(src);
        audioRef.current.loop = loop;
        
        if (autoPlay) {
          audioRef.current.play().catch(error => {
            console.warn("Error auto-playing audio:", error);
          });
        }
      }
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    } catch (error) {
      console.warn("Error setting up audio player:", error);
      return () => {};
    }
  }, [src, autoPlay, loop]);
  
  const play = () => {
    try {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.warn("Error playing audio:", error);
        });
      }
    } catch (error) {
      console.warn("Error playing audio:", error);
    }
  };
  
  const pause = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } catch (error) {
      console.warn("Error pausing audio:", error);
    }
  };
  
  return { play, pause };
};
