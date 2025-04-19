
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronLeft, ChevronRight, Shield } from "lucide-react";
import EmailVerification from "@/components/EmailVerification";
import PhoneVerification from "@/components/PhoneVerification";
import NotificationsPermission from "@/components/NotificationsPermission";

const Verification = () => {
  const [step, setStep] = useState(1);
  const [totalSteps] = useState(3);
  const [emailVerified, setEmailVerified] = useState(true); // Default to true for demo
  const [phoneVerified, setPhoneVerified] = useState(true); // Default to true for demo
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already completed verification steps
    if (user?.verified) {
      setEmailVerified(true);
    }

    if (user?.profile?.phoneVerified) {
      setPhoneVerified(true);
    }
  }, [user]);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // All steps completed, redirect to terms page
      navigate("/terms-of-use");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const handleNotificationsComplete = (hasPermission: boolean) => {
    setNotificationsEnabled(hasPermission);
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return <EmailVerification />;
      case 2:
        return <PhoneVerification />;
      case 3:
        return <NotificationsPermission onComplete={handleNotificationsComplete} />;
      default:
        return null;
    }
  };

  const getProgressPercentage = () => {
    return (step / totalSteps) * 100;
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return emailVerified || user?.verified;
      case 2:
        return phoneVerified || user?.profile?.phoneVerified;
      case 3:
        return true; // Always allow proceeding from notifications step
      default:
        return false;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-20 md:pt-24 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </div>
            <div className="text-sm font-medium">
              {step === 1 ? "Email Verification" : 
               step === 2 ? "Phone Verification" : 
               "Notifications"}
            </div>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
          <CardTitle className="text-2xl mt-4">Account Verification</CardTitle>
          <CardDescription>
            Secure your account and enhance your experience
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {getStepContent()}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-3">
          <div className="flex w-full space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleBack}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {step === totalSteps ? (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Continue
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
          
          {step < totalSteps && (
            <Button 
              variant="ghost" 
              className="text-sm"
              onClick={handleNext}
            >
              Skip for now
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Verification;
