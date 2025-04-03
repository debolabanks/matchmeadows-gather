
import { StreamComment } from "@/types/stream";
import { User } from "@/contexts/authTypes";
import ChatMessageList from "./chat/ChatMessageList";
import ChatInput from "./chat/ChatInput";
import { formatTimestamp } from "./chat/utils/timeUtils";

interface StreamChatProps {
  comments: StreamComment[];
  onSendComment: (text: string) => void;
  currentUser: User | null | undefined;
  isSubscriber: boolean;
}

const StreamChat = ({ comments, onSendComment, currentUser, isSubscriber }: StreamChatProps) => {
  return (
    <div className="flex flex-col h-full">
      <ChatMessageList comments={comments} formatTimestamp={formatTimestamp} />
      <ChatInput 
        onSendComment={onSendComment} 
        currentUser={currentUser}
        isSubscriber={isSubscriber}
      />
    </div>
  );
};

export default StreamChat;
