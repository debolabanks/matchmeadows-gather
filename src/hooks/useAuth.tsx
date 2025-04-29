
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
        console.log("Checking auth state...");
        
        // First check for token in localStorage
        const storedToken = localStorage.getItem("matchmeadows_token");
        if (storedToken) {
          console.log("Found stored token, attempting to restore session");
          
          try {
            // Set the stored access token in Supabase
            const { error } = await supabase.auth.setSession({
              access_token: storedToken,
              refresh_token: '',  // We don't store refresh token for security
            });
            
            if (error) {
              console.warn("Failed to restore session from stored token:", error.message);
              localStorage.removeItem("matchmeadows_token");
              localStorage.removeItem("matchmeadows_user");
              return false;
            }
          } catch (tokenError) {
            console.error("Error restoring session:", tokenError);
            localStorage.removeItem("matchmeadows_token");
            localStorage.removeItem("matchmeadows_user");
            return false;
          }
        }
        
        // Now check current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session || !validateSession(session)) {
          console.warn("Invalid or expired session detected");
          if (mounted) {
            localStorage.removeItem("matchmeadows_user");
            localStorage.removeItem("matchmeadows_token");
          }
          return false;
        }
        
        console.log("Valid session found, user authenticated");
        // Session is valid, let's ensure we have the profile data
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
          } else if (!profile) {
            console.log("No profile found, creating one...");
            
            // Create a minimal profile
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([
                { 
                  id: session.user.id,
                  full_name: session.user.user_metadata?.full_name || '',
                  username: session.user.email?.split('@')[0] || ''
                }
              ]);
              
            if (insertError) {
              console.error("Failed to create profile:", insertError);
            } else {
              console.log("Profile created successfully");
            }
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
        
        if (event === 'SIGNED_OUT') {
          if (mounted) {
            localStorage.removeItem("matchmeadows_user");
            localStorage.removeItem("matchmeadows_token");
          }
          return;
        }
        
        if (!session || !validateSession(session)) {
          if (mounted) {
            localStorage.removeItem("matchmeadows_user");
            localStorage.removeItem("matchmeadows_token");
          }
          return;
        }
        
        // On successful auth event, fetch profile
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session.user) {
          console.log("User authenticated event detected:", event);
          // Save token to localStorage for persistence
          localStorage.setItem("matchmeadows_token", session.access_token);
          
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
              
            if (profileError) {
              console.error("Error fetching profile after sign in:", profileError);
            } else if (!profile) {
              console.log("No profile found after sign in, creating one...");
              
              // Create a minimal profile
              const { error: insertError } = await supabase
                .from('profiles')
                .insert([
                  { 
                    id: session.user.id,
                    full_name: session.user.user_metadata?.full_name || '',
                    username: session.user.email?.split('@')[0] || ''
                  }
                ]);
                
              if (insertError) {
                console.error("Failed to create profile after sign in:", insertError);
              } else {
                console.log("Profile created successfully after sign in");
              }
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
