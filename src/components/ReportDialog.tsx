import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Flag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportDialogProps {
  children?: React.ReactNode;
  reportType: string;
  targetId?: string;
  targetName?: string;
}

const ReportDialog = ({
  children,
  reportType,
  targetId,
  targetName = "content",
}: ReportDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [reportReason, setReportReason] = useState("");
  const { user, submitReport } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "You need to be logged in to report content",
        variant: "destructive",
      });
      return;
    }

    if (!reportReason) {
      toast({
        title: "Please select a reason",
        description: "You need to select a reason for your report",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Make sure to pass both required arguments: content and type
      await submitReport(reportContent, reportReason);
      
      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our community safe",
      });
      setIsOpen(false);
      setReportContent("");
      setReportReason("");
    } catch (error) {
      toast({
        title: "Failed to submit report",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report {targetName}</DialogTitle>
          <DialogDescription>
            Please provide details about why you are reporting this {reportType}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select onValueChange={setReportReason}>
            <SelectTrigger>
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spam">Spam</SelectItem>
              <SelectItem value="offensive">Offensive Content</SelectItem>
              <SelectItem value="harassment">Harassment</SelectItem>
              <SelectItem value="inappropriate">Inappropriate Behavior</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Additional details"
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
