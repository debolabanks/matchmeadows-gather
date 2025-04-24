
import { Separator } from "@/components/ui/separator";
import { Stream } from "@/types/stream";

interface StreamInfoTabProps {
  stream: Stream;
}

const StreamInfoTab = ({ stream }: StreamInfoTabProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-1">About this stream</h3>
        <p className="text-sm text-muted-foreground">{stream.description}</p>
      </div>
      <Separator />
      <div>
        <h3 className="font-semibold mb-2">Started</h3>
        <p className="text-sm">
          {new Date(stream.startTime).toLocaleString()}
        </p>
      </div>
      {stream.tags && stream.tags.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {stream.tags.map(tag => (
                <div key={tag} className="text-xs px-2 py-1 bg-accent rounded-md">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StreamInfoTab;
