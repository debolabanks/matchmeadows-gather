
import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import * as soundService from "@/services/soundService";
import { verifyAppAssets } from "@/services/monitoringService";
import { captureError } from "@/services/errorTrackingService";
import ErrorBoundary from "@/components/ErrorBoundary";

import { AuthProvider } from "@/contexts/AuthContext";
import { CallProvider } from "@/contexts/CallContext";
import AppRoutes from "@/AppRoutes";

// Create a query client with default options and error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      onError: (error) => {
        captureError(error as Error, {
          severity: 'medium',
          context: { source: 'react-query' }
        });
      }
    },
  },
});

function App() {
  const [isMounted, setIsMounted] = useState(false);
  const [assetsVerified, setAssetsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    // Set mounted state
    setIsMounted(true);
    
    try {
      // Check if meta tags exist and create them if needed
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      let statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      
      // Create meta tags if they don't exist
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.setAttribute('name', 'viewport');
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
        document.head.appendChild(viewportMeta);
      }
      
      if (!statusBarMeta) {
        statusBarMeta = document.createElement('meta');
        statusBarMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
        statusBarMeta.setAttribute('content', 'black-translucent');
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
                captureError(err as Error, { 
                  severity: 'medium',
                  context: { action: 'service-worker-update' }
                });
              });
            })
            .catch(error => {
              console.error('Service Worker registration failed:', error);
              captureError(error as Error, { 
                severity: 'high',
                context: { action: 'service-worker-registration' }
              });
            });
        });
      }

      // Verify critical assets
      verifyAppAssets().then(result => {
        setAssetsVerified(result.success);
      });

      // Safely preload sounds - wrap in try/catch and use timeout
      // to avoid blocking app initialization if there's an audio problem
      setTimeout(() => {
        try {
          if (soundService.isAudioAvailable()) {
            soundService.preloadSounds();
          }
        } catch (error) {
          console.error("Error preloading sounds:", error);
          captureError(error as Error, { 
            severity: 'low', 
            context: { action: 'preload-sounds' }
          });
        }
      }, 1000);
    } catch (error) {
      console.error("Error during App initialization:", error);
      captureError(error as Error, { 
        severity: 'critical',
        context: { action: 'app-initialization' }
      });
    }
  }, []);

  // Add global error handler for uncaught exceptions
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      event.preventDefault();
      captureError(event.error || new Error(event.message), {
        severity: 'critical',
        context: {
          source: 'window.onerror',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      captureError(event.reason || new Error('Unhandled Promise rejection'), {
        severity: 'high',
        context: { source: 'unhandledrejection' }
      });
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Don't render anything until mounted
  if (!isMounted) {
    return null;
  }

  // Return the app with providers in the correct order
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary componentName="App">
          <BrowserRouter>
            <AuthProvider>
              <CallProvider>
                <AppRoutes />
                <Toaster />
              </CallProvider>
            </AuthProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
