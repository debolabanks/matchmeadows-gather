import React, { useState, useEffect } from "react";
import { StreamComment, StreamChatMessage } from "@/types/stream";
import { User } from "@/types/user";
import ChatMessageList from "./chat/ChatMessageList";
import ChatInput from "./chat/ChatInput";
import { formatTimestamp } from "./chat/utils/timeUtils";
import { Button } from "../ui/button";
import { Lock, Gift, PlusCircle, Heart, Star } from "lucide-react";
import { Badge } from "../ui/badge";
import { playNewMessageSound } from "@/services/soundService";

interface StreamChatProps {
  comments: StreamComment[];
  onSendComment: (text: string) => void;
  currentUser: User | null | undefined;
  isSubscriber: boolean;
  isCreator?: boolean;
  viewerCount?: number;
}

const StreamChat = ({ 
  comments, 
  onSendComment, 
  currentUser, 
  isSubscriber,
  isCreator = false,
  viewerCount = 0
}: StreamChatProps) => {
  const [chatMessages, setChatMessages] = useState<StreamChatMessage[]>([]);
  const [showReactions, setShowReactions] = useState(false);

  // Convert comments to chat messages on update
  useEffect(() => {
    const messages = comments.map(comment => ({
      id: comment.id,
      userId: comment.userId,
      userName: comment.userName,
      userImage: comment.userImage,
      message: comment.text,
      timestamp: new Date(comment.timestamp),
      isCreator: comment.isCreator || false,
      isModerator: false
    }));
    
    setChatMessages(messages);
    
    // Play sound for new messages
    if (messages.length > chatMessages.length && chatMessages.length > 0) {
      playNewMessageSound();
    }
  }, [comments]);

  // Handle reactions and donations
  const handleReaction = (type: string) => {
    onSendComment(`${type === 'heart' ? '❤️' : type === 'fire' ? '🔥' : '👏'}`);
    setShowReactions(false);
  };
  
  const handleDonation = () => {
    // In a real app, this would open a donation modal
    alert("Donation feature would open here!");
  };
  
  // Render viewer badges based on engagement
  const renderViewerBadge = (viewerId: string) => {
    // In a real app, these would be based on actual user engagement metrics
    const hashedId = viewerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    
    if (hashedId % 5 === 0) return <Badge className="bg-purple-500 text-xs">Top Fan</Badge>;
    if (hashedId % 7 === 0) return <Badge className="bg-blue-500 text-xs">Supporter</Badge>;
    if (hashedId % 11 === 0) return <Badge className="bg-amber-500 text-xs">New</Badge>;
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-muted/30 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Chat</span>
          {viewerCount > 0 && (
            <Badge variant="outline" className="text-xs">
              {viewerCount} watching
            </Badge>
          )}
        </div>
        
        {isCreator && (
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            Mod Settings
          </Button>
        )}
      </div>
      
      <ChatMessageList 
        comments={comments} 
        formatTimestamp={formatTimestamp}
        renderBadge={renderViewerBadge}
      />
      
      {isSubscriber ? (
        <div className="border-t">
          <div className="p-2 flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={() => setShowReactions(!showReactions)}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
            
            {showReactions && (
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleReaction('heart')}
                >
                  <Heart className="h-4 w-4 text-red-500" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleReaction('fire')}
                >
                  <span className="text-amber-500">🔥</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleReaction('clap')}
                >
                  <span>👏</span>
                </Button>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={handleDonation}
            >
              <Gift className="h-4 w-4 text-purple-500" />
            </Button>
            
            <ChatInput 
              onSendComment={onSendComment} 
              currentUser={currentUser} 
              isSubscriber={isSubscriber}
            />
          </div>
        </div>
      ) : (
        <div className="p-4 border-t text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Subscriber-only chat</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Subscribe to engage with this creator and join the conversation
          </p>
          <Button size="sm">Subscribe</Button>
        </div>
      )}
    </div>
  );
};

export default StreamChat;
