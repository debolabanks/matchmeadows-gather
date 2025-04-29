
import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import * as soundService from "@/services/soundService";

import { AuthProvider } from "@/contexts/AuthContext";
import { CallProvider } from "@/contexts/CallContext";
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

  useEffect(() => {
    // Set mounted state
    setIsMounted(true);
    
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    let statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    
    // Create meta tags if they don't exist
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(viewportMeta);
    }
    
    if (!statusBarMeta) {
      statusBarMeta = document.createElement('meta');
      statusBarMeta.name = 'apple-mobile-web-app-status-bar-style';
      statusBarMeta.content = 'black-translucent';
      document.head.appendChild(statusBarMeta);
    }

    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.info('Service Worker registered with scope:', registration.scope);
            
            // Force update the service worker to apply new cache rules
            registration.update().then(() => {
              console.info('Service Worker updated');
            }).catch(err => {
              console.error('Service Worker update failed:', err);
            });
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

    // No need to clean up the meta tags since we're checking if they exist first
  }, []);

  // Don't render anything until mounted
  if (!isMounted) {
    return null;
  }

  // Return the app with providers in the correct order
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <CallProvider>
              <AppRoutes />
              <Toaster />
            </CallProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
