
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SignInAlert from "./SignInAlert";

interface SignInFormProps {
  onSuccess?: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { signIn, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the returnTo path from location state, or default to /discover
  const returnTo = location.state?.returnTo || "/discover";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User is authenticated, redirecting to:", returnTo);
      navigate(returnTo);
    }
  }, [isAuthenticated, user, navigate, returnTo]);

  // Check for auth error messages from session storage
  useEffect(() => {
    const sessionErrorMsg = sessionStorage.getItem("auth_error_message");
    if (sessionErrorMsg) {
      setErrorMessage(sessionErrorMsg);
      sessionStorage.removeItem("auth_error_message");
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }
    setLoading(true);

    try {
      console.log("Attempting to sign in with:", { email });
      
      // First, check explicitly for test user
      if (email.toLowerCase() === "test@example.com" && password === "password") {
        // Demo user for testing
        const mockUser = {
          id: "test-user-id",
          name: "Test User",
          email: "test@example.com",
          profile: {
            subscriptionStatus: "active"
          }
        };
        localStorage.setItem("matchmeadows_user", JSON.stringify(mockUser));
        toast({
          title: "Welcome back!",
          description: "Successfully signed in with test account"
        });
        // For the test user, navigate immediately
        navigate(returnTo);
        if (onSuccess) onSuccess();
        return;
      }

      // Use our signIn function to authenticate the user
      const user = await signIn(email, password);
      console.log("Successfully signed in user:", user);

      toast({
        title: "Welcome back!",
        description: user?.profile?.subscriptionStatus === "active" 
          ? "Premium user, successfully signed in" 
          : "Successfully signed in"
      });
      
      // For normal users, don't navigate here - let the useEffect handle it
      // The navigation will happen in the useEffect when isAuthenticated becomes true
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Sign in error:", error);
      if (error instanceof Error) {
        if (error.message.includes("Email not confirmed")) {
          setErrorMessage("Please check your email to confirm your account before signing in.");
        } else if (error.message.includes("Invalid login credentials")) {
          setErrorMessage("Invalid email or password. Please try again.");
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      toast({
        title: "Sign in failed",
        description: "Unable to sign in with provided credentials",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <CardContent className="space-y-4">
        <SignInAlert errorMessage={errorMessage} />
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-sm text-love-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="pt-2 text-sm text-muted-foreground">
          <p>Demo account: test@example.com / password</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-love-600 hover:underline">
            Sign Up
          </Link>
        </div>
        <div className="text-center text-xs text-muted-foreground">
          <Link to="/terms" className="hover:underline">Terms of Use</Link>
          {" • "}
          <Link to="/about" className="hover:underline">About</Link>
        </div>
      </CardFooter>
    </form>
  );
};

export default SignInForm;
