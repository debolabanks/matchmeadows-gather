
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const SplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("SplashScreen - Auth state:", user ? "authenticated" : "unauthenticated");
    
    const timer = setTimeout(() => {
      setShowSplash(false);
      
      console.log("SplashScreen - Redirecting based on auth state:", user ? "to /discover" : "to /");
      
      // Redirect based on authentication state
      if (user) {
        navigate("/discover", { replace: true });
      } else {
        navigate("/", { replace: true });
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
