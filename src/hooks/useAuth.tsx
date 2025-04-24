
import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { validateSession } from "@/utils/authUtils";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    let mounted = true;

    const checkAuthState = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session || !validateSession(session)) {
          console.warn("Invalid or expired session detected");
          if (mounted) {
            localStorage.removeItem("matchmeadows_user");
            navigate("/sign-in");
          }
          return false;
        }
        
        // Session is valid, let's ensure we have the profile data
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
          } else {
            console.log("Profile data fetched:", profile);
          }
        } catch (profileFetchError) {
          console.error("Error in profile fetch:", profileFetchError);
        }
        
        return true;
      } catch (error) {
        console.error("Error checking auth state:", error);
        return false;
      }
    };

    // Initial auth check
    checkAuthState();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, !!session);
        
        if (!session || !validateSession(session)) {
          if (mounted) {
            localStorage.removeItem("matchmeadows_user");
            navigate("/sign-in");
          }
          return;
        }
        
        // On successful auth event, fetch profile
        if (event === 'SIGNED_IN' && session.user) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
              
            if (profileError) {
              console.error("Error fetching profile after sign in:", profileError);
            } else {
              console.log("Profile data after sign in:", profile);
            }
          } catch (profileFetchError) {
            console.error("Error in profile fetch after sign in:", profileFetchError);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return {
    ...context,
    user: context.user || null,
    isAuthenticated: Boolean(context.user),
    isLoading: context.isLoading === undefined ? false : context.isLoading,
    profile: context.user?.profile || {},
    signIn: context.signIn || (async () => undefined),
    signUp: context.signUp || (async () => {}),
    signOut: context.signOut || (async () => {}),
    getSwipesRemaining: context.getSwipesRemaining || (() => 0),
    useSwipe: context.useSwipe || (async () => ({ success: false, remaining: 0 }))
  };
};
