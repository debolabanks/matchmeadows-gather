
/**
 * Error tracking service for the application
 * This service captures and reports errors to the console and can be extended
 * to report to external services like Sentry, LogRocket, etc.
 */
import { toast } from "sonner";

// Types of errors that can be tracked
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

export interface ErrorDetails {
  message: string;
  stack?: string;
  componentName?: string;
  context?: Record<string, any>;
  severity?: ErrorSeverity;
  timestamp?: number;
  userId?: string | null;
}

// Configure based on environment
const isDevelopment = process.env.NODE_ENV === 'development';

// A queue to batch errors
let errorQueue: ErrorDetails[] = [];
const MAX_QUEUE_SIZE = 10;
const FLUSH_INTERVAL = 30000; // 30 seconds

/**
 * Captures and logs an error with additional context
 */
export const captureError = (error: Error | string, options: Partial<ErrorDetails> = {}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;

  const errorDetails: ErrorDetails = {
    message: errorMessage,
    stack: errorStack,
    timestamp: Date.now(),
    severity: options.severity || 'medium',
    componentName: options.componentName,
    context: options.context,
    userId: options.userId,
  };

  // Always log to console in development
  if (isDevelopment) {
    console.error('Error captured:', errorDetails);
  }

  // Queue the error for batch reporting
  queueError(errorDetails);

  // Show error toast for critical/high errors in production
  if (errorDetails.severity === 'critical' || errorDetails.severity === 'high') {
    toast.error('An error occurred', {
      description: isDevelopment ? errorMessage : 'Please try again or contact support if the issue persists.',
      duration: 5000,
    });
  }

  return errorDetails;
};

/**
 * Queue an error for batch reporting
 */
const queueError = (errorDetails: ErrorDetails) => {
  errorQueue.push(errorDetails);

  // If queue reaches threshold, flush immediately
  if (errorQueue.length >= MAX_QUEUE_SIZE) {
    flushErrorQueue();
  }
};

/**
 * Send queued errors to the backend
 */
const flushErrorQueue = async () => {
  if (errorQueue.length === 0) return;

  try {
    const errors = [...errorQueue];
    errorQueue = [];

    // In a real implementation, you would send to your backend or error tracking service
    console.info(`Flushing ${errors.length} errors to backend`);

    // Example of how to send to backend
    // await fetch('/api/log-errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ errors }),
    // });
  } catch (err) {
    console.error('Failed to flush error queue:', err);
    // Re-add errors to queue in case of failure
    errorQueue = [...errorQueue, ...errorQueue];
  }
};

// Set up interval to flush error queue periodically
setInterval(flushErrorQueue, FLUSH_INTERVAL);

/**
 * Asset verification utilities
 */
export const verifyAsset = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    captureError(`Failed to verify asset: ${url}`, { 
      severity: 'medium',
      context: { url, error: (error as Error).message }
    });
    return false;
  }
};

/**
 * Verify all critical assets are loaded correctly
 */
export const verifyAllAssets = async (assets: string[]): Promise<{ 
  success: boolean; 
  failedAssets: string[] 
}> => {
  const results = await Promise.all(
    assets.map(async (asset) => {
      const isValid = await verifyAsset(asset);
      return { asset, isValid };
    })
  );

  const failedAssets = results
    .filter(result => !result.isValid)
    .map(result => result.asset);

  return {
    success: failedAssets.length === 0,
    failedAssets
  };
};
