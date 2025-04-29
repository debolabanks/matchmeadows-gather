
/**
 * Developer utilities for debugging
 * These functions will only work in development mode
 */

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

/**
 * Enhanced console logging with prefixes and colors
 */
export const logger = {
  info: (message: string, ...args: any[]) => {
    if (isDev) {
      console.info(
        `%c INFO %c ${message}`, 
        'background: #3b82f6; color: white; border-radius: 2px; padding: 2px 4px;', 
        'color: #3b82f6;', 
        ...args
      );
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (isDev) {
      console.warn(
        `%c WARN %c ${message}`, 
        'background: #f59e0b; color: white; border-radius: 2px; padding: 2px 4px;', 
        'color: #f59e0b;', 
        ...args
      );
    }
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(
      `%c ERROR %c ${message}`, 
      'background: #ef4444; color: white; border-radius: 2px; padding: 2px 4px;', 
      'color: #ef4444;', 
      ...args
    );
  },
  
  debug: (message: string, ...args: any[]) => {
    if (isDev) {
      console.debug(
        `%c DEBUG %c ${message}`, 
        'background: #a855f7; color: white; border-radius: 2px; padding: 2px 4px;', 
        'color: #a855f7;', 
        ...args
      );
    }
  },
  
  api: (method: string, url: string, status: number, ...args: any[]) => {
    if (isDev) {
      const isSuccess = status >= 200 && status < 300;
      console.log(
        `%c API %c ${method} %c ${url} %c ${status}`, 
        'background: #64748b; color: white; border-radius: 2px 0 0 2px; padding: 2px 4px;',
        'background: #334155; color: white; padding: 2px 4px;',
        'background: #334155; color: white; padding: 2px 4px;',
        `background: ${isSuccess ? '#22c55e' : '#ef4444'}; color: white; border-radius: 0 2px 2px 0; padding: 2px 4px;`,
        ...args
      );
    }
  }
};

/**
 * Check if static assets are correctly deployed and accessible
 */
export const checkAsset = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    logger.info(`Asset check: ${url} - ${response.ok ? 'OK' : 'FAILED'}`);
    return response.ok;
  } catch (error) {
    logger.error(`Asset check failed: ${url}`, error);
    return false;
  }
};

/**
 * Check server API health
 */
export const checkApiHealth = async (url: string): Promise<boolean> => {
  try {
    const startTime = performance.now();
    const response = await fetch(url);
    const duration = performance.now() - startTime;
    
    logger.api('GET', url, response.status, `${duration.toFixed(0)}ms`);
    
    return response.ok;
  } catch (error) {
    logger.error(`API health check failed: ${url}`, error);
    return false;
  }
};

/**
 * Gather system information for reporting
 */
export const getSystemInfo = (): Record<string, any> => {
  if (!isDev) return {};
  
  try {
    const info: Record<string, any> = {
      userAgent: window.navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      pixelRatio: window.devicePixelRatio,
      connection: 'connection' in navigator ? 
        // @ts-ignore - Navigator connection API
        (navigator.connection?.effectiveType || 'unknown') : 'unknown',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer,
      performance: {}
    };
    
    // Add performance metrics if available
    if ('performance' in window) {
      const perf = window.performance;
      const navTiming = perf.timing;
      
      if (navTiming) {
        info.performance = {
          loadTime: navTiming.loadEventEnd - navTiming.navigationStart,
          domReady: navTiming.domComplete - navTiming.domLoading,
          ttfb: navTiming.responseStart - navTiming.requestStart,
          domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.navigationStart,
        };
      }
      
      // Add paint timing metrics
      if (perf.getEntriesByType) {
        const paintMetrics = perf.getEntriesByType('paint');
        paintMetrics.forEach(metric => {
          info.performance[metric.name] = metric.startTime;
        });
      }
    }
    
    return info;
  } catch (error) {
    logger.error('Error collecting system info', error);
    return { error: 'Failed to collect system info' };
  }
};
