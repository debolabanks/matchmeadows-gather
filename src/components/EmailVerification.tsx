
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const EmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
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
          <Button
            variant="outline"
            size="sm"
            onClick={sendVerificationEmail}
            disabled={isLoading}
            className="mt-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Resend Email
          </Button>
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
