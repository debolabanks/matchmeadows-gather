
// Word list to randomly select from
export const WORD_LIST = [
  "DATING", "MATCH", "LOVE", "PARTNER", "COUPLE", 
  "ROMANCE", "HEART", "AFFECTION", "CHEMISTRY", "SOULMATE",
  "DINNER", "CINEMA", "COFFEE", "BEACH", "TRAVEL",
  "FRIEND", "MESSAGE", "PROFILE", "PHOTO", "SMILE"
];

// Maximum number of wrong guesses allowed
export const MAX_WRONG_GUESSES = 6;

// Get a random word from the word list
export const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[randomIndex];
};

// Check if all letters in the word have been guessed
export const checkWin = (word: string, guessedLetters: string[]): boolean => {
  return word.split("").every(letter => guessedLetters.includes(letter));
};

// Check if the game is lost
export const checkLoss = (wrongGuesses: number): boolean => {
  return wrongGuesses >= MAX_WRONG_GUESSES;
};
