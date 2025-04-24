
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/contexts/authTypes";

interface ChatInputProps {
  onSendComment: (text: string) => void;
  currentUser: User | null | undefined;
  isSubscriber: boolean;
}

const ChatInput = ({ onSendComment, currentUser, isSubscriber }: ChatInputProps) => {
  const [commentText, setCommentText] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to chat",
        variant: "destructive",
      });
      return;
    }
    
    if (!isSubscriber) {
      toast({
        title: "Subscribers only",
        description: "Only subscribers can chat in this stream",
        variant: "destructive",
      });
      return;
    }
    
    if (commentText.trim()) {
      onSendComment(commentText);
      setCommentText("");
    }
  };

  if (!isSubscriber) {
    return (
      <div className="p-3 bg-muted border-t flex items-center justify-center gap-2">
        <Lock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Subscribe to chat</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
      <Input
        placeholder={currentUser ? "Say something..." : "Sign in to chat"}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        disabled={!currentUser}
        className="text-sm"
      />
      <Button type="submit" size="icon" disabled={!currentUser || !commentText.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
