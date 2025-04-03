
import { format } from "date-fns";
import { ChatMessage } from "@/types/message";
import MessageAttachment from "@/components/MessageAttachment";
import MessageReactions from "@/components/MessageReactions";
import MessageReportButton from "@/components/MessageReportButton";

interface MessageDisplayProps {
  messages: ChatMessage[];
  selectedContactName: string;
}

const MessageDisplay = ({ messages, selectedContactName }: MessageDisplayProps) => {
  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    // This would be implemented with real functionality
    console.log(`Adding reaction ${emoji} to message ${messageId}`);
  };

  return (
    <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
      {messages.map(message => (
        <div 
          key={message.id} 
          className={`group flex ${message.senderId === "currentUser" ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[70%] rounded-lg p-3 ${
              message.senderId === "currentUser" 
                ? 'bg-primary text-primary-foreground rounded-br-none' 
                : 'bg-muted rounded-bl-none'
            }`}
          >
            <p>{message.text}</p>
            
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map(attachment => (
                  <MessageAttachment 
                    key={attachment.id} 
                    attachment={attachment} 
                  />
                ))}
              </div>
            )}
            
            <div 
              className={`text-xs mt-1 ${
                message.senderId === "currentUser" 
                  ? 'text-primary-foreground/70' 
                  : 'text-muted-foreground'
              }`}
            >
              {formatMessageTime(message.timestamp)}
            </div>
            
            {message.reactions && message.reactions.length > 0 && (
              <MessageReactions 
                reactions={message.reactions}
                onAddReaction={(emoji) => handleAddReaction(message.id, emoji)}
                messageId={message.id}
                className="mt-2"
              />
            )}
          </div>
          
          {message.senderId !== "currentUser" && (
            <MessageReportButton 
              messageId={message.id} 
              senderName={selectedContactName} 
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageDisplay;
