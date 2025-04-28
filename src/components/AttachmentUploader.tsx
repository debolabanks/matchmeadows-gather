
import { useState } from "react";
import { Paperclip, Image, Mic, File, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageAttachment } from "@/types/message";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { v4 as uuidv4 } from "uuid";

interface AttachmentUploaderProps {
  onAttach: (attachments: MessageAttachment[]) => void;
  className?: string;
}

const AttachmentUploader = ({ onAttach, className }: AttachmentUploaderProps) => {
  const [pendingAttachments, setPendingAttachments] = useState<MessageAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const uploadFile = async (file: File, type: "image" | "file" | "audio" | "video") => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to upload files",
      });
      return null;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const bucketName = type === "image" ? "message_images" : "message_files";
      
      // For real implementation, upload to Supabase Storage
      // const { data, error } = await supabase.storage
      //  .from(bucketName)
      //  .upload(filePath, file);
      
      // Using a mock URL for demonstration
      const mockUrl = type === "image" 
        ? "https://images.unsplash.com/photo-1541410965313-d53b3c16ef17?q=80&w=400"
        : "#";

      // For demo purposes, we'll create a mock attachment
      const newAttachment: MessageAttachment = {
        id: uuidv4(),
        type,
        url: mockUrl,
        name: file.name,
        size: file.size,
        mimeType: file.type,
      };
      
      setPendingAttachments(prev => [...prev, newAttachment]);
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been added to your message`,
      });
      
      return newAttachment;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (type: "image" | "file" | "audio" | "video") => {
    const input = document.createElement('input');
    input.type = 'file';
    
    if (type === "image") {
      input.accept = "image/*";
    } else if (type === "audio") {
      input.accept = "audio/*";
    } else if (type === "video") {
      input.accept = "video/*";
    }
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await uploadFile(file, type);
      }
    };
    
    input.click();
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
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" disabled={isUploading}>
              {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
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
