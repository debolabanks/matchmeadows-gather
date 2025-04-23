
import { supabase, storeOfflineData } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/message";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";

// Create a message in the database
export const sendMessage = async (
  senderId: string, 
  receiverId: string, 
  text: string
): Promise<ChatMessage | null> => {
  try {
    const newMessage: Omit<ChatMessage, 'id'> = {
      senderId,
      receiverId, // Added receiverId to ensure proper recipient tracking
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
    
    // Try to send to Supabase if online
    if (navigator.onLine) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert(messageWithId)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error sending message to server:", error);
        // Fall back to offline storage
        await storeOfflineData("messages", messageWithId);
        toast({
          title: "Message saved offline",
          description: "Will be sent when you're back online"
        });
        return messageWithId;
      }
    } else {
      // Store offline
      await storeOfflineData("messages", messageWithId);
      toast({
        title: "Message saved offline",
        description: "Will be sent when you're back online"
      });
      return messageWithId;
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
  
  // Return the subscription if online
  if (navigator.onLine) {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, payload => {
        // Play notification sound for new messages
        const audio = new Audio('/assets/new-message.mp3');
        audio.volume = 0.5;
        audio.play().catch(err => console.log('Audio play error:', err));
        callback(payload.new);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
      console.log("Unsubscribed from messages in conversation:", conversationId);
    };
  }
  
  // Return a dummy unsubscribe function if offline
  return () => {
    console.log("Offline: No active subscription to unsubscribe from");
  };
};

// Mark messages as read
export const markMessagesAsRead = async (
  messageIds: string[]
): Promise<void> => {
  try {
    if (navigator.onLine) {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .in('id', messageIds);
        
      if (error) throw error;
      console.log("Marked messages as read:", messageIds);
    } else {
      // Store the read status update for later synchronization
      const readUpdate = {
        timestamp: new Date().toISOString(),
        messageIds,
        action: 'mark_read'
      };
      await storeOfflineData("message_updates", readUpdate);
      console.log("Stored read status update for offline sync:", messageIds);
    }
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
