
import React, { Component, ErrorInfo, ReactNode } from "react";
import { captureError } from "@/services/errorTrackingService";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    captureError(error, {
      componentName: this.props.componentName || 'Unknown',
      context: { errorInfo: errorInfo.componentStack },
      severity: 'high',
    });
    
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 max-w-md mx-auto my-8">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2">
              {process.env.NODE_ENV === 'development' ? (
                <div className="text-xs overflow-auto max-h-40">
                  <p className="font-bold">{this.state.error?.message}</p>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.error?.stack}
                  </pre>
                </div>
              ) : (
                <p>We've encountered an error and our team has been notified.</p>
              )}
            </AlertDescription>
          </Alert>

          <Button 
            variant="outline" 
            onClick={this.handleReset} 
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
