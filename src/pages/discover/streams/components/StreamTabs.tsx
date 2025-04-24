
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StreamList from "@/components/stream/StreamList";
import { Stream } from "@/types/stream";
import StreamsEmptyState from "./StreamsEmptyState";

interface StreamTabsProps {
  activeTabValue: string;
  onTabChange: (value: string) => void;
  liveStreams: Stream[];
  scheduledStreams: Stream[];
  filteredStreams: Stream[];
}

const StreamTabs = ({ 
  activeTabValue, 
  onTabChange, 
  liveStreams, 
  scheduledStreams, 
  filteredStreams 
}: StreamTabsProps) => {
  return (
    <Tabs value={activeTabValue} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All Streams</TabsTrigger>
        <TabsTrigger value="live">Live Now</TabsTrigger>
        <TabsTrigger value="scheduled">Upcoming</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-10">
        {liveStreams.length > 0 && (
          <StreamList 
            streams={liveStreams} 
            title="Live Now" 
            description="Creators streaming at this moment"
          />
        )}
        
        {scheduledStreams.length > 0 && (
          <StreamList 
            streams={scheduledStreams} 
            title="Upcoming Streams" 
            description="Scheduled streams you might be interested in"
          />
        )}
        
        {filteredStreams.length === 0 && (
          <StreamsEmptyState />
        )}
      </TabsContent>
      
      <TabsContent value="live">
        {liveStreams.length > 0 ? (
          <StreamList 
            streams={liveStreams} 
            title="Live Now" 
            description="Creators streaming at this moment"
          />
        ) : (
          <StreamsEmptyState message="No live streams found" description="Check back later or browse upcoming streams" />
        )}
      </TabsContent>
      
      <TabsContent value="scheduled">
        {scheduledStreams.length > 0 ? (
          <StreamList 
            streams={scheduledStreams} 
            title="Upcoming Streams" 
            description="Scheduled streams you might be interested in"
          />
        ) : (
          <StreamsEmptyState message="No upcoming streams found" description="Check back later or browse live streams" />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default StreamTabs;
