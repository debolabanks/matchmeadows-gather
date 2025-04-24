
import { Button } from "@/components/ui/button";

interface SubscriberOnlyMessageProps {
  stream: {
    creatorImage: string;
    creatorName: string;
    title: string;
  };
  onSubscribe: () => void;
}

const SubscriberOnlyMessage = ({ stream, onSubscribe }: SubscriberOnlyMessageProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black">
      <div className="w-24 h-24 mb-4 overflow-hidden rounded-full border-4 border-primary">
        <img 
          src={stream.creatorImage} 
          alt={stream.creatorName}
          className="w-full h-full object-cover" 
        />
      </div>
      <h3 className="text-white text-xl font-bold mb-2">{stream.title}</h3>
      <p className="text-gray-300 mb-6">This content is available to subscribers only</p>
      <Button onClick={onSubscribe} className="animate-pulse">
        Subscribe to Watch
      </Button>
    </div>
  );
};

export default SubscriberOnlyMessage;
