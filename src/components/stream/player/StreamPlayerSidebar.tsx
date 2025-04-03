
import { StreamComment } from "@/types/stream";
import { User } from "@/contexts/authTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StreamChat from "@/components/stream/StreamChat";
import StreamInfoTab from "@/components/stream/info/StreamInfoTab";

interface StreamPlayerSidebarProps {
  stream: any;
  comments: StreamComment[];
  currentUser?: User | null;
  isSubscriber: boolean;
  isFullscreen: boolean;
  activeTab: string;
  onActiveTabChange: (value: string) => void;
  onSendComment: (text: string) => void;
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
    <div className={`w-full md:w-80 flex-shrink-0 border rounded-lg overflow-hidden bg-card ${isFullscreen ? 'fixed right-0 top-0 bottom-0 z-50 w-80' : ''}`}>
      <Tabs defaultValue="chat" value={activeTab} onValueChange={onActiveTabChange} className="h-full flex flex-col">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="info">Stream Info</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="flex-1 overflow-hidden flex flex-col">
          <StreamChat 
            comments={comments}
            onSendComment={onSendComment}
            currentUser={currentUser}
            isSubscriber={isSubscriber}
          />
        </TabsContent>
        <TabsContent value="info" className="flex-1 overflow-auto p-4">
          <StreamInfoTab stream={stream} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StreamPlayerSidebar;
