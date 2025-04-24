
// Sound effect utility for the application

// Cache sounds for better performance
const soundCache: Record<string, HTMLAudioElement> = {};

/**
 * Play a new message notification sound
 */
export const playNewMessageSound = () => {
  playSound('/assets/new-message.mp3');
};

/**
 * Play an incoming call notification sound
 */
export const playIncomingCallSound = () => {
  playSound('/assets/incoming-call.mp3', true);
};

/**
 * Generic sound player with caching
 */
const playSound = (soundPath: string, loop: boolean = false) => {
  try {
    // Try to get from cache first
    let sound = soundCache[soundPath];
    
    // Create and cache if doesn't exist
    if (!sound) {
      sound = new Audio(soundPath);
      soundCache[soundPath] = sound;
    }
    
    // Configure sound
    sound.loop = loop;
    sound.currentTime = 0;
    
    // Play the sound
    sound.play().catch(err => {
      console.warn('Failed to play sound:', err);
    });
    
    return sound;
  } catch (error) {
    console.error('Error playing sound:', error);
    return null;
  }
};

/**
 * Stop a currently playing sound
 */
export const stopSound = (soundPath: string) => {
  const sound = soundCache[soundPath];
  if (sound) {
    sound.pause();
    sound.currentTime = 0;
  }
};

/**
 * Stop all currently playing sounds
 */
export const stopAllSounds = () => {
  Object.values(soundCache).forEach(sound => {
    sound.pause();
    sound.currentTime = 0;
  });
};
