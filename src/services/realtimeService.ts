
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { ChatMessage } from "@/types/message";

// Create a message
export const sendMessage = async (
  senderId: string, 
  receiverId: string, 
  text: string
): Promise<ChatMessage | null> => {
  try {
    const newMessage: Omit<ChatMessage, 'id'> = {
      senderId,
      receiverId,
      text,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Generate client-side ID
    const messageWithId = {
      id: `msg-${uuidv4()}`,
      ...newMessage
    };
    
    // Play a sound when message is sent
    const audio = new Audio('/assets/new-message.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Audio play error:', err));
    
    // Store message in localStorage instead of Supabase
    try {
      // Get existing messages
      const existingMessagesJSON = localStorage.getItem('matchmeadows_messages') || '[]';
      const existingMessages = JSON.parse(existingMessagesJSON);
      
      // Add new message
      existingMessages.push(messageWithId);
      
      // Save back to localStorage
      localStorage.setItem('matchmeadows_messages', JSON.stringify(existingMessages));
      
      // Show toast notification
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully"
      });
      
      return messageWithId;
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please check your connection and try again",
        variant: "destructive"
      });
      return null;
    }
  } catch (error) {
    console.error("Error sending message:", error);
    toast({
      title: "Failed to send message",
      description: "Please check your connection and try again",
      variant: "destructive"
    });
    return null;
  }
};

// Subscribe to messages in a conversation
export const subscribeToMessages = (
  conversationId: string, 
  callback: (message: ChatMessage) => void
) => {
  console.log(`Subscribing to messages in conversation: ${conversationId}`);
  
  // Set up a listener for local storage changes
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'matchmeadows_messages') {
      const messages = JSON.parse(event.newValue || '[]');
      const latestMessage = messages[messages.length - 1];
      
      // Check if the message belongs to this conversation
      if (latestMessage && 
          (latestMessage.senderId === conversationId || latestMessage.receiverId === conversationId)) {
        // Play notification sound for new messages
        const audio = new Audio('/assets/new-message.mp3');
        audio.volume = 0.5;
        audio.play().catch(err => console.log('Audio play error:', err));
        
        callback(latestMessage);
      }
    }
  };
  
  // Add event listener
  window.addEventListener('storage', handleStorageChange);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    console.log("Unsubscribed from messages in conversation:", conversationId);
  };
};

// Mark messages as read
export const markMessagesAsRead = async (
  messageIds: string[]
): Promise<void> => {
  try {
    // Get existing messages from localStorage
    const existingMessagesJSON = localStorage.getItem('matchmeadows_messages') || '[]';
    const existingMessages = JSON.parse(existingMessagesJSON);
    
    // Update read status
    const updatedMessages = existingMessages.map((message: ChatMessage) => {
      if (messageIds.includes(message.id)) {
        return { ...message, read: true };
      }
      return message;
    });
    
    // Save back to localStorage
    localStorage.setItem('matchmeadows_messages', JSON.stringify(updatedMessages));
    
    console.log("Marked messages as read:", messageIds);
  } catch (error) {
    console.error("Error marking messages as read:", error);
    toast({
      title: "Failed to mark messages as read",
      description: "Please check your connection and try again",
      variant: "destructive"
    });
  }
};

// Add local vibration for mobile devices when receiving messages
export const vibrateOnMessage = () => {
  if (navigator.vibrate) {
    navigator.vibrate(200);
  }
};
