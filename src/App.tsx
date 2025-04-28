
import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import * as soundService from "@/services/soundService";

import { AuthProvider } from "@/contexts/AuthContext";
import { CallProvider } from "@/contexts/CallContext";
import SplashScreen from "@/components/SplashScreen";
import AppRoutes from "@/AppRoutes";

// Create a query client with default options
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
    // Set mounted state
    setIsMounted(true);
    
    // Add meta tags for mobile
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
    document.head.appendChild(viewportMeta);
    
    const statusBarMeta = document.createElement('meta');
    statusBarMeta.name = 'apple-mobile-web-app-status-bar-style';
    statusBarMeta.content = 'black-translucent';
    document.head.appendChild(statusBarMeta);

    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.info('Service Worker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }

    // Safely preload sounds - wrap in try/catch and use timeout
    // to avoid blocking app initialization if there's an audio problem
    setTimeout(() => {
      try {
        if (soundService.isAudioAvailable()) {
          soundService.preloadSounds();
        }
      } catch (error) {
        console.error("Error preloading sounds:", error);
      }
    }, 1000);
    
    // Set timer to hide splash screen
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    // Clean up function
    return () => {
      clearTimeout(timer);
      try {
        document.head.removeChild(viewportMeta);
        document.head.removeChild(statusBarMeta);
      } catch (error) {
        console.error("Error cleaning up meta tags:", error);
      }
    };
  }, []);

  // Don't render anything until mounted
  if (!isMounted) {
    return null;
  }

  // Show splash screen if needed
  if (showSplash) {
    return <SplashScreen />;
  }

  // Return the app with providers in the correct order
  return (
    <React.StrictMode>
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
    </React.StrictMode>
  );
}

export default App;
