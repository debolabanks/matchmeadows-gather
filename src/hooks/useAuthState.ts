
import { useState, useEffect } from "react";
import { User } from "@/contexts/authTypes";
import { supabase } from "@/integrations/supabase/client";
import { useSwipes } from "@/hooks/useSwipes";
import { validateSession, logoutUser } from "@/utils/authUtils";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { initializeSwipes, checkAndResetSwipes, setupTrialForNewUser } = useSwipes();

  useEffect(() => {
    console.log("AuthProvider - Initializing authentication state");
    
    // Set up the Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AuthProvider - Auth state changed:", event, !!session);
        
        // Validate session before proceeding
        if (session && validateSession(session)) {
          try {
            console.log("AuthProvider - User authenticated, fetching profile");
            
            // Get profile data from our profiles table
            let { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) {
              console.error("AuthProvider - Error fetching profile:", profileError);
              
              // If profile not found, create a new one
              if (profileError.code === 'PGRST116') {
                console.log("AuthProvider - Profile not found, creating new profile");
                const { data: newProfile, error: createError } = await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    full_name: session.user.user_metadata?.full_name || "",
                    avatar_url: session.user.user_metadata?.avatar_url || ""
                  })
                  .select()
                  .single();
                
                if (createError) {
                  console.error("AuthProvider - Error creating profile:", createError);
                } else {
                  console.log("AuthProvider - New profile created:", !!newProfile);
                  profileData = newProfile;
                }
              }
            } else {
              console.log("AuthProvider - Profile data fetched:", !!profileData);
            }
            
            // Convert to our app's User format
            const appUser: User = {
              id: session.user.id,
              name: profileData?.full_name || session.user.user_metadata?.full_name || "",
              email: session.user.email || "",
              provider: "email",
              profile: profileData ? {
                bio: profileData.bio,
                location: profileData.location,
                // Map other profile fields as needed
              } : undefined
            };
            
            // Initialize swipes for the user
            let userWithSwipes = initializeSwipes(appUser);
            
            // Set up trial for new users (if event is SIGNED_UP)
            if (event === "SIGNED_UP") {
              userWithSwipes = setupTrialForNewUser(userWithSwipes);
            }
            
            setUser(userWithSwipes);
            localStorage.setItem("matchmeadows_user", JSON.stringify(userWithSwipes));
          } catch (error) {
            console.error("Failed to load user profile:", error);
            logoutUser();
          } finally {
            setIsLoading(false);
          }
        } else {
          // Invalid or no session
          if (session && !validateSession(session)) {
            console.warn("Invalid session detected in auth state change");
            logoutUser();
          }
          
          setUser(null);
          localStorage.removeItem("matchmeadows_user");
          setIsLoading(false);
        }
      }
    );

    // Check for an existing session on load
    const checkAuth = async () => {
      try {
        console.log("AuthProvider - Checking existing auth session");
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("AuthProvider - Error getting session:", sessionError);
          setIsLoading(false);
          return;
        }
        
        // Session validation now handled by the auth state change listener
        if (!session) {
          console.log("AuthProvider - No active session, checking localStorage");
          
          // No active session, check local storage as fallback
          const storedUser = localStorage.getItem("matchmeadows_user");
          
          if (storedUser) {
            try {
              let parsedUser = JSON.parse(storedUser) as User;
              parsedUser = checkAndResetSwipes(parsedUser);
              
              console.log("AuthProvider - Found user in localStorage, verifying with Supabase");
              
              // Verify this user actually exists in Supabase
              const { data, error: userError } = await supabase.auth.getUser();
              
              if (userError) {
                console.error("AuthProvider - Error verifying user:", userError);
                localStorage.removeItem("matchmeadows_user");
              } else if (data.user && data.user.id === parsedUser.id) {
                console.log("AuthProvider - User verified, setting auth state");
                localStorage.setItem("matchmeadows_user", JSON.stringify(parsedUser));
                setUser(parsedUser);
              } else {
                // User data in localStorage doesn't match Supabase
                console.log("AuthProvider - User in localStorage doesn't match Supabase, clearing");
                localStorage.removeItem("matchmeadows_user");
              }
            } catch (error) {
              console.error("Failed to parse stored user:", error);
              localStorage.removeItem("matchmeadows_user");
            }
          }
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoading(false);
      }
    };

    checkAuth();

    // Clean up subscription on unmount
    return () => {
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
