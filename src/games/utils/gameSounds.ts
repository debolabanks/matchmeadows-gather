
/**
 * Game sounds utility for playing sound effects in games
 */

// Base URL for sounds
const SOUND_BASE_URL = '/src/assets/';

// Create and configure audio objects
const CORRECT_SOUND = new Audio(`${SOUND_BASE_URL}new-message.mp3`);
const WRONG_SOUND = new Audio(`${SOUND_BASE_URL}incoming-call.mp3`);
const GAME_WIN_SOUND = new Audio(`${SOUND_BASE_URL}new-message.mp3`);
const GAME_LOSE_SOUND = new Audio(`${SOUND_BASE_URL}incoming-call.mp3`);
const GAME_DRAW_SOUND = new Audio(`${SOUND_BASE_URL}new-message.mp3`);
const GAME_START_SOUND = new Audio(`${SOUND_BASE_URL}new-message.mp3`);
const CLICK_SOUND = new Audio(`${SOUND_BASE_URL}new-message.mp3`);

// Configure all audio settings
[CORRECT_SOUND, WRONG_SOUND, GAME_WIN_SOUND, GAME_LOSE_SOUND, GAME_DRAW_SOUND, GAME_START_SOUND, CLICK_SOUND].forEach(sound => {
  sound.volume = 0.5;
  sound.loop = false;
});

/**
 * Play correct guess/move sound
 */
export const playCorrectSound = () => {
  CORRECT_SOUND.currentTime = 0;
  CORRECT_SOUND.play().catch(err => console.error('Error playing correct sound:', err));
};

/**
 * Play wrong guess/move sound
 */
export const playWrongSound = () => {
  WRONG_SOUND.currentTime = 0;
  WRONG_SOUND.play().catch(err => console.error('Error playing wrong sound:', err));
};

/**
 * Play game win sound
 */
export const playWinSound = () => {
  GAME_WIN_SOUND.currentTime = 0;
  GAME_WIN_SOUND.play().catch(err => console.error('Error playing win sound:', err));
};

/**
 * Play game lose sound
 */
export const playLoseSound = () => {
  GAME_LOSE_SOUND.currentTime = 0;
  GAME_LOSE_SOUND.play().catch(err => console.error('Error playing lose sound:', err));
};

/**
 * Play game draw sound
 */
export const playDrawSound = () => {
  GAME_DRAW_SOUND.currentTime = 0;
  GAME_DRAW_SOUND.play().catch(err => console.error('Error playing draw sound:', err));
};

/**
 * Play game start sound
 */
export const playGameStartSound = () => {
  GAME_START_SOUND.currentTime = 0;
  GAME_START_SOUND.play().catch(err => console.error('Error playing start sound:', err));
};

/**
 * Play click sound
 */
export const playClickSound = () => {
  CLICK_SOUND.currentTime = 0;
  CLICK_SOUND.play().catch(err => console.error('Error playing click sound:', err));
};
