
/**
 * Monitoring service for API calls and asset loading
 */
import { captureError, verifyAllAssets } from "./errorTrackingService";

// Critical assets to verify on startup
export const CRITICAL_ASSETS = [
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
  '/assets/new-message.mp3',
  '/assets/incoming-call.mp3',
];

// Custom fetch with monitoring
export const monitoredFetch = async (url: string, options?: RequestInit) => {
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, options);
    
    const duration = Date.now() - startTime;
    
    // Log slow requests
    if (duration > 2000) {
      console.warn(`Slow API call: ${options?.method || 'GET'} ${url} took ${duration}ms`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      captureError(`API error: ${response.status} ${response.statusText}`, {
        severity: 'high',
        context: {
          url,
          method: options?.method || 'GET',
          status: response.status,
          response: errorText.substring(0, 500), // Limit size
          duration,
        }
      });
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error) {
    captureError(error as Error, {
      severity: 'high',
      context: {
        url,
        method: options?.method || 'GET',
        duration: Date.now() - startTime,
      },
    });
    throw error;
  }
};

// Verify all critical assets on application startup
export const verifyAppAssets = async () => {
  console.info('Verifying application assets...');
  const result = await verifyAllAssets(CRITICAL_ASSETS);
  
  if (!result.success) {
    console.error('Failed to load some assets:', result.failedAssets);
    captureError('Failed to load critical assets', {
      severity: 'high',
      context: { failedAssets: result.failedAssets }
    });
  } else {
    console.info('All critical assets verified successfully.');
  }
  
  return result;
};
