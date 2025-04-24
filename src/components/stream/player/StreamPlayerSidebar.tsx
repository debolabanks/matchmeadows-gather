
import { User } from "@/contexts/authTypes";
import { Stream, StreamComment } from "@/types/stream";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import StreamChat from "@/components/stream/StreamChat";
import StreamInfoTab from "@/components/stream/info/StreamInfoTab";
import SubscriptionPromo from "./SubscriptionPromo";

interface StreamPlayerSidebarProps {
  stream: Stream;
  comments: StreamComment[];
  currentUser?: User | null;
  isSubscriber: boolean;
  isFullscreen: boolean;
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
  onSendComment: (text: string, user: User | null | undefined) => void;
}

const StreamPlayerSidebar = ({
  stream,
  comments,
  currentUser,
  isSubscriber,
  isFullscreen,
  activeTab,
  onActiveTabChange,
  onSendComment
}: StreamPlayerSidebarProps) => {
  return (
    <div className={`flex flex-col w-full md:w-80 ${isFullscreen ? 'absolute right-0 top-0 h-full bg-background border-l' : ''}`}>
      <Tabs value={activeTab} onValueChange={onActiveTabChange} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col">
          <StreamChat
            comments={comments}
            onSendComment={(text) => onSendComment(text, currentUser)}
            currentUser={currentUser}
            isSubscriber={isSubscriber}
          />
        </TabsContent>
        
        <TabsContent value="info" className="flex-1 overflow-y-auto p-4">
          <StreamInfoTab stream={stream} />
        </TabsContent>
      </Tabs>
      
      <Separator />
      
      <div className="p-4">
        <SubscriptionPromo 
          stream={stream} 
          currentUser={currentUser} 
          onSubscribe={() => window.location.href = `/creators/${stream.creatorId}?subscribe=true`}
        />
      </div>
    </div>
  );
};

export default StreamPlayerSidebar;
