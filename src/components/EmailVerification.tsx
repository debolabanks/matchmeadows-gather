
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Check, Loader2, HelpCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const EmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { toast } = useToast();
  const { user, requestVerification } = useAuth();

  useEffect(() => {
    if (user?.verified) {
      setIsVerified(true);
    } else if (user?.profile?.verificationStatus === "pending") {
      setEmailSent(true);
    }
  }, [user]);

  const sendVerificationEmail = async () => {
    setIsLoading(true);
    
    try {
      await requestVerification();
      setEmailSent(true);
      setShowInstructions(true);
      toast({
        title: "Verification email sent",
        description: "Please check your inbox and follow the link to verify your email"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send verification email",
        description: "Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <Check className="h-5 w-5 text-green-500" />
        <p className="text-sm">Email verified</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Email Verification</h3>
      <p className="text-sm text-muted-foreground">
        Verify your email to secure your account and receive important notifications
      </p>

      {emailSent ? (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-2">
          <p className="text-sm">A verification link has been sent to {user?.email}</p>
          <p className="text-xs text-muted-foreground">
            Didn't receive the email? Check your spam folder or request a new link.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={sendVerificationEmail}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Mail className="h-4 w-4 mr-2" />
              )}
              Resend Email
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  <HelpCircle className="h-3 w-3 mr-1" />
                  How to complete verification
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>How to complete email verification</DialogTitle>
                  <DialogDescription>
                    Follow these steps to verify your email address.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <ol className="list-decimal ml-4 space-y-2">
                    <li>Check your email inbox for a message from MatchMeadows</li>
                    <li>If you don't see it, check your spam or junk folder</li>
                    <li>Open the email and click on the "Verify Email" button or link</li>
                    <li>You'll be redirected to confirm your email address</li>
                    <li>Once verified, return to the app to continue</li>
                  </ol>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium">What happens next?</p>
                    <p className="text-sm text-muted-foreground">
                      Once you've clicked the verification link, your account will be automatically updated
                      in our system. You may need to refresh this page to see the verified status.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        <Button
          onClick={sendVerificationEmail}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Mail className="h-4 w-4 mr-2" />
          )}
          Send Verification Email
        </Button>
      )}
    </div>
  );
};

export default EmailVerification;
