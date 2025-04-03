
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FlagOff, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const reportFormSchema = z.object({
  reason: z.string().min(10, {
    message: "Report reason must be at least 10 characters.",
  }),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

interface ReportDialogProps {
  reportType: "profile" | "message" | "stream";
  targetId: string;
  targetName?: string;
  children?: React.ReactNode;
}

const ReportDialog = ({
  reportType,
  targetId,
  targetName,
  children,
}: ReportDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { submitReport } = useAuth();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (data: ReportFormValues) => {
    try {
      await submitReport({
        type: reportType,
        targetId,
        reason: data.reason,
      });
      
      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our community safe.",
      });
      
      setIsOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to submit report",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <FlagOff className="h-4 w-4 mr-2" />
            Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report {reportType}</DialogTitle>
          <DialogDescription>
            {targetName ? `Report ${targetName}'s ${reportType}` : `Report this ${reportType}`}. 
            Your report will be reviewed by our team.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for report</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please describe the issue..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific about why this content violates our community guidelines.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Submit Report</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
