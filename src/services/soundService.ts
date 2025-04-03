
// Sound effect handlers for calls and messages

let incomingCallSound: HTMLAudioElement | null = null;
let newMessageSound: HTMLAudioElement | null = null;

/**
 * Initialize a sound element
 */
const createAudioElement = (src: string): HTMLAudioElement => {
  const audio = new Audio(src);
  audio.loop = false;
  return audio;
};

/**
 * Play the incoming call sound
 */
export const playIncomingCallSound = (): void => {
  stopAllSounds();
  
  if (!incomingCallSound) {
    incomingCallSound = createAudioElement('/assets/incoming-call.mp3');
    incomingCallSound.loop = true;
  }
  
  incomingCallSound.play().catch(error => {
    console.error("Error playing incoming call sound:", error);
  });
};

/**
 * Play the new message notification sound
 */
export const playNewMessageSound = (): void => {
  if (!newMessageSound) {
    newMessageSound = createAudioElement('/assets/new-message.mp3');
  }
  
  // Reset to beginning if already playing
  newMessageSound.currentTime = 0;
  
  newMessageSound.play().catch(error => {
    console.error("Error playing new message sound:", error);
  });
};

/**
 * Stop all currently playing sounds
 */
export const stopAllSounds = (): void => {
  if (incomingCallSound) {
    incomingCallSound.pause();
    incomingCallSound.currentTime = 0;
  }
};

/**
 * Preload all sounds for better performance
 */
export const preloadSounds = (): void => {
  if (!incomingCallSound) {
    incomingCallSound = createAudioElement('/assets/incoming-call.mp3');
    incomingCallSound.preload = 'auto';
  }
  
  if (!newMessageSound) {
    newMessageSound = createAudioElement('/assets/new-message.mp3');
    newMessageSound.preload = 'auto';
  }
};
