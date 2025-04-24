
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Lock } from "lucide-react";
import EmojiSelector from "./EmojiSelector";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const MessageInput = ({ onSendMessage, disabled = false }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() && !disabled) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  return (
    <div className="p-3 border-t">
      {disabled ? (
        <div className="flex items-center justify-center gap-2 p-2 bg-muted rounded-md">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Match required to chat</p>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Input 
            placeholder="Type a message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            className="flex-1"
            disabled={disabled}
          />
          
          <EmojiSelector onEmojiSelect={handleEmojiSelect} disabled={disabled} />
          
          <Button onClick={handleSendMessage} disabled={!newMessage.trim() || disabled}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
