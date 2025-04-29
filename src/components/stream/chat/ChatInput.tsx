import React, { useState } from "react";
import { Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/types/user";

interface ChatInputProps {
  onSendComment: (text: string) => void;
  currentUser: User | null | undefined;
  isSubscriber: boolean;
  disabled?: boolean;
}

const ChatInput = ({ 
  onSendComment, 
  currentUser, 
  isSubscriber,
  disabled = false
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubscriber || !message.trim()) return;
    
    onSendComment(message.trim());
    setMessage("");
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-1">
      <Button
        type="button"
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-full shrink-0"
      >
        <Smile className="h-4 w-4" />
      </Button>
      
      <Input 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isSubscriber ? "Send a message..." : "Subscribe to chat..."}
        disabled={!isSubscriber || disabled || !currentUser}
        className="h-8 text-sm"
      />
      
      <Button 
        type="submit"
        size="icon" 
        variant="ghost" 
        className="h-8 w-8 rounded-full shrink-0"
        disabled={!isSubscriber || !message.trim() || disabled || !currentUser}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
