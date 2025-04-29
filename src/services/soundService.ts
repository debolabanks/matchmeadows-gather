
// Sound effect utility for the application

// Cache sounds for better performance
const soundCache: Record<string, HTMLAudioElement> = {};

// Default audio paths - using absolute paths to ensure they're found
const AUDIO_PATHS = {
  NEW_MESSAGE: '/assets/new-message.mp3',
  INCOMING_CALL: '/assets/incoming-call.mp3'
};

/**
 * Preload commonly used sounds to improve responsiveness
 * This ensures sounds are cached and ready to play when needed
 */
export const preloadSounds = (): void => {
  try {
    console.log("Preloading sound effects...");
    const commonSounds = [
      AUDIO_PATHS.NEW_MESSAGE,
      AUDIO_PATHS.INCOMING_CALL
    ];
    
    commonSounds.forEach(soundPath => {
      try {
        // Create audio element but don't try to load it if it might fail
        const audio = new Audio();
        
        // Add error handler before setting src to prevent unhandled errors
        audio.onerror = (e) => {
          console.warn(`Could not load sound: ${soundPath}`, e);
        };
        
        // Now set the source
        audio.src = soundPath;
        soundCache[soundPath] = audio;
        
        // Attempt to load but catch errors
        audio.load();
        console.log(`Attempting to preload sound: ${soundPath}`);
      } catch (error) {
        console.warn(`Failed to initialize sound: ${soundPath}`, error);
      }
    });
  } catch (error) {
    console.error("Failed to preload sounds:", error);
  }
};

/**
 * Play a new message notification sound
 */
export const playNewMessageSound = (): HTMLAudioElement | null => {
  return playSound(AUDIO_PATHS.NEW_MESSAGE);
};

/**
 * Play an incoming call notification sound
 */
export const playIncomingCallSound = (): HTMLAudioElement | null => {
  return playSound(AUDIO_PATHS.INCOMING_CALL, true);
};

/**
 * Generic sound player with caching
 */
const playSound = (soundPath: string, loop: boolean = false): HTMLAudioElement | null => {
  try {
    console.log(`Attempting to play sound: ${soundPath}`);
    
    // Try to get from cache first
    let sound = soundCache[soundPath];
    
    // Create and cache if doesn't exist
    if (!sound) {
      sound = new Audio(soundPath);
      
      // Add error handler to prevent uncaught errors
      sound.onerror = (e) => {
        console.warn(`Failed to play sound: ${soundPath}`, e);
        return null;
      };
      
      soundCache[soundPath] = sound;
    }
    
    // Configure sound
    sound.loop = loop;
    sound.currentTime = 0;
    
    // Play the sound with error handling
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
export const stopSound = (soundPath: string): void => {
  const sound = soundCache[soundPath];
  if (sound) {
    sound.pause();
    sound.currentTime = 0;
  }
};

/**
 * Stop all currently playing sounds
 */
export const stopAllSounds = (): void => {
  Object.values(soundCache).forEach(sound => {
    sound.pause();
    sound.currentTime = 0;
  });
};

/**
 * Check if audio is currently available/enabled in the browser
 */
export const isAudioAvailable = (): boolean => {
  try {
    return typeof Audio !== 'undefined';
  } catch {
    return false;
  }
};


