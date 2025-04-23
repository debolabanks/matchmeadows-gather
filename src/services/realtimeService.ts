
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/message";
import { v4 as uuidv4 } from "uuid";

// Create a message in the database
export const sendMessage = async (
  senderId: string, 
  receiverId: string, 
  text: string
): Promise<ChatMessage | null> => {
  try {
    const newMessage: Omit<ChatMessage, 'id'> = {
      senderId,
      text,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // For now, we're using a client-side ID since we don't have an actual DB
    // In a real implementation, this would be an INSERT into a messages table
    return {
      id: `msg-${uuidv4()}`,
      ...newMessage
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};

// Subscribe to messages in a conversation
export const subscribeToMessages = (
  conversationId: string, 
  callback: (message: ChatMessage) => void
) => {
  // In a real implementation with Supabase, you would use:
  // return supabase
  //   .channel(`messages:${conversationId}`)
  //   .on('postgres_changes', { 
  //     event: 'INSERT', 
  //     schema: 'public', 
  //     table: 'messages',
  //     filter: `conversation_id=eq.${conversationId}`
  //   }, payload => {
  //     callback(payload.new);
  //   })
  //   .subscribe();
  
  // For now, just return an unsubscribe function
  return () => {
    console.log("Unsubscribed from messages in conversation:", conversationId);
  };
};

// Mark messages as read
export const markMessagesAsRead = async (
  messageIds: string[]
): Promise<void> => {
  try {
    // In a real implementation, this would be:
    // await supabase
    //   .from('messages')
    //   .update({ read: true })
    //   .in('id', messageIds);
    
    console.log("Marked messages as read:", messageIds);
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};
