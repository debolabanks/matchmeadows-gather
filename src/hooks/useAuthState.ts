
import { useState, useEffect } from "react";
import { User } from "@/contexts/authTypes";
import { supabase } from "@/integrations/supabase/client";
import { useSwipes } from "@/hooks/useSwipes";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { initializeSwipes, checkAndResetSwipes } = useSwipes();

  useEffect(() => {
    console.log("AuthProvider - Initializing authentication state");
    
    // Set up the Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AuthProvider - Auth state changed:", event, !!session);
        
        if (session && session.user) {
          try {
            // Get profile data from our profiles table
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            console.log("AuthProvider - Profile data fetched:", !!profileData);
            
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
            const userWithSwipes = initializeSwipes(appUser);
            
            setUser(userWithSwipes);
            localStorage.setItem("matchmeadows_user", JSON.stringify(userWithSwipes));
          } catch (error) {
            console.error("Failed to load user profile:", error);
          }
        } else {
          setUser(null);
          localStorage.removeItem("matchmeadows_user");
        }
        
        setIsLoading(false);
      }
    );

    // Check for an existing session on load
    const checkAuth = async () => {
      try {
        console.log("AuthProvider - Checking existing auth session");
        
        const { data: { session } } = await supabase.auth.getSession();
        
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
              const { data } = await supabase.auth.getUser();
              
              if (data.user && data.user.id === parsedUser.id) {
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
