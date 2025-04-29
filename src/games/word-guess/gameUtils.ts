
// Word categories with their respective word lists
export const WORD_CATEGORIES = {
  Dating: [
    "DATING", "MATCH", "LOVE", "PARTNER", "COUPLE", 
    "ROMANCE", "HEART", "AFFECTION", "CHEMISTRY", "SOULMATE"
  ],
  Activities: [
    "DINNER", "CINEMA", "COFFEE", "BEACH", "TRAVEL",
    "HIKING", "DANCING", "CONCERT", "PICNIC", "MUSEUM"
  ],
  Communication: [
    "FRIEND", "MESSAGE", "PROFILE", "PHOTO", "SMILE",
    "CHAT", "EMOJI", "VIDEO", "CALL", "TEXT"
  ],
  Personality: [
    "CARING", "HONEST", "FUNNY", "SMART", "LOYAL",
    "BRAVE", "CURIOUS", "CREATIVE", "PATIENT", "CHARMING"
  ],
  Interests: [
    "MUSIC", "BOOKS", "MOVIES", "SPORTS", "COOKING",
    "GAMING", "FASHION", "NATURE", "ANIMALS", "SCIENCE"
  ]
};

// Default category when none is selected
export const DEFAULT_CATEGORY = "Dating";

// All categories names for selection
export const CATEGORY_NAMES = Object.keys(WORD_CATEGORIES);

// Maximum number of wrong guesses allowed
export const MAX_WRONG_GUESSES = 6;

// Get a random word from the specified category
export const getRandomWord = (category: string = DEFAULT_CATEGORY): string => {
  const words = WORD_CATEGORIES[category as keyof typeof WORD_CATEGORIES] || 
                WORD_CATEGORIES[DEFAULT_CATEGORY as keyof typeof WORD_CATEGORIES];
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};

// Check if all letters in the word have been guessed
export const checkWin = (word: string, guessedLetters: string[]): boolean => {
  return word.split("").every(letter => guessedLetters.includes(letter));
};

// Check if the game is lost
export const checkLoss = (wrongGuesses: number): boolean => {
  return wrongGuesses >= MAX_WRONG_GUESSES;
};
