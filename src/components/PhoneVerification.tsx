
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Phone, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const PhoneVerification = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();

  // Check if user already has phone verified
  React.useEffect(() => {
    if (user?.profile?.phoneVerified) {
      setIsVerified(true);
    }
  }, [user]);

  const sendVerificationCode = async () => {
    if (!phoneNumber) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid phone number"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // In a real app, this would call an API to send an SMS
      // For now, we'll simulate sending a code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCodeSent(true);
      toast({
        title: "Verification code sent",
        description: "A 6-digit code has been sent to your phone"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send code",
        description: "Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "Please enter a valid 6-digit code"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // In a real app, this would verify the code with an API
      // For now, we'll simulate verification with any 6-digit code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user profile
      await updateProfile({
        phoneNumber,
        phoneVerified: true
      });
      
      setIsVerified(true);
      toast({
        title: "Phone verified",
        description: "Your phone number has been verified successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "Invalid code or verification expired"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <Check className="h-5 w-5 text-green-500" />
        <p className="text-sm">Phone number verified</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Phone Verification</h3>
      <p className="text-sm text-muted-foreground">
        Verify your phone number to enhance your account security
      </p>

      {!codeSent ? (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <Input
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button 
              onClick={sendVerificationCode} 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Phone className="h-4 w-4 mr-2" />
              )}
              Send Code
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm">Enter the 6-digit code sent to {phoneNumber}</p>
          <div className="flex flex-col space-y-3">
            <InputOTP 
              maxLength={6}
              value={verificationCode}
              onChange={setVerificationCode}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} index={index} />
                  ))}
                </InputOTPGroup>
              )}
            />
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setCodeSent(false)} 
                disabled={isLoading}
              >
                Change Number
              </Button>
              <Button 
                className="flex-1" 
                onClick={verifyCode} 
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Verify
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneVerification;
