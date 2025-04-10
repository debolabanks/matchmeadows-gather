
import React from 'react';
import { useParams } from 'react-router-dom';

const LiveStreamPage = () => {
  const { streamId } = useParams<{ streamId: string }>();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Live Stream: {streamId}</h1>
      <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center text-white mb-6">
        <p className="text-xl">Stream content will appear here</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Stream Details</h2>
          <p className="text-muted-foreground">
            This is a placeholder for the live stream page. In a real implementation, this would
            display the actual live stream content and interactive features.
          </p>
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Live Chat</h3>
          <div className="h-64 overflow-y-auto bg-background rounded-md p-3 mb-3">
            <p className="text-sm text-muted-foreground">
              Chat messages will appear here
            </p>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 p-2 text-sm border rounded-md"
            />
            <button className="bg-primary text-primary-foreground px-3 py-1 rounded-md">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamPage;
