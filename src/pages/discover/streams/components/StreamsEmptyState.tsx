
import { Video } from "lucide-react";

interface StreamsEmptyStateProps {
  message?: string;
  description?: string;
}

const StreamsEmptyState = ({ 
  message = "No streams found", 
  description = "Try adjusting your search or filters" 
}: StreamsEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">{message}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default StreamsEmptyState;
