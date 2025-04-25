
import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";

import { AuthProvider } from "@/contexts/AuthContext";
import { CallProvider } from "@/contexts/CallContext";
import SplashScreen from "@/components/SplashScreen";
import AppRoutes from "@/AppRoutes";

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function App() {
  const [isMounted, setIsMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    
    // Safely try to preload sounds
    const preloadSounds = async () => {
      try {
        const soundService = await import('@/services/soundService');
        if (typeof soundService.preloadSounds === 'function') {
          soundService.preloadSounds();
        }
      } catch (error) {
        console.error("Error preloading sounds:", error);
      }
    };
    
    preloadSounds();
    
    // Set up viewport meta tags
    try {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(meta);
      
      const statusBarMeta = document.createElement('meta');
      statusBarMeta.name = 'apple-mobile-web-app-status-bar-style';
      statusBarMeta.content = 'black-translucent';
      document.head.appendChild(statusBarMeta);
      
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);
  
      return () => {
        try {
          document.head.removeChild(meta);
          document.head.removeChild(statusBarMeta);
          clearTimeout(timer);
        } catch (error) {
          console.error("Error cleaning up in App component:", error);
        }
      };
    } catch (error) {
      console.error("Error in App component setup:", error);
      setShowSplash(false); // Ensure splash screen is hidden even if there's an error
    }
  }, []);

  if (!isMounted) {
    return null;
  }

  if (showSplash) {
    return <SplashScreen />;
  }

  // Restructured provider hierarchy to fix context issues
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" attribute="class">
            <CallProvider>
              <AppRoutes />
              <Toaster />
            </CallProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
