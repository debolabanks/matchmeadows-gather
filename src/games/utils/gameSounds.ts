
/**
 * Game sounds utility for playing sound effects in games
 */

// Track if audio is available
let audioAvailable = true;

// Create and configure audio objects
let CORRECT_SOUND: HTMLAudioElement | undefined;
let WRONG_SOUND: HTMLAudioElement | undefined;
let GAME_WIN_SOUND: HTMLAudioElement | undefined;
let GAME_LOSE_SOUND: HTMLAudioElement | undefined;
let GAME_DRAW_SOUND: HTMLAudioElement | undefined;
let GAME_START_SOUND: HTMLAudioElement | undefined;
let CLICK_SOUND: HTMLAudioElement | undefined;

// Initialize audio elements and set up error handling
try {
  // First check if Audio is supported
  if (typeof Audio === 'undefined') {
    audioAvailable = false;
    console.warn('Audio is not available in this environment');
  } else {
    CORRECT_SOUND = new Audio('/assets/correct.mp3');
    WRONG_SOUND = new Audio('/assets/wrong.mp3');
    GAME_WIN_SOUND = new Audio('/assets/win.mp3');
    GAME_LOSE_SOUND = new Audio('/assets/lose.mp3');
    GAME_DRAW_SOUND = new Audio('/assets/draw.mp3');
    GAME_START_SOUND = new Audio('/assets/start.mp3');
    CLICK_SOUND = new Audio('/assets/click.mp3');

    // Configure all audio settings
    [CORRECT_SOUND, WRONG_SOUND, GAME_WIN_SOUND, GAME_LOSE_SOUND, GAME_DRAW_SOUND, GAME_START_SOUND, CLICK_SOUND].forEach(sound => {
      if (sound) {
        sound.volume = 0.5;
        sound.loop = false;
        
        // Add error handlers to prevent uncaught errors
        sound.onerror = () => {
          console.warn('Error loading game sound');
        };
      }
    });
  }
} catch (error) {
  audioAvailable = false;
  console.error("Error initializing sound effects:", error);
}

// Fallback function to handle cases when audio might not be available
const safePlayAudio = (audio: HTMLAudioElement | undefined) => {
  if (!audioAvailable || !audio) return;
  
  try {
    audio.currentTime = 0;
    audio.play().catch(err => {
      console.warn('Error playing sound:', err);
    });
  } catch (err) {
    console.warn('Error playing sound:', err);
  }
};

/**
 * Play correct guess/move sound
 */
export const playCorrectSound = () => {
  safePlayAudio(CORRECT_SOUND);
};

/**
 * Play wrong guess/move sound
 */
export const playWrongSound = () => {
  safePlayAudio(WRONG_SOUND);
};

/**
 * Play game win sound
 */
export const playWinSound = () => {
  safePlayAudio(GAME_WIN_SOUND);
};

/**
 * Play game lose sound
 */
export const playLoseSound = () => {
  safePlayAudio(GAME_LOSE_SOUND);
};

/**
 * Play game draw sound
 */
export const playDrawSound = () => {
  safePlayAudio(GAME_DRAW_SOUND);
};

/**
 * Play game start sound
 */
export const playGameStartSound = () => {
  safePlayAudio(GAME_START_SOUND);
};

/**
 * Play click sound
 */
export const playClickSound = () => {
  safePlayAudio(CLICK_SOUND);
};
