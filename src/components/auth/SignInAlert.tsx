
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignInAlertProps {
  errorMessage: string | null;
}

const SignInAlert: React.FC<SignInAlertProps> = ({ errorMessage }) => {
  if (!errorMessage) return null;
  return (
    <Alert variant="destructive" className="text-sm">
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  );
};

export default SignInAlert;
