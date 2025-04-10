
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/discover");
    }
  }, [isAuthenticated, navigate]);

  // Check for auth error messages from session storage
  useEffect(() => {
    const sessionErrorMsg = sessionStorage.getItem("auth_error_message");
    if (sessionErrorMsg) {
      setErrorMessage(sessionErrorMsg);
      // Clear the message after retrieving it
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
      const user = await signIn(email, password);
      console.log("Successfully signed in user:", user);
      
      if (user) {
        toast({
          title: "Welcome back!",
          description: `${user.profile?.subscriptionStatus === "active" ? "Premium user, " : ""}Successfully signed in`
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in"
        });
      }
      
      navigate("/discover");
    } catch (error) {
      console.error("Sign in error:", error);
      
      if (error instanceof Error) {
        // Check for specific Supabase auth errors
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
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <Heart className="h-8 w-8 text-love-500 animate-pulse-heart" />
        <span className="font-bold text-2xl text-love-700">MatchMeadows</span>
      </Link>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignIn}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive" className="text-sm">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
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
      </Card>
    </div>
  );
};

export default SignIn;
