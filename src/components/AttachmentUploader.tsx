
import { useState } from "react";
import { Paperclip, Image, Mic, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageAttachment } from "@/types/message";
import { useToast } from "@/hooks/use-toast";

interface AttachmentUploaderProps {
  onAttach: (attachments: MessageAttachment[]) => void;
  className?: string;
}

const AttachmentUploader = ({ onAttach, className }: AttachmentUploaderProps) => {
  const [pendingAttachments, setPendingAttachments] = useState<MessageAttachment[]>([]);
  const { toast } = useToast();
  
  // This would normally upload to your storage service
  // For this demo, we'll create a local URL
  const handleFileSelect = (type: "image" | "file" | "audio" | "video") => {
    // Create a mock attachment for demonstration
    const newAttachment: MessageAttachment = {
      id: `attachment-${Date.now()}`,
      type,
      url: type === "image" 
        ? "https://images.unsplash.com/photo-1541410965313-d53b3c16ef17?q=80&w=400"
        : "#",
      name: type === "image" 
        ? "photo.jpg" 
        : type === "audio" 
          ? "voice-message.mp3" 
          : type === "video" 
            ? "video.mp4" 
            : "document.pdf",
      size: 1024 * 1024 * 2, // 2MB
    };
    
    setPendingAttachments([...pendingAttachments, newAttachment]);
    
    toast({
      title: "Attachment added",
      description: `${newAttachment.name} has been added to your message`,
    });
  };
  
  const handleFileUpload = () => {
    onAttach(pendingAttachments);
    setPendingAttachments([]);
  };
  
  const removeAttachment = (id: string) => {
    setPendingAttachments(pendingAttachments.filter(a => a.id !== id));
  };
  
  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <Paperclip className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => handleFileSelect("image")}>
              <Image className="h-4 w-4 mr-2" />
              <span>Photo</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileSelect("file")}>
              <File className="h-4 w-4 mr-2" />
              <span>Document</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileSelect("audio")}>
              <Mic className="h-4 w-4 mr-2" />
              <span>Voice Message</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {pendingAttachments.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleFileUpload}>
            Send {pendingAttachments.length} attachment{pendingAttachments.length > 1 ? 's' : ''}
          </Button>
        )}
      </div>
      
      {pendingAttachments.length > 0 && (
        <div className="mt-2 space-y-2">
          {pendingAttachments.map(attachment => (
            <div key={attachment.id} className="flex items-center gap-2 p-2 bg-muted rounded-md">
              {attachment.type === "image" ? (
                <Image className="h-4 w-4" />
              ) : attachment.type === "audio" ? (
                <Mic className="h-4 w-4" />
              ) : (
                <File className="h-4 w-4" />
              )}
              <span className="text-sm truncate flex-1">{attachment.name}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => removeAttachment(attachment.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentUploader;
