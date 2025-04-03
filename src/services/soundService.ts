
// Function to play new message sound
export const playNewMessageSound = () => {
  const audio = new Audio('/src/assets/new-message.mp3');
  audio.play().catch(error => {
    console.error('Error playing message sound:', error);
  });
};

// Function to play incoming call sound
export const playIncomingCallSound = () => {
  const audio = new Audio('/src/assets/incoming-call.mp3');
  audio.loop = true;
  audio.play().catch(error => {
    console.error('Error playing call sound:', error);
  });
  
  // Store audio reference to be able to stop it later
  window.incomingCallAudio = audio;
  
  return audio;
};

// Function to stop incoming call sound
export const stopIncomingCallSound = () => {
  if (window.incomingCallAudio) {
    window.incomingCallAudio.pause();
    window.incomingCallAudio.currentTime = 0;
  }
};

// Add the audio element to the Window interface
declare global {
  interface Window {
    incomingCallAudio: HTMLAudioElement | null;
  }
}

// Initialize
window.incomingCallAudio = null;
