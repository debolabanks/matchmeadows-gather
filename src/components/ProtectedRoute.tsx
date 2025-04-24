
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { validateSession } from "@/utils/authUtils";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

const ProtectedRoute = ({ 
  children, 
  redirectPath = "/sign-in" 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [verifyingSession, setVerifyingSession] = useState(true);
  const [sessionValid, setSessionValid] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const validateAuth = async () => {
      if (!mounted) return;
      
      try {
        setVerifyingSession(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          if (mounted) {
            setSessionValid(false);
            setVerifyingSession(false);
          }
          return;
        }

        if (!session || !validateSession(session)) {
          console.warn("Invalid session in protected route, redirecting to:", redirectPath);
          if (mounted) {
            setSessionValid(false);
            setVerifyingSession(false);
          }
          return;
        }
        
        // Session is valid, check if we can access profile data
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error("Error fetching profile in protected route:", profileError);
          } else {
            console.log("Profile data in protected route:", profileData);
          }
        } catch (e) {
          console.error("Error checking profile in protected route:", e);
        }
        
        if (mounted) {
          setSessionValid(true);
          setVerifyingSession(false);
        }
      } catch (e) {
        console.error("Error validating auth:", e);
        if (mounted) {
          setSessionValid(false);
          setVerifyingSession(false);
        }
      }
    };

    validateAuth();

    return () => {
      mounted = false;
    };
  }, [location.pathname, redirectPath, navigate]);

  // Log authentication state for debugging
  useEffect(() => {
    console.log("ProtectedRoute - auth state:", { 
      isAuthenticated, 
      isLoading, 
      verifyingSession,
      sessionValid,
      hasUser: !!user,
      path: location.pathname
    });
  }, [isAuthenticated, isLoading, user, location, verifyingSession, sessionValid]);

  if (isLoading || verifyingSession) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-love-500" />
        <span className="ml-2 text-lg">Verifying authentication...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user || sessionValid === false) {
    console.log("User not authenticated, redirecting from", location.pathname, "to:", redirectPath);
    return <Navigate to={redirectPath} state={{ returnTo: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
