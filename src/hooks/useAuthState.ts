
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { useSwipes } from "@/hooks/useSwipes";
import { validateSession, logoutUser } from "@/utils/authUtils";
import { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { initializeSwipes, checkAndResetSwipes } = useSwipes();

  useEffect(() => {
    console.log("AuthProvider - Initializing authentication state");
    
    let mounted = true;

    // Check for stored user in localStorage first for faster loading
    const storedUser = localStorage.getItem("matchmeadows_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && mounted) {
          setUser(parsedUser);
          console.log("AuthProvider - Loaded user from localStorage");
        }
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("matchmeadows_user");
      }
    }

    // Set up the Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AuthProvider - Auth state changed:", event, !!session);
        
        if (!mounted) return;

        // Validate session before proceeding
        if (session && validateSession(session)) {
          try {
            console.log("AuthProvider - User authenticated, fetching profile");
            
            // Store token in localStorage for persistence
            localStorage.setItem("matchmeadows_token", session.access_token);
            
            // Handle profile data or fallback to user metadata
            let profile: Profile | null = null;
            
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              if (!profileError && profileData) {
                profile = profileData;
              }
            } catch (dbError) {
              console.error("Database operation failed:", dbError);
            }
            
            // Convert to our app's User format using available data
            const appUser: User = {
              id: session.user.id,
              name: profile?.full_name || session.user.user_metadata?.full_name || "",
              email: session.user.email || "",
              provider: "email",
              profile: profile ? {
                bio: profile.bio || undefined,
                location: profile.location || undefined,
              } : undefined
            };
            
            if (mounted) {
              const userWithSwipes = initializeSwipes(appUser);
              setUser(userWithSwipes);
              localStorage.setItem("matchmeadows_user", JSON.stringify(userWithSwipes));
            }
          } catch (error) {
            console.error("Failed to load user profile:", error);
            if (mounted) {
              logoutUser();
              setUser(null);
            }
          } finally {
            if (mounted) {
              setIsLoading(false);
            }
          }
        } else {
          if (mounted) {
            setUser(null);
            localStorage.removeItem("matchmeadows_user");
            localStorage.removeItem("matchmeadows_token");
            setIsLoading(false);
          }
        }
      }
    );

    // Check for existing session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && validateSession(session) && mounted) {
        console.log("Found existing session");
        // Session token is already handled in the auth state change handler
      } else if (mounted) {
        setUser(null);
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading
  };
};
