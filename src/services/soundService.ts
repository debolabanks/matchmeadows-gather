
/**
 * Sound service for playing notification sounds
 */

// Sound files
const INCOMING_CALL_SOUND = new Audio('/src/assets/incoming-call.mp3');
const NEW_MESSAGE_SOUND = new Audio('/src/assets/new-message.mp3');

// Configure audio settings
INCOMING_CALL_SOUND.loop = true;
NEW_MESSAGE_SOUND.loop = false;

let activeSound: HTMLAudioElement | null = null;

/**
 * Play incoming call sound
 */
export const playIncomingCallSound = () => {
  stopAllSounds();
  INCOMING_CALL_SOUND.play().catch(err => console.error('Error playing call sound:', err));
  activeSound = INCOMING_CALL_SOUND;
};

/**
 * Play new message sound
 */
export const playNewMessageSound = () => {
  stopAllSounds();
  NEW_MESSAGE_SOUND.play().catch(err => console.error('Error playing message sound:', err));
  activeSound = NEW_MESSAGE_SOUND;
};

/**
 * Stop all currently playing sounds
 */
export const stopAllSounds = () => {
  if (activeSound) {
    activeSound.pause();
    activeSound.currentTime = 0;
    activeSound = null;
  }
  
  // Ensure both sounds are stopped
  INCOMING_CALL_SOUND.pause();
  INCOMING_CALL_SOUND.currentTime = 0;
  NEW_MESSAGE_SOUND.pause();
  NEW_MESSAGE_SOUND.currentTime = 0;
};
