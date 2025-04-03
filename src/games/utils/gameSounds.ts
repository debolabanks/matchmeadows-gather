
/**
 * Game sounds utility for playing sound effects in games
 */

// Create and configure audio objects
let CORRECT_SOUND: HTMLAudioElement;
let WRONG_SOUND: HTMLAudioElement;
let GAME_WIN_SOUND: HTMLAudioElement;
let GAME_LOSE_SOUND: HTMLAudioElement;
let GAME_DRAW_SOUND: HTMLAudioElement;
let GAME_START_SOUND: HTMLAudioElement;
let CLICK_SOUND: HTMLAudioElement;

// Initialize audio elements and set up error handling
try {
  CORRECT_SOUND = new Audio('/assets/correct.mp3');
  WRONG_SOUND = new Audio('/assets/wrong.mp3');
  GAME_WIN_SOUND = new Audio('/assets/win.mp3');
  GAME_LOSE_SOUND = new Audio('/assets/lose.mp3');
  GAME_DRAW_SOUND = new Audio('/assets/draw.mp3');
  GAME_START_SOUND = new Audio('/assets/start.mp3');
  CLICK_SOUND = new Audio('/assets/click.mp3');

  // Configure all audio settings
  [CORRECT_SOUND, WRONG_SOUND, GAME_WIN_SOUND, GAME_LOSE_SOUND, GAME_DRAW_SOUND, GAME_START_SOUND, CLICK_SOUND].forEach(sound => {
    sound.volume = 0.5;
    sound.loop = false;
  });
} catch (error) {
  console.error("Error initializing sound effects:", error);
}

// Fallback function to handle cases when audio might not be available
const safePlayAudio = (audio: HTMLAudioElement | undefined) => {
  if (!audio) return;
  
  audio.currentTime = 0;
  audio.play().catch(err => {
    console.error('Error playing sound:', err);
  });
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
