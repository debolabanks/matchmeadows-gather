
import { File, Image, Mic, Play, Download } from "lucide-react";
import { MessageAttachment as MessageAttachmentType } from "@/types/message";
import { Button } from "@/components/ui/button";

interface MessageAttachmentProps {
  attachment: MessageAttachmentType;
  className?: string;
}

const MessageAttachment = ({ attachment, className }: MessageAttachmentProps) => {
  const renderAttachmentPreview = () => {
    switch (attachment.type) {
      case "image":
        return (
          <div className="relative group">
            <img
              src={attachment.url}
              alt={attachment.name}
              className="max-w-[200px] max-h-[200px] rounded-md object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white" asChild>
                <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                  <Image className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white" asChild>
                <a href={attachment.url} download={attachment.name}>
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        );
      case "audio":
        return (
          <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
            <Mic className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm truncate">{attachment.name}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto flex-shrink-0">
              <Play className="h-3 w-3" />
            </Button>
          </div>
        );
      case "video":
        return (
          <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
            <Play className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm truncate">{attachment.name}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto flex-shrink-0" asChild>
              <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                <Play className="h-3 w-3" />
              </a>
            </Button>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
            <File className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm truncate">{attachment.name}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto flex-shrink-0" asChild>
              <a href={attachment.url} download={attachment.name}>
                <Download className="h-3 w-3" />
              </a>
            </Button>
          </div>
        );
    }
  };

  return (
    <div className={className}>
      {renderAttachmentPreview()}
    </div>
  );
};

export default MessageAttachment;
