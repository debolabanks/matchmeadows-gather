
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the returnTo path from location state, or default to /discover
  const returnTo = location.state?.returnTo || "/discover";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnTo);
    }
  }, [isAuthenticated, navigate, returnTo]);

  // Check for auth error messages from session storage
  useEffect(() => {
    const sessionErrorMsg = sessionStorage.getItem("auth_error_message");
    if (sessionErrorMsg) {
      setErrorMessage(sessionErrorMsg);
      // Clear the message after retrieving it
      sessionStorage.removeItem("auth_error_message");
    }
    
    // Check if we have a session already
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error checking session:", error);
        return;
      }
      
      if (data.session) {
        console.log("Existing session found:", data.session);
        
        // Verify if we can access the profile data
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .maybeSingle();
            
          console.log("Profile data check:", profileData, profileError);
        } catch (e) {
          console.error("Error checking profile:", e);
        }
      }
    };
    
    checkSession();
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
        
        navigate(returnTo);
        return;
      }
      
      const user = await signIn(email, password);
      console.log("Successfully signed in user:", user);
      
      // After sign in, explicitly fetch profile data to confirm database access
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
          
        console.log("Post-login profile check:", profileData, profileError);
      }
      
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
      
      navigate(returnTo);
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
      </Card>
    </div>
  );
};

export default SignIn;
