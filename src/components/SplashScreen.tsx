
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { validateSession, logoutUser, redirectToLogin } from "@/utils/authUtils";
import { supabase } from "@/integrations/supabase/client";

const SplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(async () => {
      setShowSplash(false);
      
      console.info("SplashScreen - Auth state:", user ? "authenticated" : "unauthenticated");
      
      // Get current session from Supabase directly
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      
      // Validate session before redirecting
      if (user && session && validateSession(session)) {
        navigate("/discover");
      } else if (user && (!session || !validateSession(session))) {
        console.warn("User exists but session is invalid, logging out");
        logoutUser();
        redirectToLogin("Session could not be confirmed.");
      } else {
        navigate("/");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div className="w-full max-w-md px-8 animate-fade-in">
        <img
          src="/lovable-uploads/1d1e9cd2-571f-458e-9e0d-5b974793983a.png"
          alt="5000 Light Years"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
